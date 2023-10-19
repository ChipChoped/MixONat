from checkers.filechecker import FileChecker
from motor.data_structures import Spectrum, SDF

class MatchingInputsChecker:

    """
    Checks all values given to matching_process method
    Used by MatchingProcessThread
    """

    KEY_SDF = 'sdf'
    KEY_DEPT135 = 'dept135'
    KEY_DEPT90 = 'dept90'
    KEY_SPECTRUM = 'spectrum'
    KEY_LOOSENESS_FACTOR = 'looseness_factor'
    KEY_LOOSENESS_INCREMENTATION = 'looseness_incr'
    KEY_HEURISTIC_SORTING = "heuristic_sorting"
    KEY_MINIMAL_SCORE = 'minimal_score'
    KEY_DEPT135_ALIGNMENT = 'dept135_alignment'
    KEY_DEPT90_ALIGNMENT = 'dept90_alignment'
    KEY_MOLECULAR_WEIGHT = 'molecular_weight'
    KEY_CARBON_EQUIVALENT = 'carbon_equivalent'
    KEY_NUMBER_RESULTS = 'number_results'
    KEY_NUMBER_RESULTS_PAGE = 'number_results_page'
    KEY_DIRECTORY_RESULTS_PATH = 'results_directory_path'

    def __init__(self, files, parameters):

        self.message = ''


        try:
            self.sdf = SDF(files[MatchingInputsChecker.KEY_SDF],False)
        except Exception:
            self.message = self.message + str(FileChecker(files[MatchingInputsChecker.KEY_SDF], type='sdf'))

        try:
            self.spectrum = Spectrum(files[MatchingInputsChecker.KEY_SPECTRUM],False)
        except Exception:
            self.message = self.message + str(FileChecker(files[MatchingInputsChecker.KEY_SPECTRUM], type='spectrum'))
        try:
            self.dept135_alignment = float(parameters[MatchingInputsChecker.KEY_DEPT135_ALIGNMENT])
        except ValueError:
            self.message = self.message + "\n[b]Dept135 alignment[/b] > Unexpected value format : " + \
                           parameters[MatchingInputsChecker.KEY_DEPT135_ALIGNMENT] + '\n'

        if files[MatchingInputsChecker.KEY_DEPT135]:
            try:
                self.dept135 = Spectrum(files[MatchingInputsChecker.KEY_DEPT135],False, self.dept135_alignment)
            except Exception:
                self.message = self.message + str(FileChecker(files[MatchingInputsChecker.KEY_DEPT135], type='spectrum'))
        else:
            self.dept135 = files[MatchingInputsChecker.KEY_DEPT135]

        try:
            self.dept90_alignment = float(parameters[MatchingInputsChecker.KEY_DEPT90_ALIGNMENT])
        except ValueError:
            self.message = self.message + "\n[b]Dept90 alignment[/b] > Unexpected value format : " + \
                           parameters[MatchingInputsChecker.KEY_DEPT90_ALIGNMENT] + '\n'

        if files[MatchingInputsChecker.KEY_DEPT90]:
            try:
                self.dept90 = Spectrum(files[MatchingInputsChecker.KEY_DEPT90],False, self.dept90_alignment)
            except Exception:
                self.message = self.message + str(FileChecker(files[MatchingInputsChecker.KEY_DEPT90], type='spectrum'))
        else:
            self.dept90 = files[MatchingInputsChecker.KEY_DEPT90]

        try:
            self.looseness_factor = float(parameters[MatchingInputsChecker.KEY_LOOSENESS_FACTOR])
        except ValueError:
            self.message = self.message + "\n[b]Looseness factor[/b] > Unexpected value format : " + \
                           parameters[MatchingInputsChecker.KEY_LOOSENESS_FACTOR] + '\n'

        self.looseness_incr = parameters[MatchingInputsChecker.KEY_LOOSENESS_INCREMENTATION]

        self.heuristic_sorting = parameters[MatchingInputsChecker.KEY_HEURISTIC_SORTING]

        try:
            self.minimal_score = float(parameters[MatchingInputsChecker.KEY_MINIMAL_SCORE])
        except ValueError:
            self.message = self.message + "\n[b]Minimal score[/b] > Unexpected value format : " + \
                           parameters[MatchingInputsChecker.KEY_MINIMAL_SCORE] + '\n'

        molecular_weight = parameters[MatchingInputsChecker.KEY_MOLECULAR_WEIGHT]
        try:
            if bool(molecular_weight):
                if type(molecular_weight) is tuple:
                    min, max = molecular_weight
                    self.molecular_weight = float(min), float(max)
                if type(molecular_weight) is list:
                    self.molecular_weight = [float(weight) for weight in molecular_weight]
            else:
                self.molecular_weight = molecular_weight
        except ValueError:
            self.message = self.message + "\n[b]Molecular weight[/b] > Unexpected value format : " + \
                           str(molecular_weight) + '\n'

        self.carbon_equivalent = parameters[MatchingInputsChecker.KEY_CARBON_EQUIVALENT]

        try:
            self.number_results = int(parameters[MatchingInputsChecker.KEY_NUMBER_RESULTS])
        except ValueError:
            self.message = self.message + "\n[b]Number of results[/b] > Unexpected value format : " + \
                            str(parameters[MatchingInputsChecker.KEY_NUMBER_RESULTS]) + '\n'

        try:
            self.number_results_page = int(parameters[MatchingInputsChecker.KEY_NUMBER_RESULTS_PAGE])
        except ValueError:
            self.message = self.message + "\n[b]Number of results per page[/b] > Unexpected value format : " + \
                           str(parameters[MatchingInputsChecker.KEY_NUMBER_RESULTS]) + '\n'

        self.output_dir = parameters[MatchingInputsChecker.KEY_DIRECTORY_RESULTS_PATH]
