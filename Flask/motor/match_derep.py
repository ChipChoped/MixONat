import datetime

from motor.data_structures import Spectrum, SDF, MolShifts, DerepResult, DerepResults, MixtureResults
from motor.miscellaneous import diff_list
from motor import about
from motor.mol_img_gen import MolsToGridImage
import os
import itertools
from motor.extract_ctypes import *

def _is_allowed_mol_weight(mol_weight, allowed_mol_weights):
    """
    Returns true if a molecule with a given molecular weight is allowed according to the allowed_mol_weights constraint
    If allowed_mol_weight is a tuple, then the allowed weights are in the range of the the two first values
    If allowed_mol_weight is a list, then the allowed weights are in the neighborhood of one of the values
    If allowed_mol_weight is None, then all the weights are allowed
    :param mol_weight:
    :param allowed_mol_weights:
    :return:
    """

    if isinstance(allowed_mol_weights, tuple):
        return (mol_weight >= float(allowed_mol_weights[0])) and (mol_weight <= float(allowed_mol_weights[1]))
    elif isinstance(allowed_mol_weights, list):
        allowed = False
        for FW in allowed_mol_weights:
            if (mol_weight >= float(FW) - 1) and (mol_weight <= float(FW) + 1):
                allowed = True
                break
        return allowed
    else:
        return True


def _write_results_to_file(results, output_dir, output_file):
    """
    Writes the results of the matching process in the specified file
    :param results:
    :param output_file:
    :return:
    """

    with open(os.path.join(output_dir, output_file), "a+") as output_file:
        output_file.write(str(results))


def _save_grid_mols_img(results, output_dir, output_file_path):
    """
    Computes and saves the grid molecules image
    :param results:
    :param output_file_path:
    :return:
    """

    if results.matched_structures:
        page = 1
        previous_structure = 0
        structure = results.results_nb_per_page

        while structure < len(results.matched_structures) + results.results_nb_per_page:
            try:
                structures = MolsToGridImage(results.matched_structures[previous_structure:structure],
                                             molsPerRow=5, subImgSize=(350, 600),
                                             highlightAtomLists=results.highlights[
                                                                previous_structure:structure],
                                             legends=results.legends[previous_structure:structure],
                                             results=results[previous_structure:structure])

                structures.save(os.path.join(output_dir, "[" + str(page) + "] " + str(output_file_path)))

                page += 1
                previous_structure += results.results_nb_per_page
                structure += results.results_nb_per_page
            except:
                print("ERROR: Could not draw structure in rank " + str(previous_structure + 1))
                previous_structure += 1
                structure += 1

def mixture_composition_suggestion(results_derep, mix_complexity, minimal_score_mix, allowed_mol_weights, sdf_cont,
                                   spectrum, spectrum135, spectrum90, looseness, output_dir):
    """
    Performs a mixture composition suggestion
    :param results_derep:
    :param mix_complexity:
    :param minimal_score_mix:
    :param allowed_mol_weights:
    :param sdf_cont:
    :param spectrum:
    :param spectrum135:
    :param spectrum90:
    :param looseness:
    :return:
    """

    id_results = [result.id_mol for result in results_derep]
    shifts_results = [result.matched_all_shifts_spectrum for result in results_derep]

    # Results container initialization
    results = MixtureResults(allowed_mol_weights, sdf_cont.name, spectrum, spectrum90, spectrum135, looseness,
                             minimal_score_mix)

    combo = []

    for combination in itertools.combinations(shifts_results, mix_complexity):
        combo.append(combination)

    molecule_combo = [[] * x for x in range(len(combo))]
    combo_2 = [[] * x for x in range(len(combo))]

    for x in range(len(combo)):
        for y in range(len(combo[x])):
            if combo[x][y] in shifts_results:
                index_molecule = shifts_results.index(combo[x][y])
                molecule_combo[x].append(id_results[index_molecule])
            for z in combo[x][y]:
                if z not in combo_2[x]:
                    combo_2[x].append(z)

    score_mix = []

    for x in combo_2:
        mix_score = round(float(len(x)) / float(len(spectrum.shifts)), 2)
        score_mix.append(mix_score)

    for x in range(len(score_mix)):
        if score_mix[x] >= minimal_score_mix:
            results.add_result((molecule_combo[x], score_mix[x], combo_2[x]))

    date = datetime.datetime.now()
    output_file_name_mix = "Mixture results with " + str(mix_complexity) + " molecules " + str(
        spectrum.name) + " " + str(date.hour) + "h" + str(date.minute) + "m" + str(date.second) + "s" ".txt"

    # Sorting the Result object inner list
    results.end_research()

    # Writing results to disk
    _write_results_to_file(results, output_dir, output_file_name_mix)


