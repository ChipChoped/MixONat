
import re
import os

path_id = os.getcwd()
path_id_2 = str('/'.join(path_id.split('\\')[:-1]) + '/')
        
def no_stereo(line):
    elements = line.split()
    if len(elements) == 7 and elements[1].isdigit() and (elements[3]=='6' or elements[3]=='1'):
        elements[3] = '0'
        new_line = ''
        for el in elements:
            if len(el) == 1:
                new_line += '  '
            else:
                new_line += ' '
            new_line += el
        return new_line+'\n'
                    
    return line

# Ouvrir le fichier SDF en mode lecture
with open(path_id_2+'/Your_NMR_DataBase/13C_NMR_Database_refactor.sdf', 'r') as file:
    # Lire les lignes du fichier
    lines = file.readlines()

# Ouvrir le fichier SDF en mode écriture
with open(path_id_2+'/Your_NMR_DataBase/13C_NMR_Database-ns.sdf', 'w') as file:
    for line in lines:
        modified_line = no_stereo(line)
        file.write(modified_line)
            
        
            


