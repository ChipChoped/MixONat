import os

from motor.data_structures import SDF


class CTypeGeneratorChecker:
    """
    Checks all values given to CTypeGenerator
    Used by CTypeGeneratorThread
    """

    def __init__(self, sdf_path, sdf_ns_path, dir_path, name):

        self.message = ''

        self.path = sdf_path

        try:
            if sdf_path:
                self.sdf = SDF(sdf_path)
                # self.sdf.sdf_chem_obj[0].getAtoms()
            else:
                raise OSError
        except (OSError, AttributeError):
            self.message = self.message + "[b]SDF File[/b]\nUnexpected file type : '" + sdf_path + "'\n"

        try:
            if sdf_ns_path:
                self.sdf_ns = SDF(sdf_ns_path)
                # self.sdf_ns.sdf_chem_obj[0].getAtoms()
            else:
                raise OSError
        except (OSError, AttributeError):
            self.message = self.message + "[b]SDF no stereo file[/b]\nUnexpected file type : '" + sdf_ns_path + "'\n"

        self.output_dir = dir_path

        if name:
            self.name = name
        else:
            self.name = os.path.basename(sdf_path)
        print(self.name)