def _extract_mol_info_sdf(mol):
    """
    Extracts the id, the molecular weight, the CAS and the name from a sdf molecule
    :return:
    """

    id_mol = mol.GetProp("ID")
    mol_weight = round(float(mol.GetProp("FW")), 2)
    try:
        cas = mol.GetProp("CAS")
    except:
        cas = False
    try:
        mol_name = mol.GetProp("Name")
    except:
        mol_name = False

    return id_mol, mol_weight, cas, mol_name


def _record_matched_shift(spectrum_shifts, sdf_shifts, sdf_at_idx, shift_idx, shift_sdf_idx,
                          matched_shifts_spectrum, matched_shifts_sdf, matched_atoms_index_sdf, already_used_sdf_idx,
                          spectrum_intensities, matched_spectrum_intensities):
    """
    Records that a sdf shift has been matched with a spectrum shift into the concerned lists
    :param spectrum:
    :param mol_sh:
    :param shift_idx:
    :param shift_sdf_idx:
    :param matched_shifts_spectrum:
    :param matched_shifts_sdf:
    :param matched_atoms_index_sdf:
    :param already_used_sdf_idx:
    :return:
    """

    # Recording the matched spectrum shift
    matched_shifts_spectrum.append(spectrum_shifts[shift_idx])

    # Recording the matched sdf shift
    matched_shifts_sdf.append(sdf_shifts[shift_sdf_idx])

    # Recording the index of the atom in the sdf molecule of the corresponding matched sdf shift
    matched_atoms_index_sdf.append(sdf_at_idx[shift_sdf_idx])

    # Recording that the sdf shift has already been used
    already_used_sdf_idx.append(shift_sdf_idx)

    # Recording the intensity of the matched spectrum shift
    matched_spectrum_intensities.append(spectrum_intensities[shift_idx])


def _sort_spectrum_heuristic_sum_distances(spectrum_shifts, spectrum_intensities, sdf_shifts):
    """
    Sorts spectrum shifts according to a heuristic, such that the shifts that should make the most matches are compared
    first with the sdf shifts.

    The heuristic is to sum for each spectrum shift the distance with all the sdf shifts, then to sort the
    spectrum shifts by increasing squared distance sum value.
    :param spectrum:
    :param sdf_shifts:
    :return:
    """

    # Contains the distance between each spectrum shift and all the sdf shifts
    distances_sum = np.zeros((len(spectrum_shifts),))

    # Computing heuristic sum value for each shift of the spectrum
    for i, spectrum_shift in enumerate(spectrum_shifts):
        for sdf_shift in sdf_shifts:
            distances_sum[i] += abs(spectrum_shift - sdf_shift)

    # Returning sorted arrays of spectrum shifts and intensities according to the heuristic
    return [x for _, x in sorted(zip(distances_sum, spectrum_shifts), reverse=False)], \
           [x for _, x in sorted(zip(distances_sum, spectrum_intensities), reverse=False)]


