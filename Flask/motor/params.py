
# Keys of the carbon types in the SDF files
sdf_keys = {
    "prim": "Primaries",
    "sec": "Secondaries",
    "ter": "Tertiaries",
    "quat": "Quaternaries"
}


def get_sdf_keys_list(keys_ids=None):
    """
    Returns the list of the used keys in the SDF file that match the given keys
    If the parameter is None then all the sdf keys are returned
    :return:
    """
    k = []

    for key_id, val in sdf_keys.items():
        if keys_ids is None or key_id in keys_ids:
            k.append(val)

    return k


# Separator between atom id and shift in the SDF files
sdf_shifts_separator = "\t"
