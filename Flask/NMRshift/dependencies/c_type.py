# Get the current script's directory
import sys
import os
current_folder = os.path.dirname(os.path.abspath(__file__))

# Get the parent folder's path by joining the current_folder's path with '..'
parent_folder = os.path.join(current_folder, '..')

# Get the grandparent folder's path by joining the parent_folder's path with '..'
motor = os.path.join(parent_folder, '..')

# Add the grandparent folder to the sys.path
sys.path.append(motor)

# Now you can import modules from the grandparent folder
from motor.data_structures import *
from motor.c_type_writer import *

path_id = os.getcwd()
path_id_2 = str('/'.join(path_id.split('\\')[:-1]) + '/')

sdf = SDF(path_id_2+'/Your_NMR_DataBase/13C_NMR_Database_refactor.sdf',True)
sdf_ns = SDF(path_id_2+'/Your_NMR_DataBase/13C_NMR_Database-ns.sdf',True)

writer = CTypeWriter(sdf, sdf_ns, path_id_2+'/Your_NMR_DataBase/13C_NMR_Database_refactor.sdf')
writer.create_carbon_atoms_dictionary()
writer.create_carbon_shifts_dictionary()
writer.create_output_file(path_id_2+'/Your_NMR_DataBase','13C_NMR_Database.sdf')