def _match_sdf_spectrum(sdf_shifts, sdf_at_idx, looseness_factor, spectrum_shifts, spectrum_intensities,
                        equivalent_carbons, incremental_looseness, heuristic_sorting):
    """
    Function that matched a spectrum with a sdf molecule
    :param mol_sh:
    :param looseness_factor:
    :param spectrum:
    :param equivalent_carbons:
    :param cumulated_abs_diff:
    :return:
    """
    matched_shifts_spectrum = []
    matched_shifts_sdf = []
    matched_atoms_index_sdf = []
    matched_shifts_intensities = []
    already_used_sdf_idx = []
    already_used_spectrum_idx = []

    # Sorting spectrum shifts according to heuristic if specified
    if heuristic_sorting:
        spectrum_shifts, spectrum_intensities = _sort_spectrum_heuristic_sum_distances(spectrum_shifts,
                                                                                       spectrum_intensities, sdf_shifts)

    # Determining the looseness start variable depending on the incremental looseness parameter
    if incremental_looseness:
        looseness_start = 0.0
    else:
        looseness_start = looseness_factor

    # Iteration over looseness values between looseness_start and looseness_factor with steps of 0.1
    for l in np.arange(looseness_start, looseness_factor + 0.01, 0.1):

        # Iteration over all couples of spectrum shifts and sdf shifts
        for shift_idx in range(len(spectrum_shifts)):
            for shift_sdf_idx in range(len(sdf_shifts)):

                # Only unused sdf shifts that match the current spectrum shift can lead to a match
                if shift_sdf_idx not in already_used_sdf_idx and \
                        abs(spectrum_shifts[shift_idx] - sdf_shifts[shift_sdf_idx]) <= l:

                    match = False

                    # Matching if equivalent carbons are allowed and if the shift has more occurrences in the sdf
                    # molecule than the number of occurrences of the spectrum shift in the matched spectrum shifts
                    # and if the spectrum shift can still be used
                    if equivalent_carbons:
                        if sdf_shifts.count(sdf_shifts[shift_sdf_idx]) > \
                                matched_shifts_spectrum.count(spectrum_shifts[shift_idx]) \
                                and shift_idx not in already_used_spectrum_idx:
                                    match = True

                                    # Recording the spectrum shift as unusable again if the next sdf shift is different from
                                    # the current sdf shift
                                    if shift_sdf_idx != len(sdf_shifts) - 1 and \
                                            sdf_shifts[shift_sdf_idx] != sdf_shifts[shift_sdf_idx + 1]:
                                        already_used_spectrum_idx.append(shift_idx)

                    # If equivalent carbons are allowed, matching only if the spectrum shift has not already been
                    # used for a different match
                    elif shift_idx not in already_used_spectrum_idx:

                        match = True
                        already_used_spectrum_idx.append(shift_idx)

                    # Recording the match if it is allowed
                    if match:
                        # Recording the matched shift
                        _record_matched_shift(spectrum_shifts,
                                              sdf_shifts, sdf_at_idx, shift_idx,
                                              shift_sdf_idx, matched_shifts_spectrum,
                                              matched_shifts_sdf, matched_atoms_index_sdf,
                                              already_used_sdf_idx, spectrum_intensities,
                                              matched_shifts_intensities)

    # Computing a sorted list containing all the couples of matched shifts in the form (spectrum_shift, sdf_shift).
    # The list is sorted on the spectrum shifts values
    matched_shifts = sorted(list(zip(matched_shifts_spectrum, matched_shifts_sdf, matched_atoms_index_sdf,
                                     matched_shifts_intensities)))

    # Extracting the lists of all the matched spectrum shifts and of the associated sdf shifts. Both list are sorted
    # on the ascending sort of matched_spectrum_shifts
    matched_shifts_spectrum = [x for (x, _, _, _) in matched_shifts]
    matched_shifts_sdf = [y for (_, y, _, _) in matched_shifts]
    matched_atoms_index_sdf = [z for (_, _, z, _) in matched_shifts]
    matched_shifts_intensities = [w for (_, _, _, w) in matched_shifts]

    not_matched_shifts_sdf = diff_list(sdf_shifts, matched_shifts_sdf)
    not_matched_atoms_index_sdf = diff_list(sdf_at_idx, matched_atoms_index_sdf)

    # Matching optimization
    matched_shifts_sdf, matched_atoms_index_sdf = \
        _optimize_matching(matched_shifts_spectrum, matched_shifts_sdf, looseness_factor, matched_atoms_index_sdf)

    # Returning all results
    return matched_shifts_spectrum, matched_shifts_sdf, matched_shifts_intensities, \
           not_matched_shifts_sdf, not_matched_atoms_index_sdf, matched_atoms_index_sdf, spectrum_shifts


