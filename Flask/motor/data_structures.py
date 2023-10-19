from functools import cmp_to_key

import numpy as np
import re
import csv
import ntpath
import os
from rdkit import Chem
from motor import about, params
from motor.miscellaneous import diff_list
import  io
import json
import base64

def _get_filename(path):
    """
    Returns the filename of a file identified by the given path
    :param path:
    :return:
    """

    if os.name == 'nt':
        return ntpath.basename(path)
    else:
        return os.path.basename(path)


def _get_file_path(path):
    """
    Removes the characters of a path that have been introduced by a drag and drop
    :param path:
    :return:
    """
    if os.name == 'nt':
        path = re.sub('^(\")?', '', path)
        path = re.sub('(\")?$', '', path)
        return ntpath.normpath(path)

    else:
        path = re.sub('^(\')?', '', path)
        path = re.sub('(\')?$', '', path)
        return path


class Spectrum:
    """
    Representing a spectrum.
    Contains the shifts, the intensities and the filename from which the spectrum has been extracted.
    Also contains a method returning a text representation of the spectrum
    """

    def __init__(self, filepathOrFileString, isFilePath=False, alignment=0.):
        """
        Reads the values from a CSV file
        :param filepath:
        """

        # TODO : Check parameters values
        # alignement in [0, 1.5]

        self.shifts = []
        self.intensities = []

        if isFilePath :
            # Recording file name
            self.name = _get_filename(_get_file_path(filepathOrFileString))

            # Reading csv file
            with open(_get_file_path(filepathOrFileString), newline='') as csvfile:
                csv_reader = csv.reader(csvfile, delimiter=',', quotechar='"')

            csvfile.close()
        else :
            # Recording file name
            self.name =  "Spectrum file"

            # Reading csv file
            file = filepathOrFileString.splitlines()
            csv_reader = csv.reader(file, delimiter=',', quotechar='"')

            # Reading shifts and intensities
            for row in csv_reader:
                self.shifts.append(float(row[0]))
                self.intensities.append(float(row[1]))



        self.alignment = alignment

    def __str__(self):
        output_str = ""
        for i in range(len(self.intensities)):
            output_str += str(self.shifts[i]) + " " + str(self.intensities[i]) + "\n"
        return output_str

    def toJson(self,fileToCheckType):
        """
        Function returns data for file checking  

        """
        myList = ''
        for i in range(len(self.intensities)):
            myList += str(self.shifts[i]) + " " + str(self.intensities[i]) + "\n"

        myList = json.dumps(myList)
        output_str = '{"checkResult":'
        output_str+=myList
        output_str+=',"type":"'+fileToCheckType+'"}'
        return output_str

class SDF:

    def __init__(self, filepathOrFileString,isFilePath=False):
        """
        Records the content and the name of the given SDF file
        :param filepath:
        :return:
        """
        if isFilePath :
            self.name = _get_filename(_get_file_path(filepathOrFileString))
            self.sdf_chem_obj = Chem.SDMolSupplier(_get_file_path(filepathOrFileString))
        else:
            self.name = "SDF file"
            self.sdf_chem_obj = Chem.SDMolSupplier()
            self.sdf_chem_obj.SetData(filepathOrFileString)

    @staticmethod
    def _write_sdf_mol(sdf_mol):
        """
        Prints the information on a molecule in a SDF file into a string
        :param sdf_mol:
        :return:
        """

        output_string = ""

        try:
            id_mol = sdf_mol.GetProp("ID")
            output_string += "\nID is " + str(id_mol)
        except KeyError:
            output_string += "\nCan not find ID"

        try:
            output_string += "\nName is " + sdf_mol.GetProp("Name")
        except KeyError:
            output_string += "\nCan not find name"

        try:
            output_string += "\nCAS is" + sdf_mol.GetProp("CAS")
        except KeyError:
            output_string += "\nCan not find CAS"

        try:
            output_string += "\nMW is" + sdf_mol.GetProp("FW")
        except KeyError:
            output_string += "\nCan not find MW"

        try:
            output_string += "\nMolecule quaternaries are:\n" + sdf_mol.GetProp("Quaternaries")
        except KeyError:
            output_string += "\nCan not find quaternaries"

        try:
            output_string += "\nMolecule tertiaries are:\n" + sdf_mol.GetProp("Tertiaries")
        except KeyError:
            output_string += "\nCan not find tertiaries"

        try:
            output_string += "\nMolecule secondaries are:\n" + sdf_mol.GetProp("Secondaries")
        except KeyError:
            output_string += "\nCan not find secondaries"

        try:
            output_string += "\nMolecule primaries are:\n" + sdf_mol.GetProp("Primaries")
        except KeyError:
            output_string += "\nCan not find primaries"

        return output_string

    def __str__(self):

        # Initialization of the output log string
        log_check_sdf = ""

        # Printing the number of contained molecules
        log_check_sdf += "\nThis SDF contains " + str(len(self.sdf_chem_obj)) + " molecules."

        # Creating the list of the contained ids
        id_list = []
        for molecules in self.sdf_chem_obj:
            id_list.append(int(molecules.GetProp("ID")))
        sorted_id_list = sorted(id_list)

        # Computing and printing the missing ids
        missing_ids = np.setdiff1d(range(1, max(sorted_id_list)), sorted_id_list)

        if len(missing_ids) > 0:
            log_check_sdf += "\nThe following IDs are missing from the SDF:  " + str(missing_ids)
        else:
            log_check_sdf += "\nAll IDs are ok."

        # Printing the information on the first molecule
        log_check_sdf += "\nHere is the information on the first molecule:"
        log_check_sdf += self._write_sdf_mol(self.sdf_chem_obj[0])

        return log_check_sdf

    def toJson(self,fileToCheckType):
        """
        Function returns data for file checking 

        """
        
        log_check_sdf = '{"checkResult":"'

        log_check_sdf += "This SDF contains " + str(len(self.sdf_chem_obj)) + " molecules."

        id_list = []
        for molecules in self.sdf_chem_obj:
            id_list.append(int(molecules.GetProp("ID")))
        sorted_id_list = sorted(id_list)

        missing_ids = np.setdiff1d(range(1, max(sorted_id_list)), sorted_id_list)

        if len(missing_ids) > 0:
            log_check_sdf += "\\nThe following IDs are missing from the SDF:"
            log_check_sdf +="["
            for x in missing_ids :
                log_check_sdf += str(x) + " "
            log_check_sdf +="]"
        else:
            log_check_sdf += "\\nAll IDs are ok."


        log_check_sdf += '\\nHere is the information on the first molecule:'
        # log_check_sdf += self._write_sdf_mol(self.sdf_chem_obj[0])
        firstMol = json.dumps(self._write_sdf_mol(self.sdf_chem_obj[0]))
        firstMol = firstMol[1:]
        log_check_sdf +=firstMol
        # log_check_sdf += "Test"
        log_check_sdf +=',"type":"'+fileToCheckType+'"}'

        return str(log_check_sdf)


