"""
Module containing the molecule simulation of specific result functions
"""
import itertools
from io import BytesIO

import numpy as np
from PIL import Image

try:
    import matplotlib.pyplot as plt
    matplotlib_available = True
except:
    print("\nThe SPECTRUM SIMULATION will not be available.\nMake sure that matplotlib is installed.\nPlease try to "
          "launch the program from a directory containing only ASCII characters (no accents allowed).")
    matplotlib_available = False


def _molecule_simulation_conf(mol_result, spectrum135, spectrum90):
    """
    Returns lists that configure the molecule simulation plot depending on the research input (which DEPT files are
    given).
    :param mol_result:
    :param spectrum135:
    :param spectrum90:
    :return: (shifts, intensities, legends, colors)
    """

    shifts = []
    sdf_shifts = []
    sdf_atoms_idx = []
    intensities = []
    legends = []
    colors = []

    if spectrum135:

        # Adding spectrum 135 and 90 common carbon types shifts and intensities
        shifts.append(mol_result.matched_quat_spectrum)
        sdf_shifts.append(mol_result.matched_quat_sdf)
        sdf_atoms_idx.append(mol_result.matched_quat_atoms_sdf)
        intensities.append(mol_result.matched_quat_intensities)
        legends.append("Quaternaries")
        colors.append('r')
        shifts.append(mol_result.matched_sec_spectrum)
        sdf_shifts.append(mol_result.matched_sec_sdf)
        sdf_atoms_idx.append(mol_result.matched_sec_atoms_sdf)
        intensities.append(mol_result.matched_sec_intensities)
        legends.append("Secondaries")
        colors.append('k')

        if spectrum90:

            # Adding spectrum 90 specific carbon types shifts and intensities
            shifts.append(mol_result.matched_ter_spectrum)
            sdf_shifts.append(mol_result.matched_ter_sdf)
            sdf_atoms_idx.append(mol_result.matched_ter_atoms_sdf)
            intensities.append(mol_result.matched_ter_intensities)
            legends.append("Tertiaries")
            colors.append('b')
            shifts.append(mol_result.matched_prim_spectrum)
            sdf_shifts.append(mol_result.matched_prim_sdf)
            sdf_atoms_idx.append(mol_result.matched_prim_atoms_sdf)
            intensities.append(mol_result.matched_prim_intensities)
            legends.append("Primaries")
            colors.append('y')

        else:

            # Adding spectrum 135 specific carbon types shifts and intensities
            shifts.append(mol_result.matched_ter_prim_spectrum)
            sdf_shifts.append(mol_result.matched_ter_prim_sdf)
            sdf_atoms_idx.append(mol_result.matched_ter_prim_atoms_sdf)
            intensities.append(mol_result.matched_ter_prim_intensities)
            legends.append("Tertiaries and primaries")
            colors.append('g')

    else:

        # NO DEPT shifts and intensities
        shifts.append(mol_result.matched_no_dept_shifts_spectrum)
        sdf_shifts.append(mol_result.matched_no_dept_shifts_sdf)
        sdf_atoms_idx.append(mol_result.matched_no_dept_atoms_sdf)
        intensities.append(mol_result.matched_no_dept_shifts_intensities)
        legends.append("All carbons")
        colors.append('b')

    return shifts, sdf_shifts, sdf_atoms_idx, intensities, legends, colors


def molecule_simulation(mol_result, rank, spectrum135=None, spectrum90=None, dpi=None, xlimmin=0, xlimmax=220):

    if matplotlib_available:

        # Plot configuration
        plt.xlim(xlimmax, xlimmin)
        plt.xlabel("ppm")
        plt.ylabel("Intensity")

        # Computing shifts info
        spectrum_shifts, sdf_shifts, sdf_atoms_idx, intensities, legends, colors = \
            _molecule_simulation_conf(mol_result, spectrum135, spectrum90)

        # Plotting the shifts for all the carbon types
        for i in range(len(spectrum_shifts)):
            if spectrum_shifts[i]:
                plt.bar(spectrum_shifts[i], intensities[i], color=colors[i], label=legends[i])

                # Annotating
                for j, (cs, intensity) in enumerate(zip(spectrum_shifts[i], intensities[i])):
                    plt.annotate(str(cs)+" ("+str(sdf_atoms_idx[i][j]+1)+")", xy=(cs, intensity), rotation=45,
                                 ha="left", va="bottom")

        if mol_result.name and len(mol_result.name) <= 30:
            mol_text_id = str(mol_result.name)
        else:
            mol_text_id = str(mol_result.cas)

        plt.title(mol_text_id + " (rank " + str(rank) + ")")

        plt.legend()
        plt.tight_layout()
        #plt.show()
        buff = BytesIO()
        plt.savefig(buff, format='png', dpi=dpi)
        plt.gcf().clear()
        buff.seek(0)
        img = Image.open(buff)

        return img