def _optimize_matching(spectrum_shifts, sdf_shifts, looseness_factor,
                       matched_atoms_index_sdf):
    """
    Optimization of a matching. All the shifts are left untouched (there is no adding nor deletion of any shift of the
    matching), but some sdf shifts can exchange their associated spectrum shift.
    We are looking for local improvements of the error : sets of cardinality < 5 of adjacent spectrum shifts and whose
    difference between max and min values is less or equal than the looseness_factor parameter are selected. For these
    sets, all the permutation of spectrum values are tested and the initial permutation is exchanged with the one that
    produces the minimal local error.
    :param spectrum_shifts:
    :param spectrum_intensities:
    :param sdf_shifts:
    :param looseness_factor:
    :param cumulated_abs_diff:
    :param matched_atoms_index_sdf:
    :return:
    """

    # Loading data as numpy arrays to facilitate and speed up the operations
    spectrum_shifts = np.array(spectrum_shifts)
    sdf_shifts = np.array(sdf_shifts)
    matched_atoms_index_sdf = np.array(matched_atoms_index_sdf)

    # Iterating over all the spectrum shifts
    for i in range(len(spectrum_shifts)):

        # Creating the set of indexes of the selected adjacent spectrum shifts. Only contains current shift for now.
        analogous_shifts_idx = [i]

        # Iterating over next spectrum shifts
        for j in range(i + 1, len(spectrum_shifts)):

            # Adding the adjacent spectrum value iff. the difference between the max and the min elements of the set is
            # below the looseness factor, and if the current cardinality of the set is below 4.
            if max(max(spectrum_shifts[analogous_shifts_idx]), spectrum_shifts[j]) - \
                    min(min(spectrum_shifts[analogous_shifts_idx]), spectrum_shifts[j]) < looseness_factor \
                    and len(analogous_shifts_idx) < 4:
                analogous_shifts_idx.append(j)
            # If the above conditions are not satisfied, the set is processed in its current value
            else:
                break

        # Loading indexes of the set as a np array to allow access with indices
        analogous_shifts_idx = np.array(analogous_shifts_idx)

        # Computing current local error and recording the best permutation so far (the initial ones)
        initial_local_error = np.sum(
            np.abs(np.subtract(spectrum_shifts[analogous_shifts_idx], sdf_shifts[analogous_shifts_idx])))
        curr_min_error = initial_local_error
        best_permutation = analogous_shifts_idx

        # Computing the complete set of permutations
        permutations_idx = list(itertools.permutations(analogous_shifts_idx))
        change = False

        # Iterating over all the permutations
        for permutation_idx in permutations_idx:
            permutation_idx = np.array(permutation_idx)

            # Computing the local error of the current permutation
            permut_error = np.sum(np.abs(np.subtract(spectrum_shifts[permutation_idx],
                                                     sdf_shifts[analogous_shifts_idx])))

            # Recording the new best permutation if the local error is lower
            if permut_error < curr_min_error:
                best_permutation = permutation_idx
                curr_min_error = permut_error
                change = True

        # If there exists a better permutation, updating the matches
        if change:
            sdf_shifts[analogous_shifts_idx] = sdf_shifts[best_permutation]
            matched_atoms_index_sdf[analogous_shifts_idx] = matched_atoms_index_sdf[best_permutation]

    return sdf_shifts.tolist(), matched_atoms_index_sdf.tolist()


def _matching_process_no_dept(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor, spectrum,
                              incremental_looseness, heuristic_sorting):
    """
       Matching process for spectum only
       :param sdf_cont:
       :param results:
       :param equivalent_carbons:
       :param allowed_mol_weights:
       :param looseness_factor:
       :param spectrum:
       :return:
       """

    for idx, mol in enumerate(sdf_cont.sdf_chem_obj):

        # Reading the shifts of the molecule
        mol_sh = MolShifts(mol)

        # Matching procedure
        matched_no_dept_shifts_spectrum, matched_no_dept_shifts_sdf, \
        matched_no_dept_shifts_intensities, not_matched_all_shifts_sdf, not_matched_all_shifts_atoms_index_sdf, \
        matched_all_atoms_index_sdf, spectrum_shifts = _match_sdf_spectrum(mol_sh.all_shifts, mol_sh.all_at_idx,
                                                                           looseness_factor, spectrum.shifts,
                                                                           spectrum.intensities,
                                                                           equivalent_carbons,
                                                                           incremental_looseness,
                                                                           heuristic_sorting)

        # Extracting mol info from sdf
        id_mol, mol_weight, cas, mol_name = _extract_mol_info_sdf(mol)

        # Adding the results to the list of results if its weight is allowed
        if _is_allowed_mol_weight(mol_weight, allowed_mol_weights):
            results.add_result(DerepResult(mol, id_mol, mol_name, cas, mol_weight, mol_sh.all_shifts,
                                           matched_no_dept_shifts_spectrum=matched_no_dept_shifts_spectrum,
                                           matched_no_dept_shifts_sdf=matched_no_dept_shifts_sdf,
                                           matched_no_dept_shifts_intensities=matched_no_dept_shifts_intensities,
                                           not_matched_no_dept_shifts_sdf=not_matched_all_shifts_sdf,
                                           matched_no_dept_atoms_sdf=matched_all_atoms_index_sdf,
                                           spectrum_shifts=spectrum_shifts,
                                           not_matched_no_dept_atoms_sdf=not_matched_all_shifts_atoms_index_sdf))


