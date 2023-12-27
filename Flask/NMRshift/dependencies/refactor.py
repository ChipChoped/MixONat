
import re
import os

path_id = os.getcwd()
path_id_2 = str('/'.join(path_id.split('\\')[:-1]) + '/')



# La fonction pour retirer la partie (numero) d'une ligne
def remove_number_from_line(line):
    new_line = re.sub(r'\(\d+\)', '', line)
    return new_line.rstrip()+'\n'

# La fonction pour effectuer les remplacements spécifiés
def perform_replacements(line):
    line = re.sub(r', ', '\t', line)  # Remplacer ", " par "\t"
    line = re.sub(r' \\', '\t', line)  # Remplacer " \" par "\t"
    return line

# Fonction pour ajouter [numero] à chaque élément de la ligne
def add_number_to_elements(line,index):
        elements = line.split('\t')
        if len(elements)>1:
            elem = elements[0]
            modified_element = f"{index}[{elem}] "
            
            #line = re.sub(elem,modified_element, line)
            return modified_element+'\t' + elements[1]+'\n'
        else:
            return line
        
def addZeroToLine(line):

    elements = line.split()
    c = ''.join(elements)
    if c.isdigit():
        if len(elements) == 3:
            return line[:-1]+ '  0  0  0  0\n'
        elif len(elements) == 4:
            return line[:-1]+ '  0  0  0\n'
    return line

# Ouvrir le fichier SDF en mode lecture
with open(path_id+'/13C_NMR_Database.sdf', 'r') as file:
    # Lire les lignes du fichier
    lines = file.readlines()

# Ouvrir le fichier SDF en mode écriture
with open(path_id+'/13C_NMR_Database_refactor.sdf', 'w') as file:
    shift_lines=False
    start_mol = False
    idx=0
    for line in lines:
        if line.startswith('LTS'):
            start_mol = True
            file.write(line)
        # Si la ligne commence par '>', retirer la partie (numero)
        elif line.startswith('>'):
            start_mol = False
            modified_line = remove_number_from_line(line)
            file.write(modified_line)
            if modified_line.startswith('>  <Predicted 13C shifts>'):
                shift_lines=True
                idx+=1
            if modified_line.startswith('>  <CNMR_SHIFTS>'):
                shift_lines=False
                idx=0
            
        elif shift_lines==True:
            #modified_line = l
            l = perform_replacements(line)
            modified_line = add_number_to_elements(l,idx)
            idx+=1
            file.write(modified_line)
        elif start_mol:
            l = addZeroToLine(line)
            file.write(l)
        else:
            #l = addZeroToLine(line)
            file.write(line)
            
        
            


