import os

from motor.data_structures import SDF, Spectrum


class FileChecker():
    def __init__(self, path, **kwargs):

        self.type = None

        for key, value in kwargs.items():
            if key == 'type':
                self.type = value

        if path == '':
            self.message = '\n[color=ffffff][b]Error : Please, select a file[/b][/color]\n'
        elif not os.path.exists(path):
            self.message = '\n[color=ffffff][b]Error : File not exists[/b][/color]\n'
        else:
            if self.type:
                try:
                    if self.type == 'sdf':
                        self.message = str(SDF(path))
                    elif self.type == 'spectrum':
                        self.message = str(Spectrum(path))
                except Exception as e:
                    self.message = '\n[color=ffffff][b] ' + str(e) + '[/b][/color]\n'

    def __str__(self):
        return self.message