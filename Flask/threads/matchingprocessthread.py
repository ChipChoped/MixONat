import os
from threading import Thread
#
# from kivy.uix.boxlayout import BoxLayout
# from kivy.uix.image import Image
# from kivy.uix.label import Label

from motor.match_derep import matching_process


class MatchingProcessThread(Thread):
    """
    Thread which runs matching_process method
    """

    def __init__(self, checker):
        super(MatchingProcessThread, self).__init__()
        # self.app = app
        self.checker = checker
        self.results = ''                    #  I added this in order to get the result from another thread when this thread is done

        # self.layout = BoxLayout(orientation='horizontal')
        #
        # self.label = Label(text='[color=000000]Matching in progress...[/color]', markup=True)
        # self.layout.add_widget(self.label)
        #
        # self.image = Image(source=os.path.join('gui', 'img', 'loader.gif'), anim_delay=0.04)
        # self.layout.add_widget(self.image)

    def run(self):

        # print(self.checker.sdf)
        # print(self.checker.looseness_factor)


        # self.app.bottom_layout.add_widget(self.layout)
        self.results = matching_process(self.checker.sdf, self.checker.looseness_factor, self.checker.carbon_equivalent,
                                   self.checker.molecular_weight, self.checker.number_results,
                                   self.checker.number_results_page,
                                   self.checker.spectrum, self.checker.dept135,
                                   self.checker.dept90, self.checker.output_dir, self.checker.looseness_incr,
                                   self.checker.heuristic_sorting)
        # self.layout.remove_widget(self.image)
        # self.app.on_matching_process_thread_end(results)
        # self.app.bottom_layout.remove_widget(self.layout)
        #print(self.results)
        # return results #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!