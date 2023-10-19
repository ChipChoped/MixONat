import os
from threading import Thread
from time import sleep

# from kivy.uix.boxlayout import BoxLayout
# from kivy.uix.image import Image
# from kivy.uix.label import Label

from motor.c_type_writer import CTypeWriter


class CTypeGeneratorThread(Thread):

    """
    Thread which runs ctype file generation
    """

    def __init__(self, tab, checker):
        super(CTypeGeneratorThread, self).__init__()

        self.tab = tab
        self.checker = checker

        # self.layout = BoxLayout(orientation='horizontal')
        #
        # self.label = Label(text='Please, wait end of generation')
        # self.layout.add_widget(self.label)
        #
        # self.image = Image(source=os.path.join('gui', 'img', 'loader.gif'), anim_delay=0.04)
        # self.layout.add_widget(self.image)

        self.writer = CTypeWriter(checker.sdf, checker.sdf_ns, checker.path)

    def run(self):
        # self.tab.bottom_layout.add_widget(self.layout)
        self.writer.create_carbon_atoms_dictionary()
        self.writer.create_carbon_shifts_dictionary()
        self.writer.create_output_file(self.checker.output_dir, self.checker.name)
        # self.layout.remove_widget(self.image)
        # self.label.text = "Results stored in file '" + os.path.join(self.checker.output_dir, "c_type_" + self.checker.name ) + "'"
        # sleep(10)
        # self.tab.bottom_layout.remove_widget(self.layout)