class MolShifts:
    """ Contains the values on the shifts of a molecule extracted from a sdf file
    For each carbon type, all the shifts and the index of the associated atoms in the sdf molecule are recorded
    The shifts and the index of the associated atoms in the union of all the carbon types is also recorded
    The shifts and the index of the associated atoms of the union of primary and tertiary carbons is also recorded
    All the arrays are sorted by increasing shift
    """

    def __init__(self, sdf_mol):

        # Initialization of dictionaries
        self.shifts = {}
        self.atoms_idx = {}

        self._read_from_mol(sdf_mol)

    def _add_c_types_union_shifts_at_idx(self, sdf_keys_ids, union_key_name):
        """
        Adds the shifts and the atoms indices of the union of specified carbon types in the internal dictionary with
        the specified key name
        :param sdf_keys_ids:
        :param union_name:
        :return:
        """

        # Creating the list containing the atoms and the shifts for all the carbon types
        shifts = []
        at_idx = []

        for c_type in params.get_sdf_keys_list(sdf_keys_ids):
            shifts += self.shifts[c_type]
            at_idx += self.atoms_idx[c_type]

        self.shifts[union_key_name] = sorted(shifts)
        self.atoms_idx[union_key_name] = [x for _, x in sorted(zip(shifts, at_idx))]

    def _read_from_mol(self, sdf_mol):
        """ Reads the content of a molecule in SDF format and records the information about the shifts"""

        # Extracting each type of shift
        for c_type in params.get_sdf_keys_list():

            sdf_list = sdf_mol.GetProp(c_type)

            atoms_idx = []
            shifts = []

            # Reading each shift represented as a line
            for shift_str in sdf_list.splitlines():
                # Splitting the line on the standard character
                line_list = shift_str.split(params.sdf_shifts_separator)

                # Adding the atom index and the shift to the lists
                atoms_idx.append(int(line_list[0]) - 1)
                shifts.append(float(line_list[1]))

            # Sorting the shift vector and the index vector according to the shift sorting
            self.shifts[c_type] = sorted(shifts)
            self.atoms_idx[c_type] = [x for _, x in sorted(zip(shifts, atoms_idx))]

        # Creating the all carbon types arrays with the "all" key in the inner dictionary
        self._add_c_types_union_shifts_at_idx(["prim", "sec", "ter", "quat"], "all")

        # Creating the arrays for the union of primary and tertiary carbon types
        self._add_c_types_union_shifts_at_idx(["prim", "ter"], "primter")

    def __str__(self):
        """
        Textual representation of the contained shifts
        :return:
        """
        out = ""

        out += "Shifts : "
        out += str(self.shifts)
        out += "\n"

        out += "Atoms idx : "
        out += str(self.atoms_idx)
        out += "\n"

        return out

    @property
    def all_shifts(self):
        """
        Easy access to all the shifts from outside the class
        :return:
        """
        return self.shifts["all"]

    @property
    def all_at_idx(self):
        """
        Easy access to all the atoms indices from outside the class
        :return:
        """
        return self.atoms_idx["all"]

    @property
    def quat_shifts(self):
        """
        Easy access to the quaternary shifts from outside the class
        :return:
        """
        return self.shifts[params.sdf_keys["quat"]]

    @property
    def quat_at_idx(self):
        """
        Easy access to the quaternary atoms indices from outside the class
        :return:
        """
        return self.atoms_idx[params.sdf_keys["quat"]]

    @property
    def ter_shifts(self):
        """
        Easy access to the tertiary shifts from outside the class
        :return:
        """
        return self.shifts[params.sdf_keys["ter"]]

    @property
    def ter_at_idx(self):
        """
        Easy access to the tertiary atoms indices from outside the class
        :return:
        """
        return self.atoms_idx[params.sdf_keys["ter"]]

    @property
    def prim_ter_shifts(self):
        """
        Easy access to the union of primary and tertiary shifts from outside the class
        :return:
        """
        return self.shifts["primter"]

    @property
    def prim_ter_at_idx(self):
        """
        Easy access to the union of primary and tertiary atoms indices from outside the class
        :return:
        """
        return self.atoms_idx["primter"]

    @property
    def sec_shifts(self):
        """
        Easy access to the secondary shifts from outside the class
        :return:
        """
        return self.shifts[params.sdf_keys["sec"]]

    @property
    def sec_at_idx(self):
        """
        Easy access to the secondary atoms indices from outside the class
        :return:
        """
        return self.atoms_idx[params.sdf_keys["sec"]]

    @property
    def prim_shifts(self):
        """
        Easy access to the primary shifts from outside the class
        :return:
        """
        return self.shifts[params.sdf_keys["prim"]]

    @property
    def prim_at_idx(self):
        """
        Easy access to the primary atoms indices from outside the class
        :return:
        """
        return self.atoms_idx[params.sdf_keys["prim"]]


