import sys
import os

path_id = os.getcwd()
if " "in path_id :
    ll=path_id.split('\\')
    pa = ""
    for i in range(len(ll)):
        if " " in ll[i] :
            pa += '"'+ll[i]+'"/'
        else :
            pa+=ll[i]+"/"
    path_idg = pa[:-1]
else:
    path_idg = path_id


print('Process path is : ' + path_id)
def run_command(command):
	"""
	run_command() forwards a command to the OS through a call to os.system()
	"""
	print("Running:",  command)
# print command to run
	code = os.system(command)
# run command
	print("\"%s\" returned with code: %d\n" % (command, code))
# print code returned by OS, 0 for Windows, something else for Linux/MacOS (none tested)




command = "python " + path_idg + "/dependencies/l2sdf.py " 
run_command(command)
"""
l2sdf.py:
	reads: cfmid_input.txt
	writes: cfmid_input_2D.sdf
"""


command = path_idg +'/predictSdf cfmid_input_2D.sdf 4 3d 1>cfmid_input_2D_nmr.txt 2>errorlog.txt'
run_command(command)
"""
predict_sdf.bat:
	reads: cfmid_input_2D_2D.sdf
	writes: standard output, redirected to cfmid_input_2D_nmr.txt
	writes: standard error, redirected to errorlog.txt
"""

command = "python " + path_idg + "/dependencies/molsort.py "
run_command(command)
"""
molsort.py:
	reads: cfmid_input_2D_nmr.txt
	writes: cfmid_input_2D_nmr_sorted.txt
"""

command = "python " + path_idg + "/dependencies/nmr_tags.py "
run_command(command)
"""
nmr_tags.py:
	reads: cfmid_input_2D.sdf
	reads: cfmid_input_2D_nmr_sorted.txt
	writes: LOTUS_DB_predict.sdf
"""

command = "python " + path_idg + "/dependencies/fake_ACD.py " + './LOTUS_DB_predict.sdf'
run_command(command)
"""
tagged.py:
	reads: LOTUS_DB_predict.sdf
	writes: fake_acd_LOTUS_DB_predict.sdf
"""

command = "python " + path_idg + "/dependencies/tagged.py "
run_command(command)
"""
creat_folder.py:
	create 'Your_DataBase' folder,
	containing sdf files and txt files
"""
command = "python " + path_idg + "/dependencies/create_folder.py "
run_command(command)