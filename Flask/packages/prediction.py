#import libraries
import os
import string
import glob
import subprocess
from subprocess import Popen
import shutil
import time
import datetime
from datetime import datetime
import pandas as pd
import requests
import tkinter as tk
from tkinter import *
from tkinter import ttk
from tkinter import messagebox
from PIL import ImageTk, Image
from packages import tool_path
#import packages
'''
from packages import tool_path, gui, ginfo, action


global cfmid_4_container_identifier
if os.path.exists(tool_path.get_current_path()[0].replace('"','') + '/setup/CFMID_Tool_conf.txt'):
    cfmid_4_container_identifier = ginfo.get_cfmid_docker_image()
else:
    print('WARNING')
    
    
    
# Main function for MSMS spectra prediction
def predict_MSMS_spectra():
    cfmid_4_container_identifier = ginfo.get_cfmid_docker_image()
    prediction_mass_mode_var = gui.get_prediction_mass_mode_var()
    
    if not os.path.exists(tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.txt'):
        messagebox.showinfo("Info", "You must have a cfmid_input file.txt before predicting spectra !") 
    else: 
        
        filein = open(tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.txt', 'r') #read the input file
        molecules_to_predict_list = filein.read().rsplit('\n')
        
        
        i = 0
        molecules_to_predict = []
        if os.path.exists(tool_path.get_current_path()[0] + '/CFM_ID_4/command'): #create a command folder
            shutil.rmtree(tool_path.get_current_path()[0] + '/CFM_ID_4/command')
            os.mkdir(tool_path.get_current_path()[0] + '/CFM_ID_4/command')
        else:
            os.mkdir(tool_path.get_current_path()[0] + '/CFM_ID_4/command')
            
        if os.path.exists(tool_path.get_current_path()[0] + '/CFM_ID_4/spec'): #create a spectra folder
            shutil.rmtree(tool_path.get_current_path()[0] + '/CFM_ID_4/spec')
            os.mkdir(tool_path.get_current_path()[0] + '/CFM_ID_4/spec')
        else:
            os.mkdir(tool_path.get_current_path()[0] + '/CFM_ID_4/spec')
        
        
        
        
        if os.system('docker exec -t ' + cfmid_4_container_identifier[:4]+ ' find /cfmid/public/spec_mgf') == 0:
            os.system('docker exec -t  ' + cfmid_4_container_identifier[:4] +' rm -rf /cfmid/public/spec_mgf')
            print("docker spec_mgf cleaned") # remove spec_mgf folder in docker image
        else:
            next
            
        if os.system('docker exec -t ' +cfmid_4_container_identifier[:4] + ' find /cfmid/public/spec') == 0:
            os.system('docker exec -t  ' +cfmid_4_container_identifier[:4] +' rm -rf /cfmid/public/spec')
            print("docker spec cleaned")# remove spec folder in docker image
        else:
            next
            
        if os.system('docker exec -t ' +  cfmid_4_container_identifier[:4] +' find /cfmid/public/command') == 0:
            os.system('docker exec -t  ' +cfmid_4_container_identifier[:4] +' rm -rf /cfmid/public/command')
            print("docker command cleaned") # remove command folder in docker image
        else:
            next



         
        for molecule in molecules_to_predict_list[:-1] : #create file/input that correspond to 1 molecule to predict (LOTUS ID SMILES)  #remove blank line in input file 
            i =i+1
            name_fileout = tool_path.get_current_path()[0] + '/CFM_ID_4/spec/' + str(molecule.split(' ')[0]) + '.txt' #give the lotus id of the molecule for each file
            fileout = open(name_fileout, 'w')
            fileout.write(molecule)
            fileout.close()
            molecules_to_predict.append(str(molecule.split(' ')[0]) + '.txt')  
        
        from boltons import iterutils
        list_of_list_of_200_molecules_to_predict = list(iterutils.chunked_iter(molecules_to_predict, 200)) #limit the size of generated command file to 200 molecules (1 file = 200 molecules. Several files will be created to cover the entire set of molecules
        
        
        number_of_list_of_200_molecules_to_predict = len(list_of_list_of_200_molecules_to_predict)
        print("There is (are) + " + str(number_of_list_of_200_molecules_to_predict) + " list(s) of molecules to predict")
        
        print("The selected mode is : " + prediction_mass_mode_var)
        if prediction_mass_mode_var == "[M+H]+": #command for ESI+ mode
            num = 0
            while num < number_of_list_of_200_molecules_to_predict:
                fileout2 = open(tool_path.get_current_path()[0] + '/CFM_ID_4/command/multi_ms' + str(num) + '.txt', 'w')
                for molecule in list_of_list_of_200_molecules_to_predict[num]:
                    print(str(datetime.now()) + " " + molecule)
                    command = "cfm-predict /cfmid/public/spec/" + molecule + "  0.001 /trained_models_cfmid4.0/[M+H]+/param_output.log /trained_models_cfmid4.0/[M+H]+/param_config.txt 1 /cfmid/public/spec_mgf/" + str(molecule[:-4] + ".mgf" )
                    if list_of_list_of_200_molecules_to_predict[num].index(molecule) < len(list_of_list_of_200_molecules_to_predict[num]) - 1:
                        fileout2.write(command + "|")  
                    else:
                        fileout2.write(command)
                fileout2.close()
                
                num = num + 1
        
        
            
        else: #command for ESI- mode
            num = 0
            while num < number_of_list_of_200_molecules_to_predict:
                fileout2 = open(tool_path.get_current_path()[0] + '/CFM_ID_4/command/' + 'multi_ms' + str(num) + '.txt', 'w')
                for molecule in list_of_list_of_200_molecules_to_predict[num]:
                    command = "cfm-predict /cfmid/public/spec/" + molecule + "  0.001 /trained_models_cfmid4.0/[M-H]-/param_output.log /trained_models_cfmid4.0/[M-H]-/param_config.txt 1 /cfmid/public/spec_mgf/" + str(molecule[:-4] + ".mgf")
                    if list_of_list_of_200_molecules_to_predict[num].index(molecule) < len(list_of_list_of_200_molecules_to_predict[num]) - 1:
                        fileout2.write(command + "|")  
                    else:
                        fileout2.write(command)
                
                fileout2.close()
                
                num = num + 1
                
        for prediction_command_file in glob.glob(tool_path.get_current_path()[0] + '/CFM_ID_4/command/*.txt'):
            print(prediction_command_file) 
           
            prediction_command_file = '"'+prediction_command_file+'"'
            print(prediction_command_file)
            os.system('docker cp ' + prediction_command_file  + ' ' + cfmid_4_container_identifier[:4] + ':/cfmid/public/' + os.path.basename(prediction_command_file)) #copy command files to the docker image of CFM-ID 4.0
        
        os.system('docker start ' + cfmid_4_container_identifier ) #start the docker image of CMF-ID 4.0
        message = 'docker cp ' +'"'+ tool_path.get_current_path()[0] + '/CFM_ID_4/spec" ' + cfmid_4_container_identifier[:4] + ':/cfmid/public/spec'
        print(message)
        os.system('docker cp ' +'"'+ tool_path.get_current_path()[0] + '/CFM_ID_4/spec" ' + cfmid_4_container_identifier[:4] + ':/cfmid/public/spec') #copy all the input files
        os.system('docker cp ' + '"'+tool_path.get_current_path()[0] + '/CFM_ID_4/command" ' + cfmid_4_container_identifier[:4] + ':/cfmid/public/command') # copy command folder to the docker image of CFM-ID 4.0
        os.system('docker exec -it ' + cfmid_4_container_identifier + ' mkdir /cfmid/public/spec_mgf') #create a folder for predicted spectra on CFM-ID 4.0 docker image 
            
            
            
        
        for prediction_command_file in glob.glob(tool_path.get_current_path()[0] + '/CFM_ID_4/command/*.txt'):
            os.system(str('docker exec -t ' + cfmid_4_container_identifier + ' parallel --bar :::: /cfmid/public/') + os.path.basename(prediction_command_file)) #execute prediction of spectra from command file
        
        if os.path.exists(tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf'):
            shutil.rmtree(tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf')
        
        time.sleep(120) # !!!!! do not change this !!!! The tool need some time to write all the spectra in files
        os.system('docker cp ' +cfmid_4_container_identifier[:4] + ':/cfmid/public/spec_mgf ' + '"'+ tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf"' ) # copy folder containing predicted spectra from docker to Windows environment 
        os.system('docker exec -t ' + cfmid_4_container_identifier +' rm -rf /cfmid/public/command') # remove command folder in docker image
        os.system('docker exec -t ' + cfmid_4_container_identifier + ' rm -rf /cfmid/public/spec') # remove input file folder in docker image 
        os.system('docker exec -t ' + cfmid_4_container_identifier + ' rm -rf /cfmid/public/spec_mgf') # remove predicted spectra folder in docker image 
        
        for prediction_command_file in glob.glob(tool_path.get_current_path()[0] + '/CFM_ID_4/command/*.txt'):
            os.system('docker exec -t ' + cfmid_4_container_identifier + ' rm -rf /cfmid/public/' + os.path.basename(prediction_command_file)) # remove the last command file in docker image 
        
        os.system('docker stop ' + cfmid_4_container_identifier[:4]) # stop the docker image 
        
        time.sleep(20) # let it chill for 20 sec
        
        shutil.rmtree(tool_path.get_current_path()[0] + '/CFM_ID_4/command') #remove command folder in windows environment
        shutil.rmtree(tool_path.get_current_path()[0] + '/CFM_ID_4/spec') # remove inputs in windows environment 
        
        concated_spectra = open(tool_path.get_current_path()[0] + '/CFM_ID_4/predict_spectra.mgf'  ,'w') # concat all predicted spectra into one .MGF file 
        for predicted_spectra in glob.glob(tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf/*.mgf'):
            concated_spectra.write(open(predicted_spectra).read())
        concated_spectra.close()
        
        number_of_spectra_not_predicted = 0 
        spectra_not_predicted_list = []
        error_log = open(tool_path.get_current_path()[0] + '/CFM_ID_4/error_log.txt', 'w') # creat a error_log file containing all the molecules that have not been predicted
        for predicted_spectra in glob.glob(tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf/*.mgf'):
            if os.stat(predicted_spectra).st_size == 0:
                print(str(datetime.now()) + " " + os.path.basename(predicted_spectra))
                number_of_spectra_not_predicted = number_of_spectra_not_predicted +1
                spectra_not_predicted_list.append(os.path.basename(predicted_spectra))
        for not_predicted_spectra in spectra_not_predicted_list:
            error_log.write(not_predicted_spectra + '\n')
        error_log.close()
        
        annotate_predict_MSMS_spectra()
        
        
        messagebox.showinfo("Info", "Prediction of spectra have been done! " + "\n" + str(int(len(molecules_to_predict_list[:-1])) - number_of_spectra_not_predicted) + ' have been predicted !' + "\n" +  str(number_of_spectra_not_predicted) + " have not been predicted : " + str(spectra_not_predicted_list) + ".") 
        
        
    
# Function to read a .MGF file
def iterated_index(liste, element): 
    index_BEGIN_IONS = []
    for i in range(len(liste)):
        if liste[i] == element:
            index_BEGIN_IONS.append(i)
    return index_BEGIN_IONS

# Function to annotate the .MGF file with metadata from .TSV file and changing the pepmass (+1/-1 depending of ionization mode)
def annotate_predict_MSMS_spectra(): 
    prediction_mass_mode_var = gui.get_prediction_mass_mode_var()
    filein = open(tool_path.get_current_path()[0] + '/CFM_ID_4/predict_spectra.mgf', 'r')
    mgf_content = filein.read().split('\n')
    
    input_metadata_dataframe = pd.read_csv(tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.tsv', sep='\t')
    
    annotation_dict = {'FILENAME' : {} , 'SEQ':{},'COMPOUND_NAME':{}, 'MOLECULEMASS':{},'INSTRUMENT':{},
                    'IONSOURCE':{},'EXTRACTSCAN':{}, 'SMILES':{}, 'INCHI':{}, 'INCHIAUX':{}, 'CHARGE':{},
                   'IONMODE':{},'PUBMED':{}, 'ACQUISITION':{},'EXACTMASS':{},'DATACOLLECTOR':{},'ADDUCT':{},
                   'INTEREST':{}, 'LIBQUALITY':{}, 'GENUS':{}, 'SPECIES':{}, 'STRAIN':{}, 'CASNUMBER':{},
                   'PI':{}}
    destination_folder = str(datetime.now()).replace(' ', '_').replace(':', '_').replace('.','_') + str('_MSMS_DB')
    if os.path.exists(tool_path.get_current_path()[0] + '/' + destination_folder):
        shutil.rmtree(tool_path.get_current_path()[0] + '/' +destination_folder)
        os.mkdir(tool_path.get_current_path()[0] + '/' + destination_folder)
    else:
        os.mkdir(tool_path.get_current_path()[0] + '/' + destination_folder)
    fileout2 = open(tool_path.get_current_path()[0] + '/' + destination_folder + '/MSMS_spectra_Database.mgf', "w", encoding="utf8")
    
    begin_ion_index = iterated_index(mgf_content, 'BEGIN IONS')
    end_ion_index = iterated_index(mgf_content, 'END IONS')
    
    
    alphabet = list(string.ascii_uppercase)
    
    greek_alphabet = 'ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩω,'
    latin_alphabet = 'AaBbGgDdEeZzHhJjIiKkLlMmNnXxOoPpRrSssTtUuFfQqYyWw '
    greek2latin = str.maketrans(greek_alphabet, latin_alphabet)
    
    SCAN_NUMBER = 0
    ANNOTATED_INDEX=1
    
    for ion in range(len(end_ion_index)):
        new_spectra = []
        end_of_spectra = int(end_ion_index[ion])
        begining_of_spectra = int(begin_ion_index[ion])
        spectra_lenght  = end_of_spectra - begining_of_spectra
        spectra = mgf_content[begining_of_spectra:end_of_spectra+1]
        
        HEADERS = []
        for line in spectra :
            if spectra[spectra.index(line)][0]  in alphabet:
                a = spectra[spectra.index(line)].split("=")
                HEADERS.append(a[0])
        
        TITLE_INDEX = HEADERS.index('TITLE')
        
        PEPMASS_INDEX = HEADERS.index('PEPMASS')
        if prediction_mass_mode_var == "[M+H]+":
            pepmass = float(spectra[PEPMASS_INDEX].split('=')[1]) + 1.007825 #[M+H]+  
        else:
            pepmass = float(spectra[PEPMASS_INDEX].split('=')[1]) -1.007825 #[M-H]- 
        PEPMASS= ['PEPMASS=' + str(round(pepmass,2))]
        CHARGE= ['CHARGE=1' ]
        MSLEVEL= ['MSLEVEL=2']
        SCAN_NUMBER = SCAN_NUMBER + 1
        SCANS=['SCANS=' + str(SCAN_NUMBER)]
        NAME_METGEM=['NAME=' + str(spectra[TITLE_INDEX].split('=')[1].split(';')[0])] #####Remove this lign for GNPS format, else keep it for MetGem format
        INCHI_METGEM =['INCHI=' + str(input_metadata_dataframe['inchi'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == str(spectra[TITLE_INDEX].split('=')[1].split(';')[0])].index.to_list()[0]))])] #####Remove this lign for GNPS format, else keep it for MetGem format
        
             
        mass_spectra = spectra[PEPMASS_INDEX+3:-1]
        new_mass_spectra = [str(str(frag.split(' ')[0]) + '\t' + str(frag.split(' ')[1])) for frag in mass_spectra]
        
        new_mgf = ['BEGIN IONS'] +  PEPMASS + CHARGE + MSLEVEL + SCANS + NAME_METGEM + INCHI_METGEM + new_mass_spectra + ['END IONS' + '\n']    
        
        for ligne in new_mgf:
            fileout2.write(ligne + '\n')
            
        molecule_id = spectra[TITLE_INDEX].split('=')[1].split(';')[0]
        
        annotation_dict['FILENAME'][ANNOTATED_INDEX] ='MSMS_spectra_Database.mgf'
        annotation_dict['SEQ'][ANNOTATED_INDEX]='*..*'
        
        if str(input_metadata_dataframe['traditional_name'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]) != '':
            annotation_dict['COMPOUND_NAME'][ANNOTATED_INDEX]=str(input_metadata_dataframe['traditional_name'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]).translate(greek2latin)
        else:
            annotation_dict['COMPOUND_NAME'][ANNOTATED_INDEX]= molecule_id
            
        annotation_dict['MOLECULEMASS'][ANNOTATED_INDEX]=pepmass
        annotation_dict['INSTRUMENT'][ANNOTATED_INDEX] ='qTof'
        annotation_dict['IONSOURCE'][ANNOTATED_INDEX]='ESI'
        annotation_dict['EXTRACTSCAN'][ANNOTATED_INDEX]=SCAN_NUMBER
        annotation_dict['SMILES'][ANNOTATED_INDEX]=input_metadata_dataframe['smiles'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]
        annotation_dict['INCHI'][ANNOTATED_INDEX]=input_metadata_dataframe['inchi'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]
        annotation_dict['INCHIAUX'][ANNOTATED_INDEX]='N/A'
        annotation_dict['CHARGE'][ANNOTATED_INDEX]=1
        annotation_dict['IONMODE'][ANNOTATED_INDEX]='Positive'
        annotation_dict['PUBMED'][ANNOTATED_INDEX]= molecule_id
        annotation_dict['ACQUISITION'][ANNOTATED_INDEX]='Other'
        annotation_dict['EXACTMASS'][ANNOTATED_INDEX]=spectra[PEPMASS_INDEX].split('=')[1]
        annotation_dict['DATACOLLECTOR'][ANNOTATED_INDEX]='ICMR'
        if prediction_mass_mode_var == "[M+H]+":
            annotation_dict['ADDUCT'][ANNOTATED_INDEX]='[M+H]+'
        else:
            annotation_dict['ADDUCT'][ANNOTATED_INDEX]='[M-H]-'
            
        annotation_dict['INTEREST'][ANNOTATED_INDEX]='N/A'
        annotation_dict['LIBQUALITY'][ANNOTATED_INDEX]=3
        #annotation_dict['GENUS'][ANNOTATED_INDEX]=(input_metadata_dataframe['genus'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]).replace(' - ','-').replace(' ','_')
        #annotation_dict['SPECIES'][ANNOTATED_INDEX]=(input_metadata_dataframe['species'][int(str(input_metadata_dataframe.Lotus_ID[input_metadata_dataframe.Lotus_ID == molecule_id ].index.to_list()[0]))]).replace(' - ','-').replace(' ','_')
        annotation_dict['STRAIN'][ANNOTATED_INDEX]='N/A'
        annotation_dict['CASNUMBER'][ANNOTATED_INDEX]='N/A'
        annotation_dict['PI'][ANNOTATED_INDEX]='ICMR'
        
        
        ANNOTATED_INDEX=ANNOTATED_INDEX+1

    spectra_metadata_dataframe = pd.DataFrame.from_dict(annotation_dict) 
        
        
        
    filein.close()
    fileout2.close()
    spectra_metadata_dataframe.to_csv(tool_path.get_current_path()[0] + '/' + destination_folder +'/annotation_GNPS_format.tsv', sep='\t', index=False)
    
    os.rename(tool_path.get_current_path()[0] + '/CFM_ID_4/predict_spectra.mgf' , tool_path.get_current_path()[0] + '/' + destination_folder +'/predict_spectra.mgf')
    os.rename(tool_path.get_current_path()[0] + '/CFM_ID_4/error_log.txt' , tool_path.get_current_path()[0] + '/' + destination_folder + '/error_log.txt')
    os.rename(tool_path.get_current_path()[0] + '/CFM_ID_4/spec_mgf' , tool_path.get_current_path()[0] + '/' + destination_folder + '/spec_mgf')
    
    
def predict_only_MSMS_spectra():
        predict_MSMS_spectra()
        
        messagebox.showinfo("Info", "Prediction of spectra have been done! " + "\n" + str(int(len(molecules_to_predict_list[:-1])) - number_of_spectra_not_predicted) + ' have been predicted !' + "\n" +  str(number_of_spectra_not_predicted) + " have not been predicted : " + str(spectra_not_predicted_list) + ".")
   
    
'''
# Function for 13C NMR chemical shifts prediction
def predict_13C_nmr_chemical_shifts(): 
    if not os.path.exists(tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.txt'):
        messagebox.showinfo("Info", "You must have a cfmid_input file.txt before predicting spectra !") 
        print(tool_path.get_current_path()[0])
    else:
        
        Popen('start cmd.exe /c ' + '"'+tool_path.get_current_path()[0] +'/NMRshift/rdkit_creat.bat"', shell=True)
        print(tool_path.get_current_path()[0])
        while os.path.exists(tool_path.get_current_path()[0].replace('"','') + '/Your_NMR_DataBase') != True:
            time.sleep(20)
        else:
            destination_folder = str(datetime.now()).replace(' ', '_').replace(':', '_').replace('.','_') + str('_NMR_DB')
            os.rename(tool_path.get_current_path()[0] + '/Your_NMR_DataBase' , tool_path.get_current_path()[0] + '/' + destination_folder)
            messagebox.showinfo("Info", "NMR 13C Shifts have been predicted!")

'''   
# Fucntion to predict both properties (MSMS and 13 NMR)
def predict_both_properties():
    if not os.path.exists(tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.txt'):
        messagebox.showinfo("Info", "You must have a cfmid_input file.txt before predicting spectra !") 
    else:
        
        predict_MSMS_spectra()
        predict_13C_nmr_chemical_shifts()
        messagebox.showinfo("Info", "Prediction of MS/MS spectra have been done! NMR 13C Shifts have been predicted!")
'''