class DerepResult:
    """
    Contains a result of a matching process (a matched molecule).
    The result can be printed as a string.
    """

    def __init__(self, mol, id_mol, name, cas, mol_weight, all_shifts_sdf, matched_no_dept_shifts_spectrum=[],
                 matched_no_dept_atoms_sdf=[], matched_quat_spectrum=[], matched_quat_sdf=[],
                 matched_quat_intensities=[], matched_ter_prim_intensities=[], matched_sec_intensities=[],
                 not_matched_quat_sdf=[], not_matched_ter_prim_sdf=[], not_matched_sec_sdf=[], matched_ter_spectrum=[],
                 matched_ter_sdf=[], matched_sec_spectrum=[], matched_sec_sdf=[], matched_ter_intensities=[],
                 matched_prim_spectrum=[], matched_prim_sdf=[], matched_prim_intensities=[],
                 not_matched_ter_sdf=[], not_matched_prim_sdf=[], matched_no_dept_shifts_intensities=[],
                 not_matched_no_dept_shifts_sdf=[], spectrum_shifts=[], matched_ter_prim_spectrum=[],
                 matched_ter_prim_sdf=[], matched_no_dept_shifts_sdf=[], matched_quat_atoms_sdf=[],
                 matched_ter_prim_atoms_sdf=[], matched_ter_atoms_sdf=[], matched_sec_atoms_sdf=[],
                 matched_prim_atoms_sdf=[], not_matched_no_dept_atoms_sdf=[], not_matched_quat_atoms_sdf=[],
                 not_matched_ter_prim_atoms_sdf=[], not_matched_ter_atoms_sdf=[], not_matched_sec_atoms_sdf=[],
                 not_matched_prim_atoms_sdf=[]):

        # SDF mol object
        self.mol = mol

        # Mol identifiers and properties
        self.id_mol = id_mol
        self.name = name
        self.cas = cas
        self.mol_weight = mol_weight

        # List of all the sdf shifts of the molecule
        self.all_shifts_sdf = all_shifts_sdf

        # List of the shifts of the spectrum
        self.spectrum_shifts = spectrum_shifts

        # Matched spectrum shifts and intensities iff no DEPT file
        self.matched_no_dept_shifts_spectrum = matched_no_dept_shifts_spectrum
        self.matched_no_dept_shifts_intensities = matched_no_dept_shifts_intensities

        # Matched sdf shifts, unmatched sdf shifts, sdf atoms indices and not matched sdf atoms indices iff no DEPT file
        self.matched_no_dept_atoms_sdf = matched_no_dept_atoms_sdf
        self.matched_no_dept_shifts_sdf = matched_no_dept_shifts_sdf
        self.not_matched_no_dept_shifts_sdf = not_matched_no_dept_shifts_sdf
        self.not_matched_no_dept_atoms_sdf = not_matched_no_dept_atoms_sdf

        #Deleted sdf shifts iff no DEPT file
        self.deleted_sdf_shifts_no_dept = []

        # Deleted spectrum shifts and intensities iff no DEPT file
        self.deleted_spectrum_shifts_no_dept = []
        self.deleted_spectrum_intensities_no_dept = []

        # Matched spectrum shifts and intensities if dept 135 and not 90
        self.matched_quat_spectrum = matched_quat_spectrum
        self.matched_ter_prim_spectrum = matched_ter_prim_spectrum
        self.matched_sec_spectrum = matched_sec_spectrum
        self.matched_quat_intensities = matched_quat_intensities
        self.matched_ter_prim_intensities = matched_ter_prim_intensities
        self.matched_sec_intensities = matched_sec_intensities

        # Matched sdf shifts, unmatched sdf shifts, sdf atoms indices and not matched sdf atoms indices if dept 135
        # and not 90
        self.matched_quat_sdf = matched_quat_sdf
        self.matched_ter_prim_sdf = matched_ter_prim_sdf
        self.matched_sec_sdf = matched_sec_sdf
        self.not_matched_quat_sdf = not_matched_quat_sdf
        self.not_matched_ter_prim_sdf = not_matched_ter_prim_sdf
        self.not_matched_sec_sdf = not_matched_sec_sdf
        self.matched_quat_atoms_sdf = matched_quat_atoms_sdf
        self.matched_ter_prim_atoms_sdf = matched_ter_prim_atoms_sdf
        self.matched_sec_atoms_sdf = matched_sec_atoms_sdf
        self.not_matched_quat_atoms_sdf = not_matched_quat_atoms_sdf
        self.not_matched_ter_prim_atoms_sdf = not_matched_ter_prim_atoms_sdf
        self.not_matched_sec_atoms_sdf = not_matched_sec_atoms_sdf

        # Deleted sdf shifts iff dept 135
        self.deleted_sdf_shifts_quat = []
        self.deleted_sdf_shifts_ter_prim = []
        self.deleted_sdf_shifts_sec = []

        # Deleted spectrum shifts and intensities if dept 135
        self.deleted_spectrum_shifts_quat = []
        self.deleted_spectrum_intensities_quat= []
        self.deleted_spectrum_shifts_ter_prim = []
        self.deleted_spectrum_intensities_ter_prim = []
        self.deleted_spectrum_shifts_sec = []
        self.deleted_spectrum_intensities_sec = []

        # Matched spectrum shifts and intensities iff dept 90
        self.matched_ter_spectrum = matched_ter_spectrum
        self.matched_prim_spectrum = matched_prim_spectrum
        self.matched_ter_intensities = matched_ter_intensities
        self.matched_prim_intensities = matched_prim_intensities

        # Matched sdf shifts, unmatched sdf shifts, sdf atoms indices and not matched sdf atoms indices iff dept 90
        self.matched_ter_sdf = matched_ter_sdf
        self.matched_prim_sdf = matched_prim_sdf
        self.not_matched_ter_sdf = not_matched_ter_sdf
        self.not_matched_prim_sdf = not_matched_prim_sdf
        self.matched_ter_atoms_sdf = matched_ter_atoms_sdf
        self.matched_prim_atoms_sdf = matched_prim_atoms_sdf
        self.not_matched_ter_atoms_sdf = not_matched_ter_atoms_sdf
        self.not_matched_prim_atoms_sdf = not_matched_prim_atoms_sdf

        # Deleted sdf shifts iff dept 90
        self.deleted_sdf_shifts_quat = []
        self.deleted_sdf_shifts_sec = []
        self.deleted_sdf_shifts_ter = []
        self.deleted_sdf_shifts_prim = []

        # Deleted spectrum shifts and intensities if dept 90
        self.deleted_spectrum_shifts_ter = []
        self.deleted_spectrum_intensities_ter = []
        self.deleted_spectrum_shifts_prim = []
        self.deleted_spectrum_intensities_prim = []

        # Update score, error und unmatched spectrum shifts
        self._compute_score()

    def get_matched_spectrum_shifts_canonical(self):
        """
        Returns the matched spectrum shifts in canonical order
        Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept
        :return:
        """
        return self.matched_quat_spectrum + self.matched_ter_prim_spectrum + \
               self.matched_ter_spectrum + self.matched_sec_spectrum + \
               self.matched_prim_spectrum + self.matched_no_dept_shifts_spectrum

    def get_matched_sdf_shifts_canonical(self):
        """
        Returns the sdf shifts in canonical order
        Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept
        :return:
        """
        return self.matched_quat_sdf + self.matched_ter_prim_sdf + self.matched_ter_sdf + self.matched_sec_sdf \
               + self.matched_prim_sdf + self.matched_no_dept_shifts_sdf

    def get_matched_sdf_atoms_idx(self):
        """
        Returns the sdf atom indexes in canonical order
        Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept
        :return:
        """

        return self.matched_quat_atoms_sdf + self.matched_ter_prim_atoms_sdf + self.matched_ter_atoms_sdf \
               + self.matched_sec_atoms_sdf + self.matched_prim_atoms_sdf + self.matched_no_dept_atoms_sdf

    def update(self):
        """
        Updates the score, the error and the unmatched sdf shifts
        :return:
        """

        self._compute_score()
        self._compute_error()
        self._compute_unmatched_shifts_left()

    def _compute_score(self):
        """
        Computes the score of the result.
        The score is defined as the number of matched shifts divided by the number of sdf shifts
        :return:
        """

        self.score = len(self.get_matched_spectrum_shifts_canonical()) / len(self.all_shifts_sdf)

    def _compute_error(self):
        """
        Computes the error of the result
        The error is defined as the sum of the distances between matched spectrum and sdf shifts
        :return:
        """

        self.error = np.sum(np.abs(np.subtract(np.array(self.get_matched_spectrum_shifts_canonical()),
                                               np.array(self.get_matched_sdf_shifts_canonical()))))

    def _compute_unmatched_shifts_left(self):
        """
        Computes the sdf shifts that have been unmatched
        :return:
        """

        matched_shifts = self.get_matched_spectrum_shifts_canonical()
        self.spectrum_shifts_left = diff_list(self.spectrum_shifts, matched_shifts)

    def _print_values_str(self, values, legend, total_precision=False):
        """
        Prints the given values into a string with the given legend
        If the total_precision arguement is true, then the numerical value is not rounded
        :param values:
        :param legend:
        :return:
        """
        out_str = legend + " :\""
        for v in values:
            if total_precision:
                if v != -1:
                    out_str += "%f    " % v
                else:
                    out_str += "USER    "
            else:
                if v != -1:
                    out_str += "%.2f    " % v
                else:
                    out_str += "USER    "
        out_str += "\""

        return out_str

    def __str__(self):
        """
        Prints the result in a string
        :return:
        """

        result = ""

        if self.id_mol:
            result += "ID : " + str(self.id_mol) + "\n"
        if self.name:
            result += "Name : " + str(self.name) + "\n"
        if self.cas:
            result += "CAS : " + str(self.cas) + "\n"
        if self.mol_weight:
            result += "MW : " + str(self.mol_weight) + "\n"
        if self.score:
            result += "Score : " + str(round(self.score, 2)) + " (" + str(
                len(self.get_matched_spectrum_shifts_canonical())) + "/" + \
                      str(len(self.all_shifts_sdf)) + " carbons)\n"
        if self.error:
            result += "Cumulated absolute difference : %.2f" % self.error + "\n"

        result += "Spectrum shifts left : " + str(len(self.spectrum_shifts_left)) + "/" + str(
            len(self.spectrum_shifts)) + \
                  "\n"

        if self.matched_no_dept_shifts_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_no_dept_shifts_spectrum, "Matched spectrum shifts")

        if self.matched_no_dept_shifts_sdf:
            result += self._print_values_str(self.matched_no_dept_shifts_sdf, "Matched SDF shifts")

        if self.matched_no_dept_shifts_intensities:
            result += self._print_values_str(self.matched_no_dept_shifts_intensities, "Matched spectrum intensities",
                                             total_precision=True)

        if self.not_matched_no_dept_shifts_sdf:
            result += self._print_values_str(self.not_matched_no_dept_shifts_sdf, "Not matched SDF shifts")

        if self.matched_quat_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_quat_spectrum, "Matched spectrum quaternary shifts")

        if self.matched_quat_sdf:
            result += self._print_values_str(self.matched_quat_sdf, "Matched SDF quaternary shifts")

        if self.matched_quat_intensities:
            result += self._print_values_str(self.matched_quat_intensities, "Matched quaternary intensities",
                                             total_precision=True)

        if self.not_matched_quat_sdf:
            result += self._print_values_str(self.not_matched_quat_sdf, "Not matched SDF quaternary shifts")

        if self.matched_ter_prim_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_ter_prim_spectrum,
                                             "Matched spectrum tertiary and primary shifts")

        if self.matched_ter_prim_sdf:
            result += self._print_values_str(self.matched_ter_prim_sdf, "Matched SDF tertiary and primary shifts")

        if self.matched_ter_prim_intensities:
            result += self._print_values_str(self.matched_ter_prim_intensities,
                                             "Matched tertiary and primary intensities",
                                             total_precision=True)

        if self.not_matched_ter_prim_sdf:
            result += self._print_values_str(self.not_matched_ter_prim_sdf,
                                             "Not matched SDF tertiary and primary shifts")

        if self.matched_ter_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_ter_spectrum, "Matched spectrum tertiary shifts")

        if self.matched_ter_sdf:
            result += self._print_values_str(self.matched_ter_sdf, "Matched SDF tertiary shifts")

        if self.matched_ter_intensities:
            result += self._print_values_str(self.matched_ter_intensities, "Matched tertiary intensities",
                                             total_precision=True)

        if self.not_matched_ter_sdf:
            result += self._print_values_str(self.not_matched_ter_sdf, "Not matched SDF tertiary shifts")

        if self.matched_sec_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_sec_spectrum, "Matched spectrum secondary shifts")

        if self.matched_sec_sdf:
            result += self._print_values_str(self.matched_sec_sdf, "Matched SDF secondary shifts")

        if self.matched_sec_intensities:
            result += self._print_values_str(self.matched_sec_intensities, "Matched secondary intensities",
                                             total_precision=True)

        if self.not_matched_sec_sdf:
            result += self._print_values_str(self.not_matched_sec_sdf, "Not matched SDF secondary shifts")

        if self.matched_prim_spectrum:
            result += "\n"
            result += self._print_values_str(self.matched_prim_spectrum, "Matched spectrum primary shifts")

        if self.matched_prim_sdf:
            result += self._print_values_str(self.matched_prim_sdf, "Matched SDF primary shifts")

        if self.matched_prim_intensities:
            result += self._print_values_str(self.matched_prim_intensities, "Matched primary intensities",
                                             total_precision=True)

        if self.not_matched_prim_sdf:
            result += self._print_values_str(self.not_matched_prim_sdf, "Not matched SDF primary shifts")

        if self.deleted_spectrum_shifts_no_dept:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_no_dept, "User deleted spectrum shifts")

        if self.deleted_spectrum_intensities_no_dept:
            result += self._print_values_str(self.deleted_spectrum_intensities_no_dept,
                                             "User deleted spectrum intensities", total_precision=True)

        if self.deleted_spectrum_shifts_quat:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_quat, "User deleted quaternary spectrum shifts")

        if self.deleted_spectrum_intensities_quat:
            result += self._print_values_str(self.deleted_spectrum_intensities_quat,
                                             "User deleted quaternary spectrum intensities", total_precision=True)

        if self.deleted_spectrum_shifts_ter_prim:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_ter_prim, "User deleted tertiary and primary spectrum shifts")

        if self.deleted_spectrum_intensities_ter_prim:
            result += self._print_values_str(self.deleted_spectrum_intensities_ter_prim,
                                             "User deleted tertiary and primary spectrum intensities",
                                             total_precision=True)

        if self.deleted_spectrum_shifts_ter:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_ter, "User deleted tertiary spectrum shifts")

        if self.deleted_spectrum_intensities_ter:
            result += self._print_values_str(self.deleted_spectrum_intensities_ter,
                                             "User deleted tertiary spectrum intensities", total_precision=True)

        if self.deleted_spectrum_shifts_sec:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_sec, "User deleted secondary spectrum shifts")

        if self.deleted_spectrum_intensities_sec:
            result += self._print_values_str(self.deleted_spectrum_intensities_sec,
                                             "User deleted secondary spectrum intensities", total_precision=True)

        if self.deleted_spectrum_shifts_prim:
            result += "\n"
            result += self._print_values_str(self.deleted_spectrum_shifts_prim, "User deleted primary spectrum shifts")

        if self.deleted_spectrum_intensities_prim:
            result += self._print_values_str(self.deleted_spectrum_intensities_prim,
                                             "User deleted primary spectrum intensities", total_precision=True)

        return result


    def toJson(self):
        """
        Function returns data from motor 

        """
        result = ""

        if self.id_mol:
            result += "\"id\":" + str(self.id_mol) + "\n"
        if self.name:
            result += ",\"name\":" + "\""+str(self.name) + "\"\n"

        if self.cas:
            result += ",\"cas\":" + "\""+str(self.cas) + "\"\n"
        if self.mol_weight:
            result += ",\"mw\":" + str(self.mol_weight) + "\n"



        result += ",\"smile\":" + "\""+Chem.MolToSmiles(self.mol).replace("\\","\\\\") +"\"\n"
    
        base =  str(base64.b64encode(self.mol.ToBinary()))
        base =  base[2:-1]
        result += ",\"base64\":" + "\""+base+"\"\n"

        if self.score:
            result += ",\"score\":\"" + str(round(self.score, 2)) + " (" + str(
                len(self.get_matched_spectrum_shifts_canonical())) + "/" + \
                      str(len(self.all_shifts_sdf)) + " carbons)\"\n"

        result += ",\"all_shifts_sdf\":"+json.dumps(len(self.all_shifts_sdf))+"\n"

        if self.error:
            result += ",\"error\":%.2f" % self.error + "\n"


        result += ",\"spectrum_shifts_left\":\"" + str(len(self.spectrum_shifts_left)) + "/" + str(
            len(self.spectrum_shifts)) + \
                  "\"\n"

        result += ",\"matched_sdf_atoms_idx\":"+json.dumps(self.get_matched_sdf_atoms_idx())+"\n"

        ### QUATERNARIES ATOMS ###

        result += ",\"matched_quat_atoms_sdf\": "+json.dumps(self.matched_quat_atoms_sdf) +"\n"
        result += ",\"not_matched_quat_atoms_sdf\": "+json.dumps(self.not_matched_quat_atoms_sdf) +"\n"
        result += ",\"matched_quat_sdf\": "+json.dumps(self.matched_quat_sdf) +"\n"
        result += ",\"not_matched_quat_sdf\": "+json.dumps(self.not_matched_quat_sdf) +"\n"
        result += ",\"matched_quaternary_intensities\": "+json.dumps(self.matched_quat_intensities) +"\n"
        result += ",\"not_matched_quaternary_intensities\": "+json.dumps([0] * len(self.not_matched_quat_atoms_sdf) if len(self.not_matched_quat_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_quaternary_shifts\":" + json.dumps(self.matched_quat_spectrum) + "\n"
        result += ",\"not_matched_spectrum_quaternary_shifts\":" + json.dumps(self.not_matched_quat_sdf) + "\n"
        

        ### TERNARIES-PRIMARIES ATOMS ###

        result += ",\"matched_ter_prim_atoms_sdf\": "+json.dumps(self.matched_ter_prim_atoms_sdf) +"\n"
        result += ",\"not_matched_ter_prim_atoms_sdf\": "+json.dumps(self.not_matched_ter_prim_atoms_sdf) +"\n"
        result += ",\"matched_ter_prim_sdf\": "+json.dumps(self.matched_ter_prim_sdf) +"\n"
        result += ",\"not_matched_ter_prim_sdf\": "+json.dumps(self.not_matched_ter_prim_sdf) +"\n"
        result += ",\"matched_tertiary_and_primary_intensities\": "+json.dumps(self.matched_ter_prim_intensities) +"\n"
        result += ",\"not_matched_tertiary_and_primary_intensities\": "+json.dumps([0] * len(self.not_matched_ter_prim_atoms_sdf) if len(self.not_matched_ter_prim_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_tertiary_and_primary_shifts\": "+json.dumps(self.matched_ter_prim_spectrum) +"\n"
        result += ",\"not_matched_spectrum_tertiary_and_primary_shifts\": "+json.dumps(self.not_matched_ter_prim_sdf) +"\n"
        
        ### TERNARIES ATOMS ###

        result += ",\"matched_ter_atoms_sdf\": "+json.dumps(self.matched_ter_atoms_sdf) +"\n"
        result += ",\"not_matched_ter_atoms_sdf\": "+json.dumps(self.not_matched_ter_atoms_sdf) +"\n"
        result += ",\"matched_ter_sdf\": "+json.dumps(self.matched_ter_sdf) +"\n"
        result += ",\"not_matched_ter_sdf\": "+json.dumps(self.not_matched_ter_sdf) +"\n"
        result += ",\"matched_tertiary_intensities\": "+json.dumps(self.matched_ter_intensities) +"\n"
        result += ",\"not_matched_tertiary_intensities\": "+json.dumps([0] * len(self.not_matched_ter_atoms_sdf) if len(self.not_matched_ter_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_tertiary_shifts\": "+json.dumps(self.matched_ter_spectrum) +"\n"
        result += ",\"not_matched_spectrum_tertiary_shifts\": "+json.dumps(self.not_matched_ter_sdf) +"\n"

        ### SECONDARIES ATOMS ###

        result += ",\"matched_sec_atoms_sdf\": "+json.dumps(self.matched_sec_atoms_sdf) +"\n"
        result += ",\"not_matched_sec_atoms_sdf\": "+json.dumps(self.not_matched_sec_atoms_sdf) +"\n"
        result += ",\"matched_sec_sdf\": "+json.dumps(self.matched_sec_sdf) +"\n"
        result += ",\"not_matched_sec_sdf\": "+json.dumps(self.not_matched_sec_sdf) +"\n"
        result += ",\"matched_secondary_intensities\": "+json.dumps(self.matched_sec_intensities) +"\n"
        result += ",\"not_matched_secondary_intensities\": "+json.dumps([0] * len(self.not_matched_sec_atoms_sdf) if len(self.not_matched_sec_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_secondary_shifts\": "+json.dumps(self.matched_sec_spectrum) +"\n"
        result += ",\"not_matched_spectrum_secondary_shifts\": "+json.dumps(self.not_matched_sec_sdf) +"\n"

        ### PRIMARIES ATOMS ###

        result += ",\"matched_prim_atoms_sdf\": "+json.dumps(self.matched_prim_atoms_sdf) +"\n"
        result += ",\"not_matched_prim_atoms_sdf\": "+json.dumps(self.not_matched_prim_atoms_sdf) +"\n"
        result += ",\"matched_prim_sdf\": "+json.dumps(self.matched_prim_sdf) +"\n"
        result += ",\"not_matched_prim_sdf\": "+json.dumps(self.not_matched_prim_sdf) +"\n"
        result += ",\"matched_primary_intensities\": "+json.dumps(self.matched_prim_intensities) +"\n"
        result += ",\"not_matched_primary_intensities\": "+json.dumps([0] * len(self.not_matched_prim_atoms_sdf) if len(self.not_matched_prim_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_primary_shifts\": "+json.dumps(self.matched_prim_spectrum) +"\n"
        result += ",\"not_matched_spectrum_primary_shifts\": "+json.dumps(self.not_matched_prim_sdf) +"\n"

        ### NO DEPT ATOMS ###

        result += ",\"matched_no_dept_atoms_sdf\": "+json.dumps(self.matched_no_dept_atoms_sdf) +"\n"
        result += ",\"not_matched_no_dept_atoms_sdf\": "+json.dumps(self.not_matched_no_dept_atoms_sdf) +"\n"
        result += ",\"matched_no_dept_sdf\": "+json.dumps(self.matched_no_dept_shifts_sdf) +"\n"
        result += ",\"not_matched_no_dept_sdf\": "+json.dumps(self.not_matched_no_dept_shifts_sdf) +"\n"
        result += ",\"matched_sdf_shifts\":" + json.dumps(self.matched_no_dept_shifts_sdf) + "\n"
        result += ",\"not_matched_sdf_shifts\":" + json.dumps(self.not_matched_no_dept_shifts_sdf) + "\n"
        result += ",\"matched_no_dept_intensities\": "+json.dumps(self.matched_no_dept_shifts_intensities) +"\n"
        result += ",\"not_matched_no_dept_intensities\": "+json.dumps([0] * len(self.not_matched_no_dept_atoms_sdf) if len(self.not_matched_no_dept_atoms_sdf) > 0 else []) +"\n"
        result += ",\"matched_spectrum_intensities\":" + json.dumps(self.matched_no_dept_shifts_intensities) + "\n"
        result += ",\"matched_no_dept_shifts_spectrum\":" + json.dumps(self.matched_no_dept_shifts_spectrum) + "\n"
        result += ",\"not_matched_no_dept_shifts_spectrum\":" + json.dumps(self.not_matched_no_dept_shifts_sdf) + "\n"



        result += ",\"user_deleted_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_no_dept) +"\n"
        result += ",\"user_deleted_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_no_dept) +"\n"
        result += ",\"user_deleted_quaternary_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_quat) +"\n"
        result += ",\"user_deleted_quaternary_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_quat) +"\n"
        result += ",\"user_deleted_tertiary_and_primary_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_ter_prim) +"\n"
        result += ",\"user_deleted_tertiary_and_primary_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_ter_prim) +"\n"
        result += ",\"user_deleted_tertiary_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_ter) +"\n"
        result += ",\"user_deleted_tertiary_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_ter) +"\n"
        result += ",\"user_deleted_secondary_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_sec) +"\n"
        result += ",\"user_deleted_secondary_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_sec) +"\n"
        result += ",\"user_deleted_primary_spectrum_shifts\": "+json.dumps(self.deleted_spectrum_shifts_prim) +"\n"
        result += ",\"user_deleted_primary_spectrum_intensities\": "+json.dumps(self.deleted_spectrum_intensities_prim) +"\n"

        return result


class Results:
    """
    Contains a set of results. Superclass of the classes containg dereplication matching results and mixture suggestion
    results.
    """

    def __init__(self, allowed_mol_weights, sdf_name, spectrum, spectrum90, spectrum135, looseness,
                 result_type_str):
        self.results = []
        self.deleted_results = []
        self.allowed_mol_weights = allowed_mol_weights
        self.sdf_name = sdf_name
        self.spectrum = spectrum
        self.spectrum135 = spectrum135
        self.spectrum90 = spectrum90
        self.looseness = looseness
        self.result_type_str = result_type_str

    def add_result(self, result):
        self.results.append(result)

    def __getitem__(self, item):
        """
        Redefinition of the [] operator so that the contained results can be easily accessed from the outside
        :param item:
        :return:
        """
        return self.results[item]

    def __len__(self):
        """
        Redefinition of the len function so that the number of contained results can be easily accessed from the outside
        :return:
        """
        return len(self.results)

    def toJson(self):
        """
        Function returns data from motor 
        
        """

        results_str = ""
        #results_str = "{";
        results_str += "\"sdf\":" + "\""+self.sdf_name + "\",\n"
        results_str += "\"spectrum_file\":" + "\""+self.spectrum.name + "\",\n"
        results_str += "\"dept_135_file\":"

        if self.spectrum135:
            results_str += "\""+ self.spectrum135.name + "\",\n"
        else:
            results_str += "null,\n"

        results_str += "\"dept_90_file\":"
        if self.spectrum90:
            results_str += "\""+self.spectrum90.name + "\",\n"
        else:
            results_str += "null,\n"



        results_str+="\"allowed_margin\":"+str(self.looseness)+",\n"

        if self.spectrum135:
            results_str += "\"alignment_accuracy_135\":" + str(self.spectrum135.alignment) + ",\n"
        else :
            results_str += "\"alignment_accuracy_135\":null,\n"


        if self.spectrum90:
            results_str += "\"alignment_accuracy_90\":" + str(self.spectrum90.alignment) + ",\n"
        else :
            results_str += "\"alignment_accuracy_90\":null,\n"

        results_str += "\"number_of_results\":" + str(len(self)) + ",\n"

        #results_str += "}"

        return results_str


    def __str__(self):
        """
        Redefinition of the str function so that the contained results can be easily printed in a file
        :return:
        """

        # Printing research info
        results_str = ""
        results_str += self.result_type_str + "RESULTS FILE\n\n"
        results_str += about.py_file + "\n\n"
        results_str += "SDF : " + self.sdf_name + "\n"
        results_str += "Spectrum file : " + self.spectrum.name + "\n"

        if self.spectrum135:
            results_str += "DEPT 135 file : " + self.spectrum135.name + "\n"

            if self.spectrum90:
                results_str += "DEPT 90 file : " + self.spectrum90.name + "\n"

        else:
            results_str += "No DEPT file used \n"

        results_str += "\n"

        results_str += "Allowed margin : " + str(self.looseness) + "\n"

        if self.spectrum135:
            results_str += "Alignment accuracy 135 : " + str(self.spectrum135.alignment) + "\n"

        if self.spectrum90:
            results_str += "Alignment accuracy 90 : " + str(self.spectrum90.alignment) + "\n"

        if isinstance(self.allowed_mol_weights, tuple):
            results_str += "Molecular weight ranging from " + str(self.allowed_mol_weights[0]) + " to " + \
                           str(self.allowed_mol_weights[1]) + "\n"
        elif isinstance(self.allowed_mol_weights, list):
            results_str += "Molecular weights : "
            for MW in self.allowed_mol_weights:
                results_str += str(MW) + " "
            results_str += "\n"
        else:
            results_str += "No molecular weight information\n"

        results_str += "\n"

        results_str += "Number of results : " + str(len(self)) + "\n"

        return results_str

    def end_research(self):
        pass


def compare_results(res_a, res_b):
    """
    Compares two results.
    A result A is better than a result B if its its all_shifts_score attribute is higher
    If both all_shifts_score have the same value, A is better than B if its cumulated_abs_diff score is lower
    :param res_a:
    :param res_b:
    :return:
    """

    if res_a.score != res_b.score:
        return res_b.score - res_a.score
    else:
        return res_a.error - res_b.error


class DerepResults(Results):
    """
    Contains the results of a matching process.
    The results are added iteratively then are sorted on the rank attribute.
    The results can be represented as a string and the legends of the contained molecules can be generated
    """

    def __init__(self, allowed_mol_weights, sdf_name, spectrum, spectrum90, spectrum135, looseness, equivalent_carbons,
                 max_results_nb, results_per_page):

        super().__init__(allowed_mol_weights, sdf_name, spectrum, spectrum90, spectrum135, looseness, "")
        self.equivalent_carbons = equivalent_carbons
        self.results_nb = max_results_nb
        self.results_nb_per_page = results_per_page

    def end_research(self):
        """
        Method that must be called when all the results are added
        Sorts the results and truncates the list to get the expected number of results
        Also computes legends, matched_structures and highlights attributes
        :return:
        """

        for result in self.results:
            result.update()

        # Sorting the results
        self.results.sort(key=cmp_to_key(compare_results), reverse=False)

        # Truncating the results
        self.results = self.results[:self.results_nb]

        # Generation of legends
        self._generate_legends()

        # Recording the highlighted atoms
        self._record_highlights()

        # Recording the matched structures
        self._record_matched_structures()

    def _record_matched_structures(self):
        """
        Records the matched structures into the matched_structures attribute
        :return:
        """

        self.matched_structures = []

        for result in self.results:
            self.matched_structures.append(result.mol)

    def _record_highlights(self):
        """
        Records the highlighted atoms for each structure into the highlights attribute
        :return:
        """

        self.highlights = []

        for result in self.results:
            self.highlights.append(result.get_matched_sdf_atoms_idx())


    def _generate_legends(self):
        """
        Generates a list of legends representing each result
        :return:
        """

        self.legends = []

        for idx, result in enumerate(self.results):

            legend = "Rank: " + str(idx + 1) + " MW: " + str(result.mol_weight) + "\n"

            if result.name and len(result.name) < 23:
                legend += result.name + "\n"
            elif result.cas:
                legend += result.cas + "\n"
            else:
                legend += "ID: " + str(result.id_mol) + "\n"

            legend += "Score: " + str(round(result.score, 2)) + " (" + str(len(result.get_matched_spectrum_shifts_canonical())) + "/" + \
                     str(len(result.all_shifts_sdf)) + " C)" + "\nDeviation : " + str(round(result.error, 2)) + " ppm"

            self.legends.append(legend)

    def __str__(self):
        """
        Redefinition of the str method for writing specific info about dereplication matching results
        :return:
        """

        results_str = super().__str__()

        if self.equivalent_carbons:
            results_str += "Equivalent carbons allowed\n"
        else:
            results_str += "Equivalent carbons not allowed\n"

        results_str += "\n"

        # Printing results
        for idx, result in enumerate(self.results):
            results_str += "_" * 200 + "\n" + "_" * 200 + "\n\n"
            results_str += "Rank: " + str(idx + 1) + "\n"
            results_str += str(result)

        # Printing deleted results
        results_str += "\n\n\n\nUSER DELETED RESULTS\n\n\n\n"
        for idx, result in enumerate(self.deleted_results):
            results_str += "_" * 200 + "\n" + "_" * 200 + "\n\n"
            results_str += str(result)

        return results_str

    def toJson(self):
        """
        Function returns data from motor 

        """
        results_str = "{"
        results_str += "\"result\":{"+super().toJson()
        if self.equivalent_carbons:
            results_str += "\"equivalent_carbons\":\"Equivalent carbons allowed\"\n"
        else:
            results_str += "\"equivalent_carbons\":\"Equivalent carbons not allowed\"\n"
        results_str += "},"

        results_str += "\"ranking\":["

        # Printing results
        for idx, result in enumerate(self.results):
            results_str += "{\"rank\":" + str(idx + 1) + ",\n"
            results_str += result.toJson()+"},"

        if results_str[-1]==",":
            results_str = results_str[:-1]
        results_str+="]}"
        return results_str


class MixtureResults(Results):
    """
    Stores the results of a mixture suggestion
    """

    def __init__(self, allowed_mol_weights, sdf_name, spectrum, spectrum90, spectrum135, looseness,
                 min_score_mix):
        super().__init__(allowed_mol_weights, sdf_name, spectrum, spectrum90, spectrum135, looseness, "MIXTURE ")
        self.min_score_mix = min_score_mix

    def end_research(self):
        super().end_research()

        """
        Method that must be called when all the results are added.
        Sorts the results.
        :return:
        """

        self.results = sorted(self.results, key=lambda item: item[1], reverse=True)

    def __str__(self):
        """
        Redefinition of the str method for writing specific info about mixture suggestion results
        :return:
        """
        results_str = super().__str__()

        results_str += "Minimal score mix : " + str(self.min_score_mix) + "\n"

        # Writing each mixture suggestion
        for idx, result in enumerate(self.results):
            results_str += "_" * 200 + "\n" + "_" * 200 + "\n"
            results_str += "\nRank : " + str(idx + 1) + "\n"
            results_str += "\nIDs : " + "\n"
            for cs in sorted(result[0]):
                results_str += str(cs) + "    "
            results_str += "\n"

            results_str += "Score : " + str(round(result[1], 2)) + "\n"
            results_str += "Mixture shifts : " + "\n"

            for cs in sorted(self.spectrum.shifts):
                if cs in result[2]:
                    results_str += "%.2f  " % cs
                else:
                    results_str += "[%.2f]  " % cs

            results_str += "\n"

        return results_str
