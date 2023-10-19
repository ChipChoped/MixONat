import os
import re

from rdkit import Chem
from rdkit.Chem import Draw

from motor.data_structures import SDF


def import_sdf_file(sdf_path):
    sdf_file = Chem.SDMolSupplier(sdf_path)
    sdf_file[0].GetAtoms()

    return sdf_file


class CTypeWriter:

    TYPE_KEYS = ['quaternaries', 'tertiaries', 'secondaries', 'primaries']

    def __init__(self, sdf_file, sdf_no_stereo_file, sdf_path):

        self.sdf_path = sdf_path
        self.sdf_file = sdf_file.sdf_chem_obj
        self.sdf_no_stereo_file = sdf_no_stereo_file.sdf_chem_obj

        self.id_list = []

        for molecules in self.sdf_file:
            self.id_list.append(int(molecules.GetProp("ID")))

        self.sdf_carbon_atoms = self.construct_dictionary()
        self.sdf_carbon_shifts = self.construct_dictionary()

    def construct_dictionary(self):
        dictionary = {}

        for type_molecule in CTypeWriter.TYPE_KEYS:
            dictionary[type_molecule] = {}

        return dictionary

    def check_ids(self):
        missing_ids = []

        for number in range(1, self.id_list[-1]):
            if int(number) not in self.id_list:
                missing_ids.append(number)

        if missing_ids:
            print("\nINFO: The following IDs are missing from the SDF: " + str(missing_ids))
        else:
            print("\nAll IDs are ok.")

    def check_drawing(self):
        for structure in range(len(self.sdf_file)):
            try:
                Draw.MolToImage(self.sdf_file[structure])
            except TypeError:
                print("Could not draw structure ID" + str(self.sdf_file[structure].GetProp("ID")))

    def create_carbon_atoms_dictionary(self):
        """Creates 4 dictionaries, one for quaternaries, tertiaries, secondaries and primaries carbon atoms for each
                molecule in the SDF"""

        for molecules in self.sdf_no_stereo_file:
            id_molecule = int(molecules.GetProp("ID"))

            for type_molecule in CTypeWriter.TYPE_KEYS:
                self.sdf_carbon_atoms[type_molecule][id_molecule] = []

            for atoms in range(len(molecules.GetAtoms())):
                valence = molecules.GetAtomWithIdx(atoms).GetExplicitValence()
                symbol = molecules.GetAtomWithIdx(atoms).GetSymbol()
                # print valence, symbol
                if valence == 4 and symbol == "C":
                    self.sdf_carbon_atoms['quaternaries'][id_molecule].append(int(atoms) + 1)
                if valence == 3 and symbol == "C":
                    self.sdf_carbon_atoms['tertiaries'][id_molecule].append(int(atoms) + 1)
                if valence == 2 and symbol == "C":
                    self.sdf_carbon_atoms['secondaries'][id_molecule].append(int(atoms) + 1)
                if valence == 1 and symbol == "C":
                    self.sdf_carbon_atoms['primaries'][id_molecule].append(int(atoms) + 1)

    def create_carbon_shifts_dictionary(self):
        """Creates a dictionary with only the chemical shifts for each molecule in the SDF"""
        sdf_atoms = {}
        sdf_shifts = {}
        for molecules in self.sdf_no_stereo_file:

            id_molecule = int(molecules.GetProp("ID"))

            sdf_atoms[id_molecule] = []
            sdf_shifts[id_molecule] = []

            predicted_shifts = molecules.GetProp("Predicted 13C shifts")

            # keeps only values inside brackets if there are some
            predicted_shifts = re.sub('([0-9]+\[)?', '', predicted_shifts)
            predicted_shifts = re.sub('\]|\\t?', '', predicted_shifts)
            predicted_shifts = predicted_shifts.split("\n")

            predicted_shifts = [predicted_shift.split(" ") for predicted_shift in predicted_shifts]

            tmp_predicted_shifts = []
            for predicted_shift in predicted_shifts:
                try:
                    tmp_predicted_shifts.append((int(predicted_shift[0]), predicted_shift[1]))
                except ValueError:
                    pass

            predicted_shifts = tmp_predicted_shifts
            #predicted_shifts = [ for predicted_shift in predicted_shifts]

            for (atom, shift) in sorted(predicted_shifts):
                sdf_atoms[id_molecule].append(atom)
                sdf_shifts[id_molecule].append(shift)

        for type_molecule in CTypeWriter.TYPE_KEYS:
            sdf_atoms_tmp = {}

            for id_atom, atoms in self.sdf_carbon_atoms[type_molecule].items():
                sdf_atoms_tmp[id_atom] = []
                if id_atom in sdf_atoms.keys():
                    for atom in sdf_atoms.get(id_atom):
                        if int(atom) in atoms:
                            sdf_atoms_tmp[id_atom].append((sdf_atoms.get(id_atom)).index(atom))

            for id_atoms, index_atoms in sdf_atoms_tmp.items():
                self.sdf_carbon_shifts[type_molecule][id_atoms] = []
                if id_atoms in sdf_shifts.keys():
                    for index_atoms_atom in index_atoms:
                        shifts = sdf_shifts.get(id_atoms)
                        shift = shifts[index_atoms_atom]
                        self.sdf_carbon_shifts[type_molecule][id_atoms].append(shift)

    def create_output_file(self, output_dir, output_filename):
        """Creates a new SDF from the original one where a list of chemical shifts is written for each type of carbon"""
        with open(self.sdf_path, "r+") as input_file:
            with open(os.path.join(output_dir, "c_type_%s" % output_filename), "a+") as output_file:
                text_input = input_file.read()
                previous_index = 0

                for id_molecule in self.id_list:
                    tag = ">  <ID>\n%s" % id_molecule
                    index = text_input.find(tag)

                    output_file.write(text_input[previous_index:index] + tag + "\n")

                    for type_molecule in CTypeWriter.TYPE_KEYS:
                        output_file.write("\n>  <" + type_molecule.title() + ">\n")

                        try:
                            for atom, shift in zip(self.sdf_carbon_atoms[type_molecule][id_molecule],
                                                   self.sdf_carbon_shifts[type_molecule][id_molecule]):
                                output_file.write(str(atom) + "\t" + str(shift) + "\n")

                        except KeyError:
                            print("INFO: no " + type_molecule + "found for ID " + str(id_molecule))
                            pass

                    previous_index = index + len(">  <ID>") + len(str(id_molecule)) + 1

                output_file.write(text_input[previous_index:len(text_input)])


if __name__ == '__main__':

    sdf = SDF('LAMIACEAE.SDF')
    sdf_ns = SDF('LAMIACEAE - ns.SDF')

    writer = CTypeWriter(sdf, sdf_ns, 'LAMIACEAE.SDF')
    writer.create_carbon_atoms_dictionary()
    writer.create_carbon_shifts_dictionary()
    writer.create_output_file('LAMIACEAE.SDF')