def _matching_process_dept_135(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor, spectrum,
                               spectrum135, incremental_looseness, heuristic_sorting):
    """
    Matching process if dept 135 spectrum is available
    :param sdf_cont:
    :param results:
    :param equivalent_carbons:
    :param allowed_mol_weights:
    :param looseness_factor:
    :param spectrum:
    :param spectrum135:
    :param incremental_looseness:
    :return:
    """

    # Extracting the shifts values and intensities of all the distinguishable carbon types
    quaternaries_shifts_spectrum, quaternaries_shifts_intensities, tertiaries_and_primaries_shifts_spectrum, \
    tertiaries_and_primaries_shifts_intensities, secondaries_shifts_spectrum, secondaries_shifts_intensities = \
        extract_ctypes_dept_135(spectrum, spectrum135)

    # Trying to match all the molecules of the SDF
    for mol in sdf_cont.sdf_chem_obj:

        # Reading the shifts of the molecule
        mol_sh = MolShifts(mol)

        # Matching procedure of quaternaries
        matched_quaternaries_spectrum, matched_quaternaries_sdf, \
        matched_quaternaries_intensities, not_matched_quaternaries_sdf, not_matched_quaternaries_at_index_sdf, \
        matched_quaternaries_at_index_sdf, \
        quateriaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.quat_shifts, mol_sh.quat_at_idx, looseness_factor,
                                                           quaternaries_shifts_spectrum,
                                                           quaternaries_shifts_intensities,
                                                           equivalent_carbons,
                                                           incremental_looseness,
                                                           heuristic_sorting)

        # Matching procedure of ternaries and primaries
        matched_tertiaries_and_primaries_spectrum, matched_tertiaries_and_primaries_sdf, \
        matched_tertiaries_and_primaries_intensities, not_matched_tertiaries_and_primaries_sdf, \
        not_matched_tertiaries_and_primaries_at_index_sdf, matched_tertiaries_and_primaries_at_index_sdf, \
        tertiaries_and_primaries_spectrum_shifts = \
            _match_sdf_spectrum(mol_sh.prim_ter_shifts, mol_sh.prim_ter_at_idx, looseness_factor,
                                tertiaries_and_primaries_shifts_spectrum, tertiaries_and_primaries_shifts_intensities,
                                equivalent_carbons, incremental_looseness, heuristic_sorting)

        # Matching procedure of secondaries
        matched_secondaries_spectrum, matched_secondaries_sdf, \
        matched_secondaries_intensities, not_matched_secondaries_sdf, not_matched_secondaries_at_index_sdf, \
        matched_secondaries_at_index_sdf, \
        secondaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.sec_shifts, mol_sh.sec_at_idx, looseness_factor,
                                                          secondaries_shifts_spectrum, secondaries_shifts_intensities,
                                                          equivalent_carbons, incremental_looseness,
                                                          heuristic_sorting)

        # Extracting mol info from sdf
        id_mol, mol_weight, cas, mol_name = _extract_mol_info_sdf(mol)

        # Adding the result to the list if its weight is allowed
        if _is_allowed_mol_weight(mol_weight, allowed_mol_weights):
            results.add_result(DerepResult(mol, id_mol, mol_name, cas, mol_weight,
                                           matched_quat_spectrum=matched_quaternaries_spectrum,
                                           matched_quat_sdf=matched_quaternaries_sdf,
                                           matched_ter_prim_spectrum=matched_tertiaries_and_primaries_spectrum,
                                           matched_ter_prim_sdf=matched_tertiaries_and_primaries_sdf,
                                           matched_sec_spectrum=matched_secondaries_spectrum,
                                           matched_sec_sdf=matched_secondaries_sdf,
                                           all_shifts_sdf=mol_sh.all_shifts,
                                           matched_quat_intensities=matched_quaternaries_intensities,
                                           matched_ter_prim_intensities=matched_tertiaries_and_primaries_intensities,
                                           matched_sec_intensities=matched_secondaries_intensities,
                                           not_matched_quat_sdf=not_matched_quaternaries_sdf,
                                           not_matched_ter_prim_sdf=not_matched_tertiaries_and_primaries_sdf,
                                           not_matched_sec_sdf=not_matched_secondaries_sdf,
                                           matched_quat_atoms_sdf=matched_quaternaries_at_index_sdf,
                                           matched_ter_prim_atoms_sdf=matched_tertiaries_and_primaries_at_index_sdf,
                                           matched_sec_atoms_sdf=matched_secondaries_at_index_sdf,
                                           not_matched_quat_atoms_sdf=not_matched_quaternaries_at_index_sdf,
                                           not_matched_ter_prim_atoms_sdf=not_matched_tertiaries_and_primaries_at_index_sdf,
                                           not_matched_sec_atoms_sdf=not_matched_secondaries_at_index_sdf,
                                           spectrum_shifts=spectrum.shifts))


