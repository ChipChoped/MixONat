import numpy as np


def _is_primary_or_tertiary(spectrum_shift, spectrum135):
    """
    Checking if a spectrum shift is primary or tertiary
    A spectrum shift is primary or tertiary if it exists as a positive shift in the spectrum 135
    :param spectrum_shift:
    :param spectrum135:
    :return:
    """

    for align in np.arange(0.0, spectrum135.alignment + 0.001, 0.01):
        for i, shift135 in enumerate(spectrum135.shifts):
            if abs(spectrum_shift - shift135) <= align and spectrum135.intensities[i] > 0:
                return True

    return False


def _is_secondary(spectrum_shift, spectrum135):
    """
    Checking if a spectrum shift is secondary.
    A spectrum shift is secondary if it exists as a negative shift in the spectrum 135
    :param spectrum_shift:
    :param spectrum135:
    :return:
    """

    for align in np.arange(0.0, spectrum135.alignment + 0.001, 0.01):
        for i, shift135 in enumerate(spectrum135.shifts):
            if abs(spectrum_shift - shift135) <= align and spectrum135.intensities[i] < 0:
                return True

    return False


def _is_tertiary(spectrum_shift, spectrum90):
    """
    Checking if a spectrum shift is tertiary
    A spectrum shift is tertiary if it appears on the dept 90 spectrum
    :param specrum_shift:
    :param spectrum90:
    :return:
    """

    for align in np.arange(0.0, spectrum90.alignment + 0.001, 0.01):
        for i, shift135 in enumerate(spectrum90.shifts):
            if abs(spectrum_shift - shift135) <= align:
                return True

    return False


def extract_ctypes_dept_135(spectrum, spectrum135):
    """
    Extracts the different carbon types shifts and intensities with only a spectrum dept 135
    :param spectrum:
    :param spectrum135:
    :return:
    """

    quaternary_shifts = []
    quaternary_intensities = []
    tertiary_and_primary_shifts = []
    tertiary_and_primary_intensities = []
    secondary_shifts = []
    secondary_intensities = []

    # Iterating over spectrum shifts
    for i, shift in enumerate(spectrum.shifts):

        # Checking if secondary
        if _is_secondary(shift, spectrum135):
            secondary_shifts.append(shift)
            secondary_intensities.append(spectrum.intensities[i])

        # Checking if primary or tertiary
        elif _is_primary_or_tertiary(shift, spectrum135):
            tertiary_and_primary_shifts.append(shift)
            tertiary_and_primary_intensities.append(spectrum.intensities[i])

        # If neither secondary, primary nor tertiary, the shift is considered quaternary
        else:
            quaternary_shifts.append(shift)
            quaternary_intensities.append(spectrum.intensities[i])

    return quaternary_shifts, quaternary_intensities, tertiary_and_primary_shifts, tertiary_and_primary_intensities, \
           secondary_shifts, secondary_intensities


def extract_ctypes_dept_135_90(spectrum, spectrum135, spectrum90):
    """
    Extracts the different carbon types shifts and intensities with a dept 135 and a dept 90 spectrum
    :param spectrum:
    :param spectrum135:
    :param spectrum90:
    :return:
    """

    quaternary_shifts = []
    quaternary_intensities = []
    tertiary_shifts = []
    tertiary_intensities = []
    secondary_shifts = []
    secondary_intensities = []
    primary_shifts = []
    primary_intensities = []

    # Iterating over spectrum shifts
    for i, shift in enumerate(spectrum.shifts):

        # Checking if secondary
        if _is_secondary(shift, spectrum135):
            secondary_shifts.append(shift)
            secondary_intensities.append(spectrum.intensities[i])

        # Checking if tertiary
        elif _is_tertiary(shift, spectrum90):
            tertiary_shifts.append(shift)
            tertiary_intensities.append(spectrum.intensities[i])

        # Checking if primary
        # Knowing that the condition is reached iff shift is not tertiary, the _is_primary_or_tertiary function
        # is sufficient to distinguish primary shifts
        elif _is_primary_or_tertiary(shift, spectrum135):
            primary_shifts.append(shift)
            primary_intensities.append(spectrum.intensities[i])

        # If neither secondary, primary nor tertiary, the shift is considered quaternary
        else:
            quaternary_shifts.append(shift)
            quaternary_intensities.append(spectrum.intensities[i])

    return quaternary_shifts, quaternary_intensities, tertiary_shifts, tertiary_intensities, secondary_shifts, \
           secondary_intensities, primary_shifts, primary_intensities