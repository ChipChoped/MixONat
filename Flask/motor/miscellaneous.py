

def diff_list(list_1, list_2):
    """
    Returns the difference between list 1 and list 2
    :param list_1:
    :param list2:
    :return:
    """

    output_list = []

    list_2_cpy = list(list_2)

    for item1 in list_1:
        intersects_list_2 = False
        for item2 in list_2_cpy:
            if item1 == item2:
                intersects_list_2 = True
                list_2_cpy.remove(item2)
                break

        if not intersects_list_2:
            output_list.append(item1)

    return output_list