def _matching_process_dept_135_90(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor,
                                  spectrum, spectrum135, spectrum90, incremental_looseness, heuristic_sorting):
    """
    Matching process if dept 135 and dept 90 are available
    :param sdf_cont:
    :param results:
    :param equivalent_carbons:
    :param allowed_mol_weights:
    :param looseness_factor:
    :param spectrum:
    :param spectrum135:
    :param spectrum90:
    :param incremental_looseness:
    :return:
    """

    # Extracting the shifts values and intensities of all the distinguishable carbon types
    quaternaries_shifts_spectrum, quaternaries_shifts_intensities, tertiaries_shifts_spectrum, \
    tertiaries_shifts_intensities, secondaries_shifts_spectrum, secondaries_shifts_intensities, \
    primaries_shifts_spectrum, primaries_shifts_intensities = \
        extract_ctypes_dept_135_90(spectrum, spectrum135, spectrum90)

    for mol in sdf_cont.sdf_chem_obj:

        # Reading the shifts of the molecule
        mol_sh = MolShifts(mol)

        # Matching procedure of quaternaries
        matched_quaternaries_spectrum, matched_quaternaries_sdf, \
        matched_quaternaries_intensities, not_matched_quaternaries_sdf, \
        not_matched_quaternaries_at_index_sdf, matched_quaternaries_at_index_sdf, \
        quateriaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.quat_shifts, mol_sh.quat_at_idx, looseness_factor,
                                                           quaternaries_shifts_spectrum,
                                                           quaternaries_shifts_intensities,
                                                           equivalent_carbons,
                                                           incremental_looseness,
                                                           heuristic_sorting)

        # Matching procedure of tertiaries
        matched_tertiaries_spectrum, matched_tertiaries_sdf, \
        matched_tertiaries_intensities, not_matched_tertiaries_sdf, not_matched_tertiaries_at_index_sdf,\
        matched_tertiaries_at_index_sdf, \
        tertiaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.ter_shifts, mol_sh.ter_at_idx, looseness_factor,
                                                         tertiaries_shifts_spectrum,
                                                         tertiaries_shifts_intensities,
                                                         equivalent_carbons, incremental_looseness,
                                                         heuristic_sorting)

        # Matching procedure of secondaries
        matched_secondaries_spectrum, matched_secondaries_sdf, \
        matched_secondaries_intensities, not_matched_secondaries_sdf, not_matched_secondaries_at_index_sdf, \
        matched_secondaries_at_index_sdf, \
        secondaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.sec_shifts, mol_sh.sec_at_idx, looseness_factor,
                                                          secondaries_shifts_spectrum, secondaries_shifts_intensities,
                                                          equivalent_carbons, incremental_looseness, heuristic_sorting)

        # Matching procedure of primaries
        matched_primaries_spectrum, matched_primaries_sdf, \
        matched_primaries_intensities, not_matched_primaries_sdf, not_matched_primaries_at_index_sdf,\
        matched_primaries_at_index_sdf, \
        primaries_spectrum_shifts = _match_sdf_spectrum(mol_sh.prim_shifts, mol_sh.prim_at_idx, looseness_factor,
                                                        primaries_shifts_spectrum, primaries_shifts_intensities,
                                                        equivalent_carbons, incremental_looseness, heuristic_sorting)

        # Extracting mol info from sdf
        id_mol, mol_weight, cas, mol_name = _extract_mol_info_sdf(mol)

        # Adding the result to the list if its weight is allowed
        if _is_allowed_mol_weight(mol_weight, allowed_mol_weights):
            results.add_result(DerepResult(mol, id_mol, mol_name, cas, mol_weight, mol_sh.all_shifts,
                                           matched_quat_spectrum=matched_quaternaries_spectrum,
                                           matched_quat_sdf=matched_quaternaries_sdf,
                                           matched_ter_spectrum=matched_tertiaries_spectrum,
                                           matched_ter_sdf=matched_tertiaries_sdf,
                                           matched_sec_spectrum=matched_secondaries_spectrum,
                                           matched_sec_sdf=matched_secondaries_sdf,
                                           matched_quat_intensities=matched_quaternaries_intensities,
                                           matched_ter_intensities=matched_tertiaries_intensities,
                                           matched_sec_intensities=matched_secondaries_intensities,
                                           matched_prim_spectrum=matched_primaries_spectrum,
                                           matched_prim_sdf=matched_primaries_sdf,
                                           matched_prim_intensities=matched_primaries_intensities,
                                           not_matched_quat_sdf=not_matched_quaternaries_sdf,
                                           not_matched_ter_sdf=not_matched_tertiaries_sdf,
                                           not_matched_sec_sdf=not_matched_secondaries_sdf,
                                           not_matched_prim_sdf=not_matched_primaries_sdf,
                                           matched_quat_atoms_sdf=matched_quaternaries_at_index_sdf,
                                           matched_ter_atoms_sdf=matched_tertiaries_at_index_sdf,
                                           matched_sec_atoms_sdf=matched_secondaries_at_index_sdf,
                                           matched_prim_atoms_sdf=matched_primaries_at_index_sdf,
                                           not_matched_quat_atoms_sdf=not_matched_quaternaries_at_index_sdf,
                                           not_matched_ter_atoms_sdf=not_matched_tertiaries_at_index_sdf,
                                           not_matched_sec_atoms_sdf=not_matched_secondaries_at_index_sdf,
                                           not_matched_prim_atoms_sdf=not_matched_primaries_at_index_sdf,
                                           spectrum_shifts=spectrum.shifts))


