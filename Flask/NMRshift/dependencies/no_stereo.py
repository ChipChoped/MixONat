
import re
import os

path_id = os.getcwd()
path_id_2 = str('/'.join(path_id.split('\\')[:-1]) + '/')
        
def no_stereo(line):
    elements = line.split()
    c = ''.join(elements)
    if c.isdigit():
        if len(elements[0])<=2 and len(elements) == 7 and (elements[3]=='6' or elements[3]=='1'):
            new_line = line[:-11]+'0  0  0  0\n'
            return new_line
        elif len(elements[0])>2 and len(elements) == 6 and (elements[2]=='6' or elements[2]=='1'):
            new_line = line[:-11]+'0  0  0  0\n'
            return new_line
    return line

# Ouvrir le fichier SDF en mode lecture
with open(path_id+'/13C_NMR_Database_refactor.sdf', 'r') as file:
    # Lire les lignes du fichier
    lines = file.readlines()

# Ouvrir le fichier SDF en mode écriture
with open(path_id+'/13C_NMR_Database-ns.sdf', 'w') as file:
    start_mol = True
    for line in lines:
        if line.startswith('LTS'):
            start_mol = True
        elif line.startswith('>'):
            start_mol = False
            
        if start_mol:
            modified_line = no_stereo(line)
            file.write(modified_line)
        else:
            file.write(line)
            
        
            