def _compute_output_files_names(spectrum, spectrum135, spectrum90):
    """
    Computes the output files names depending on the input spectrums and the current time
    :param spectrum:
    :param spectrum135:
    :param spectrum90:
    :return:
    """

    date = datetime.datetime.now()

    output_text_file_name = "Results " + str(spectrum.name) + " "
    output_file_name_structures = "Results " + str(spectrum.name) + " "

    if spectrum135:
        output_text_file_name += "with DEPT 135 "
        output_file_name_structures += "with DEPT 135 "

    if spectrum90:
        output_text_file_name += "and DEPT 90 "
        output_file_name_structures += "and DEPT 90 "

    output_text_file_name += str(date.hour) + "h" + str(date.minute) + "m" + str(date.second) + "s" ".txt"
    output_file_name_structures += str(date.hour) + "h" + str(date.minute) + "m" + str(date.second) + "s" ".png"

    return output_text_file_name, output_file_name_structures


def _check_create_output_dir(output_dir):
    """ Checks that a path is a directory and creates the directory if not """

    # Only checking not empty directory string
    if output_dir:
        if not os.path.isdir(output_dir):
            os.mkdir(output_dir)


def matching_process(sdf_cont, looseness_factor, equivalent_carbons, allowed_mol_weights, results_nb, number_results_page,
                     spectrum, spectrum135=None, spectrum90=None, output_dir="", incremental_looseness=True,
                     heuristic_sorting=True):
    """
    General matching process.
    Saves the resulting text and image files.
    Returns the Results object.
    :param output_dir:
    :param sdf_cont:
    :param looseness_factor:
    :param equivalent_carbons:
    :param allowed_mol_weights:
    :param results_nb:
    :param spectrum:
    :param spectrum135:
    :param spectrum90:
    :return:
    """

    # Creating output directory if it doesn't exist
    _check_create_output_dir(output_dir)

    # Results object initialization
    results = DerepResults(allowed_mol_weights, sdf_cont.name, spectrum, spectrum90, spectrum135, looseness_factor,
                           equivalent_carbons, results_nb, number_results_page)

    # No DEPT file matching
    if not spectrum135:
        _matching_process_no_dept(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor,
                                  spectrum, incremental_looseness, heuristic_sorting)

    # DEPT 135 matching
    if spectrum135 and not spectrum90:
        _matching_process_dept_135(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor,
                                   spectrum, spectrum135, incremental_looseness, heuristic_sorting)

    # DEPT 135 and 90 matching
    if spectrum90:
        _matching_process_dept_135_90(sdf_cont, results, equivalent_carbons, allowed_mol_weights, looseness_factor,
                                      spectrum, spectrum135, spectrum90, incremental_looseness, heuristic_sorting)

    # Computing the inner structures of the Results instance
    results.end_research()
    #
    # # Computing output files names
    # output_text_file_name, output_file_name_structures = _compute_output_files_names(spectrum, spectrum135, spectrum90)
    #
    # # Saving results files
    # _write_results_to_file(results, output_dir, output_text_file_name)
    # _save_grid_mols_img(results, output_dir, output_file_name_structures)

    # Returning Results object
    return results


# # Donner chemin du fichier SDF
# # sdf_cont_glob = SDF("test/sdf_final.SDF")
# # sdf_cont_glob = SDF("test/pb_matching/Data 2/c_type_papaverine.SDF")
# # sdf_cont_glob = SDF("test/pb_matching/Data 1/Faux SDF.SDF")
# sdf_cont_glob = SDF("../Data 4/c_type_papaveraceae_scif_final.SDF")
#
# # Donner chemins des fichiers spectres (None si pas d'utilisation)
# # spectrum_glob = Spectrum("test/he_menthe.csv")
# spectrum_glob = Spectrum("../Data 4/papaver_alkaloids.csv")
# # spectrum_glob = Spectrum("test/pb_matching/Data 2/papaver_alkaloids.txt")
# # spectrum_glob = Spectrum("test/pb_matching/Data 1/Data 1 C.txt")
# # spectrum135_glob = Spectrum("test/he_menthe_135.csv", 0.02)
# # spectrum135_glob = Spectrum("test/pb_matching/Data 1/Data 1 DEPT 135.txt", 0.02)
# # spectrum135_glob = Spectrum("test/pb_matching/Data 2/papaver_alkaloids_dept135.txt", 0.02)
# spectrum135_glob = Spectrum("../Data 4/papaver_alkaloids_dept135.csv", 0.04)
# spectrum90_glob = Spectrum("../Data 4/papaver_alkaloids_dept90.csv", 0.04)
# # spectrum90_glob = Spectrum("test/pb_matching/Data 1/Data 1 DEPT 90.txt", 0.02)
# # spectrum90_glob = Spectrum("test/he_menthe_90.csv", 0.02)
# #
# # Répertoire de sortie des fichiers
# output_dir_glob = "results/"
#
# # Looseness factor et carbone équivalents
# looseness_factor_glob = 1.3
#
# equivalent_carbons_glob = True
# # Contraintes sur les masses moléculaires
# # Si liste : liste de valeurs
# # Si valeur : valeur
# # Si tuple : intervalle
# # Si None : pas de contrainte
#
# allowed_mol_weights_glob = [4.1, 4.7, 3.6]
# allowed_mol_weights_glob = 4.
# allowed_mol_weights_glob = (1., 5.)
# allowed_mol_weights_glob = None
#
#
# # Matching process
# results_glob = matching_process(sdf_cont_glob, looseness_factor_glob, equivalent_carbons_glob, allowed_mol_weights_glob,
#                                 25, 25, spectrum_glob, spectrum135_glob, spectrum90_glob, output_dir=output_dir_glob,
#                                 incremental_looseness=True, heuristic_sorting=True)

# # Simulation de molécule
# molecule_simulation(results_glob[0], 1, spectrum135_glob, spectrum90_glob, output_dir_glob)
#
# result_example = results_glob[0]
#
# # # Suggestion de mélange
# # mixture_composition_suggestion(results_glob, 3, 0.1, allowed_mol_weights_glob, sdf_cont_glob, spectrum_glob, spectrum135_glob,
# #                                spectrum90_glob, looseness_factor_glob, output_dir_glob)
