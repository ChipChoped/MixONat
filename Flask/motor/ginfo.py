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
import motor.tool_path
#import packages

#from packages import motor.tool_path, action


def get_taxonomy_file():
    df_taxonomy = pd.read_csv(motor.tool_path.get_current_path()[0] +'/LOTUS_taxonomy/taxonomy_by_DB.tsv', sep = '\t') # Read specific taxonomy found in LOTUS_DB
    df_taxonomy_all = pd.read_csv(motor.tool_path.get_current_path()[0] + '/LOTUS_taxonomy/all_taxonomy_DB.tsv', sep = '\t') # Read general taxonomy found in LOTUS_DB
    return df_taxonomy, df_taxonomy_all
    
def get_chemontology_file():
    df_chemontology = pd.read_csv(motor.tool_path.get_current_path()[0] + '/LOTUS_taxonomy/NPClassifier_taxonomy.tsv', sep = '\t')
    return df_chemontology
    

# Main and most important function to scrap LOTUS
def get_lotus(IDD):
    
    ############################ Get the code for IDD
    TorC = IDD.split(' : ')[0]
    if TorC == 'T':
        TaxoDB = IDD.split(' : ')[1]
        NPClassifier = ''
        level = IDD.split(' : ')[2]
        name = IDD.split(' : ')[3]
    elif TorC == 'C' :
        TaxoDB = IDD.split(' : ')[1]
        NPClassifier = IDD.split(' : ')[2]
        level = IDD.split(' : ')[3]
        name = IDD.split(' : ')[4]

    elif TorC == 'LTS':
        TaxoDB = IDD.split(' : ')[1]
        NPClassifier = ''
        level = ''
        name = IDD.split(' : ')[2]
        
    elif TorC == 'F':
        TaxoDB = IDD.split(' : ')[1]
        NPClassifier = ''
        level = ''
        name = IDD.split(' : ')[2]
        
    
    print(TorC, TaxoDB, NPClassifier, level, name)
    
    url = str('https://lotus.naturalproducts.net/api/search/simple?query=' + str(name)+'&maxHits=20')
    print(url)
    response = requests.get(url)
    storage = [response.json()]  #get the seaerch result in a json format

    nb = len(str(storage)[1:-1].split("{'id'")) - 1   #get the number of molecule for the search
    print(str(nb) + ' results' )
    
    ###################################Get all the keys for the research
    
    list_key_value=[]
    for mol in range(nb):
        for key in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'] :


            if TaxoDB != 'All_Taxonomy_DB' and TorC == 'T':
                if TaxoDB in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB])):
                        if storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB][go][level] != None and name in str(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB][go][level]):
                            key_value = [mol,key, TaxoDB, go]
    #                     print(key_value)
                            list_key_value.append(key_value)
    #                     print(storage[0]['naturalProducts'][key_value[0]]['taxonomyReferenceObjects'][key_value[1]][TaxoDB][0])



            elif TaxoDB == 'All_Taxonomy_DB' and TorC == 'T':
                for taxo in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo])):
                        if storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo][go][level] != None and name in str(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo][go][level]):
                            key_value = [mol,key, taxo, go]
    #                     print(key_value)
                            list_key_value.append(key_value)
    #                     print(storage[0]['naturalProducts'][key_value[0]]['taxonomyReferenceObjects'][key_value[1]][key_value[2]][0])


            elif TaxoDB != 'All_Taxonomy_DB' and TorC == 'C':
                if TaxoDB in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB])):
                        if storage[0]['naturalProducts'][mol][level] != None and name in str(storage[0]['naturalProducts'][mol][level]):
                            key_value = [mol,key,TaxoDB, go]
    #                     print(key_value)
                            list_key_value.append(key_value)


            elif TaxoDB == 'All_Taxonomy_DB' and TorC == 'C':
                for taxo in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo])):
                        if storage[0]['naturalProducts'][mol][level] != None and name in str(storage[0]['naturalProducts'][mol][level]):
                            key_value = [mol,key, taxo, go]
    #                     print(key_value)
                            list_key_value.append(key_value)

            elif TaxoDB != 'All_Taxonomy_DB' and TorC == 'LTS':
                if TaxoDB in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB])):                
                        key_value = [mol,key,TaxoDB, go]
                        list_key_value.append(key_value)

            elif TaxoDB == 'All_Taxonomy_DB' and TorC == 'LTS':
                for taxo in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo])):
                        key_value = [mol,key, taxo, go]
                        list_key_value.append(key_value)
                        
            elif TaxoDB != 'All_Taxonomy_DB' and TorC == 'F':
                if TaxoDB in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][TaxoDB])):
                        key_value = [mol,key, TaxoDB, go]
                        list_key_value.append(key_value)
                        
            elif TaxoDB == 'All_Taxonomy_DB' and TorC == 'F':
                for taxo in storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key]:
                    for go in range(len(storage[0]['naturalProducts'][mol]['taxonomyReferenceObjects'][key][taxo])):
                        key_value = [mol,key, taxo, go]
                        list_key_value.append(key_value)
                    
                

                        
                        
    ######################## transform the keys to search              
    df = pd.DataFrame(list_key_value, columns =['mol', 'key', 'taxo', 'go'])
    list_new_key_value = []
    new_list = list(set(df.mol))
    for mol in new_list:
        AA = {}
        list_new_key = set(df.loc[df.mol == mol].key.to_list())

        df2 = df.loc[df.mol == mol]
        aa = {}
        for x in list_new_key:

            list_taxo = list(set(df2.loc[df2.key == x].taxo.to_list()))

            df3 = df2.loc[df2.key == x]

            rst={}
            for y in list_taxo:

                list_go = df3.loc[df3.taxo == y].go.to_list()

                rst[y] = list_go
            aa[x] = rst
        AA = [mol, aa]

        list_new_key_value.append(AA)
        
        
    ########################### get Lotus
    global Dict
    Dict = {
            'Lotus_ID' :{} , 'smiles' : {}, 'inchi' : {}, 'inchikey' : {},  'cas' : {}, 'iupac_name' : {}, 'molecular_formula' : {}, 'molecular_weight' : {}, 'xlogp' : {} ,
            'superkingdom':{}, 'kingdom':{}, 'phylum':{}, 'classx':{}, 'order':{}, 'family': {}, 'genus' : {}, 'species' :{} ,
            'chemicalTaxonomyClassyfireKingdom' : {} , 'chemicalTaxonomyClassyfireSuperclass' :{}, 'chemicalTaxonomyClassyfireClass' : {} , 'chemicalTaxonomyClassyfireDirectParent' : {} ,   
            'chemicalTaxonomyNPclassifierPathway' : {} ,'chemicalTaxonomyNPclassifierSuperclass' : {} , 'chemicalTaxonomyNPclassifierClass' : {},
            'traditional_name' : {}
           } #Create a global dict to store metadata from LOTUS

    xx = 1  #start dict at 1

    # if TaxoDB != "All_Taxonomy_DB" and TorC == 'T':
    zz = 0
    for molindex in list_new_key_value:    


        Dict['Lotus_ID'][xx] = storage[0]['naturalProducts'][molindex[0]]['lotus_id']
        Dict['smiles'][xx] = storage[0]['naturalProducts'][molindex[0]]['smiles']
        Dict['inchi'][xx] = storage[0]['naturalProducts'][molindex[0]]['inchi']
        Dict['inchikey'][xx] = storage[0]['naturalProducts'][molindex[0]]['inchikey']
        Dict['cas'][xx] = storage[0]['naturalProducts'][molindex[0]]['cas']
        Dict['traditional_name'][xx] = storage[0]['naturalProducts'][molindex[0]]['traditional_name'].encode(encoding = 'UTF-8', errors = 'replace')
        Dict['iupac_name'][xx] = (storage[0]['naturalProducts'][molindex[0]]['iupac_name']).encode(encoding = 'UTF-8', errors = 'replace')
        Dict['molecular_formula'][xx] = storage[0]['naturalProducts'][molindex[0]]['molecular_formula']
        Dict['molecular_weight'][xx] = storage[0]['naturalProducts'][molindex[0]]['molecular_weight'] 
        Dict['xlogp'][xx] = storage[0]['naturalProducts'][molindex[0]]['xlogp']

        Dict['chemicalTaxonomyClassyfireKingdom'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyClassyfireKingdom']
        Dict['chemicalTaxonomyClassyfireSuperclass'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyClassyfireSuperclass']
        Dict['chemicalTaxonomyClassyfireClass'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyClassyfireClass']
        Dict['chemicalTaxonomyClassyfireDirectParent'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyClassyfireDirectParent']
        Dict['chemicalTaxonomyNPclassifierPathway'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyNPclassifierPathway']
        Dict['chemicalTaxonomyNPclassifierSuperclass'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyNPclassifierSuperclass']
        Dict['chemicalTaxonomyNPclassifierClass'][xx] = storage[0]['naturalProducts'][molindex[0]]['chemicalTaxonomyNPclassifierClass']

        spk1={}
        ki1={}
        ph1={}
        cl1={}
        or11={}
        fm1={}
        ge1={}
        spe1={}



        print(molindex[0])
        for key in list_new_key_value[zz][1]: ####################decalage de 1 !!!!!!!! a reparer
            print(key)
            spk={}
            ki={}
            ph={}
            cl={}
            or1={}
            fm={}
            ge={}
            spe={}


            for taxo in list_new_key_value[zz][1][key]:
                print(taxo)
                superkingdom=[]
                kingdom=[]
                phylum=[]
                classx=[]
                order=[]
                family=[]
                genus=[]
                species=[]
                for go in range(len(list_new_key_value[zz][1][key][taxo])):

                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['superkingdom'] not in superkingdom:
                        superkingdom.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['superkingdom'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['kingdom'] not in kingdom:
                        kingdom.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['kingdom'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['phylum'] not in phylum:
                        phylum.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['phylum'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['classx'] not in classx:
                        classx.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['classx'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['order'] not in order:
                        order.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['order'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['family'] not in family:
                        family.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['family'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['genus'] not in genus:
                        genus.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['genus'])


                    if storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['species'] not in species:
                        species.append(storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][key][taxo][list_new_key_value[zz][1][key][taxo][go]]['species'])
    #                 print(species)


                spk[taxo] = ' - '.join([str(e) for e in superkingdom]) 
                ki[taxo] =' - '.join([str(e) for e in kingdom]) 
                ph[taxo] =' - '.join([str(e) for e in phylum]) 
                cl[taxo]=' - '.join([str(e) for e in classx])  
                or1[taxo]=' - '.join([str(e) for e in order]) 
                fm[taxo]=' - '.join([str(e) for e in family]) 
                ge[taxo]=' - '.join([str(e) for e in genus]) 
                spe[taxo]=' - '.join([str(e) for e in species]) 

                if taxo in spk1:
                    spk1[taxo]=spk1[taxo] + ' - ' + spk[taxo]
                    ki1[taxo]=ki1[taxo] +' - ' + ki[taxo]
                    ph1[taxo]=ph1[taxo] +' - ' + ph[taxo]
                    cl1[taxo]=cl1[taxo] +' - ' + cl[taxo]
                    or11[taxo]=or11[taxo] +' - ' + or1[taxo]
                    fm1[taxo]= fm1[taxo] +' - ' + fm[taxo]
                    ge1[taxo]=ge1[taxo] +' - ' + ge[taxo]
                    spe1[taxo]=spe1[taxo] +' - ' + spe[taxo]
                else:
                    spk1[taxo]= spk[taxo]
                    ki1[taxo]=ki[taxo]
                    ph1[taxo]=ph[taxo]
                    cl1[taxo]=cl[taxo]
                    or11[taxo]=or1[taxo]
                    fm1[taxo]=fm[taxo]
                    ge1[taxo]=ge[taxo]
                    spe1[taxo]=spe[taxo]

        for taxo in spk1:
            spk1[taxo] = set(spk1[taxo].split(' - '))
            ki1[taxo] = set(ki1[taxo].split(' - '))
    #         print(ki[taxo])
            ph1[taxo] = set(ph1[taxo].split(' - '))
            cl1[taxo] = set(cl1[taxo].split(' - '))
            or11[taxo] = set(or11[taxo].split(' - '))
            fm1[taxo] = set(fm1[taxo].split(' - '))
            ge1[taxo] = set(ge1[taxo].split(' - '))
            spe1[taxo] = set(spe1[taxo].split(' - '))





        print(spe1)

        Dict['superkingdom'][xx] = spk1
        Dict['kingdom'][xx] =ki1
        Dict['phylum'][xx] =ph1
        Dict['classx'][xx] = cl1
        Dict['order'][xx]  = or11
        Dict['family'][xx] = fm1
        Dict['genus'][xx] = ge1
        Dict['species'][xx] = spe1
            #################################################################################
        zz=zz+1
    #         Dict['reference_wikidata_id'][xx] = storage[0]['naturalProducts'][molindex[0]]['taxonomyReferenceObjects'][molindex[1]][molindex[2]][0]['reference_wikidata_id']

        xx = xx + 1 # Next molecule
        
    global df_lotus    
    df_lotus = pd.DataFrame.from_dict(Dict)
    #df_lotus.to_csv('cfmid_input.tsv', sep = '\t', index = False) 
    
    return df_lotus
            

    

    

# Function to search all the selected listed criteria in LOTUS_DB
def get_lotus_add(list_IDD=['']):
    
    #list_IDD = action.get_selected_search_criteria_list()
    #list_IDD = []
    if list_IDD[0] == '':
        
        print(str(datetime.now()) + " Come on, make a choice ! ")
        #messagebox.showinfo("Info", "Come on, make a chocie !")
    else : 
        
        Dict_neutral = {
                'Lotus_ID' :{} , 'smiles' : {}, 'inchi' : {}, 'inchikey' : {},  'cas' : {}, 'iupac_name' : {}, 'molecular_formula' : {}, 'molecular_weight' : {}, 'xlogp' : {} ,
                'superkingdom':{}, 'kingdom':{}, 'phylum':{}, 'classx':{}, 'order':{}, 'family': {}, 'genus' : {}, 'species' :{} ,
                'chemicalTaxonomyClassyfireKingdom' : {} , 'chemicalTaxonomyClassyfireSuperclass' :{}, 'chemicalTaxonomyClassyfireClass' : {} , 'chemicalTaxonomyClassyfireDirectParent' : {} ,   
                'chemicalTaxonomyNPclassifierPathway' : {} ,'chemicalTaxonomyNPclassifierSuperclass' : {} , 'chemicalTaxonomyNPclassifierClass' : {}            
                ,'traditional_name' : {}
        }
        df_general = pd.DataFrame.from_dict(Dict_neutral)
        
        
        
        for IDD in list_IDD:
            #get_lotus(IDD.split(' : ')[1])
            print(IDD)
            get_lotus(IDD)
            
            df_general = pd.concat([df_general, df_lotus], ignore_index = True)
            df_general= df_general.drop_duplicates(subset=['Lotus_ID'])
        df_general.to_csv(motor.tool_path.get_current_path()[0]+ '/LOTUS_DB_input/cfmid_input.tsv', sep = '\t', index = False)  
        fileout = open(motor.tool_path.get_current_path()[0] + '/LOTUS_DB_input/cfmid_input.txt', "w")
        fileout_sirius_db = open(motor.tool_path.get_current_path()[0] + '/LOTUS_DB_input/structural_db.txt', "w") #####230228
        print(str(datetime.now()) + " There are " + str(len(df_general['Lotus_ID'])) +" molecules for " + str(list_IDD))
        
        #messagebox.showinfo("Info", "There are " + str(len(df_general['Lotus_ID'])) +" molecules for " + str(list_IDD))
        for i in df_general['Lotus_ID']:
             fileout.write(i + ' ' + df_general['smiles'][int(str(df_general.Lotus_ID[df_general.Lotus_ID == i ].index.to_list()[0]))] + '\n' )
             fileout_sirius_db.write(df_general['smiles'][int(str(df_general.Lotus_ID[df_general.Lotus_ID == i ].index.to_list()[0]))] + ' ' + i + '\n' ) ######230228
        fileout.close() 
        fileout_sirius_db.close() #####230228
    errorlog = open(motor.tool_path.get_current_path()[0] + '/log/' + str(datetime.now()).replace(' ', '_').replace(':', '_').replace('.','_') + '_input_criteria.txt', 'w')
    errorlog.write("This log contains criteria for research in the online LOTUS DataBase on the "+ str(datetime.now()) + " ." + "\n")
    errorlog.write('The research has been made with the "for all selected categories" method.' + "\n")
    errorlog.write("There are " + str(len(df_general['Lotus_ID'])) +" molecules corresponding to your criteria." + "\n") 
    for IDD in list_IDD:
        errorlog.write(str(IDD) + "\n")
    errorlog.close()
        
    

    
    
# Function to search combined selected listed criteria in LOTUS_DB   
def get_lotus_or(list_IDD=['']):
    
    #list_IDD = action.get_selected_search_criteria_list()
    #list_IDD = []
    if list_IDD[0] == '':
        print(str(datetime.now()) + " Come on, make a choice ! ")
        #messagebox.showinfo("Info", "Come on, make a chocie !")
    else : 
        
        Dict_neutral = {
                'Lotus_ID' :{} , 'smiles' : {}, 'inchi' : {}, 'inchikey' : {},  'cas' : {}, 'iupac_name' : {}, 'molecular_formula' : {}, 'molecular_weight' : {}, 'xlogp' : {} ,
                'superkingdom':{}, 'kingdom':{}, 'phylum':{}, 'classx':{}, 'order':{}, 'family': {}, 'genus' : {}, 'species' :{} ,
                'chemicalTaxonomyClassyfireKingdom' : {} , 'chemicalTaxonomyClassyfireSuperclass' :{}, 'chemicalTaxonomyClassyfireClass' : {} , 'chemicalTaxonomyClassyfireDirectParent' : {} ,   
                'chemicalTaxonomyNPclassifierPathway' : {} ,'chemicalTaxonomyNPclassifierSuperclass' : {} , 'chemicalTaxonomyNPclassifierClass' : {}            
                ,'traditional_name' : {}
        }
        
        df_general = pd.DataFrame.from_dict(Dict_neutral)
        df_general2 = pd.DataFrame.from_dict(Dict_neutral)
        
        selected_tax = []
        selected_chemical = []
        selected_formula = []
        for IDD in list_IDD:
            if 'T : ' in IDD:
                selected_tax.append(IDD) # Is the criteria a Taxonomic criteria ?
            elif 'C : ' in IDD:
                #selected_chemical.append(IDD.split(' : ')[4]) # Is the criteria a Chemontologic criteria 
                selected_chemical.append(IDD)
            elif 'F : ' in IDD:
                #selected_formula.append(IDD.split(' : ')[2]) # Is the criteria a Formula criteria ?
                selected_formula.append(IDD)
        if selected_tax != [] :         # if taxonomy criteria exist
            for sel_tax in selected_tax:
                
                get_lotus(sel_tax)
                
                if selected_chemical != [] : #if taxonomy and chemontoly criteria exist
                    for sel_chemical in selected_chemical:
                        if sel_chemical.split(' : ')[4] in df_lotus['chemicalTaxonomyNPclassifierPathway'].to_list():
                            new_df = df_lotus.loc[(df_lotus['chemicalTaxonomyNPclassifierPathway'] == str(sel_chemical.split(' : ')[4])) | (df_lotus['chemicalTaxonomyNPclassifierPathway'] == str(str(sel_chemical.split(' : ')[4]) + '|' + str(sel_chemical.split(' : ')[4])))] ####230228
                            df_general = pd.concat([df_general, new_df], ignore_index = True)
                        
                        elif sel_chemical.split(' : ')[4] in df_lotus['chemicalTaxonomyNPclassifierSuperclass'].to_list():
                            new_df = df_lotus.loc[(df_lotus['chemicalTaxonomyNPclassifierSuperclass'] == str(sel_chemical.split(' : ')[4]))]                   
                            df_general = pd.concat([df_general, new_df], ignore_index = True)
                        
                        elif sel_chemical.split(' : ')[4] in df_lotus['chemicalTaxonomyNPclassifierClass'].to_list():
                            new_df = df_lotus.loc[(df_lotus['chemicalTaxonomyNPclassifierClass'] == str(sel_chemical.split(' : ')[4]))]
                            df_general = pd.concat([df_general, new_df], ignore_index = True)
                                
                        
                        
                        if selected_formula != [] :       #if taxonomy and chemontoly and formula criteria exist
                            for sel_formula in selected_formula:
                                if sel_formula.split(' : ')[2] in df_general['molecular_formula'].to_list():
                                    new_df = df_general.loc[(df_general['molecular_formula'] == str(sel_formula.split(' : ')[2]))]                               
                                    df_general2 = pd.concat([df_general2, new_df], ignore_index = True)
                        else :   
                            df_general2 = pd.concat([df_general2, df_general], ignore_index = True) #if taxonomy and chemontoly exist but not formula 
                            
                else : #if taxonomy exist but not chemontology
                    if selected_formula != [] : #if taxonomy and formula criteria exist but not chemontology      
                        for sel_formula in selected_formula:
                            if sel_formula.split(' : ')[2] in df_lotus['molecular_formula'].to_list():
                                new_df = df_lotus.loc[(df_lotus['molecular_formula'] == str(sel_formula.split(' : ')[2]))]                        
                                df_general2 = pd.concat([df_general2, new_df], ignore_index = True)
                    else :   # if only taxonomy criteria exist
                        df_general2 = pd.concat([df_general2, df_lotus], ignore_index = True)
        
        else :    #if taxonomy criteria does not exist
            if selected_chemical != [] :  #if taxonomy criteria does not exist but chemontology exist
                for sel_chemical in selected_chemical:
                    get_lotus(sel_chemical)
                    if selected_formula != [] :    #if taxonomy criteria does not exist but chemontology and formula exist    
                        for sel_formula in selected_formula:
                            
                            if sel_formula.split(' : ')[2] in df_lotus['molecular_formula'].to_list():
                                new_df = df_lotus.loc[(df_lotus['molecular_formula'] == str(sel_formula.split(' : ')[2]))]                            
                                df_general2 = pd.concat([df_general2, new_df], ignore_index = True)
                    else :   #if taxonomy criteria and formula do not exist but chemontology exist
                        df_general2 = pd.concat([df_general2, df_lotus], ignore_index = True)            
            else :  #if taxonomy criteria and chemontoly do not exist
                if selected_formula != [] :   #if taxonomy criteria and chemontoly do not exist but formula exist      
                    for sel_formula in selected_formula:
                        get_lotus(sel_formula)
                        df_general2 = pd.concat([df_general2, df_lotus], ignore_index = True)

        
        #messagebox.showinfo("Info", "There are " + str(len(df_general2['Lotus_ID'])) +" molecules for this research")    
        df_general2= df_general2.drop_duplicates(subset=['Lotus_ID']) #delete duplicates in the results of the search
        if df_general2['Lotus_ID'].to_list():
            df_general2.to_csv(motor.tool_path.get_current_path()[0]+ '/LOTUS_DB_input/cfmid_input.tsv', sep = '\t', index = False)  #export metadata in .TSV file
            
            fileout = open(motor.tool_path.get_current_path()[0]+ '/LOTUS_DB_input/cfmid_input.txt', "w") #export LOTUS_ID and SMILES in text file
            fileout_sirius_db = open(motor.tool_path.get_current_path()[0] + '/LOTUS_DB_input/structural_db.txt', "w") #####230228
            for i in df_general2['Lotus_ID']:
                 fileout.write(i + ' ' + df_general2['smiles'][int(str(df_general2.Lotus_ID[df_general2.Lotus_ID == i ].index.to_list()[0]))] + '\n' )
                 fileout_sirius_db.write(df_general2['smiles'][int(str(df_general2.Lotus_ID[df_general2.Lotus_ID == i ].index.to_list()[0]))] + ' ' + i + '\n' ) ######230228
            fileout.close() 
            fileout_sirius_db.close()
            print(str(datetime.now()) + " There is a total of " + str(len(df_general2['Lotus_ID'].to_list()))  + " molecules for requested categories.")
            #messagebox.showinfo("Info", "There is a total of " + str(len(df_general2['Lotus_ID'].to_list()))  + " molecules for requested categories.")
        else:
            #messagebox.showinfo("Info", "There is no molecules for requested categories.")
            print(str(datetime.now()) + " Info", "There is no molecules for requested categories.")
        
    errorlog = open(motor.tool_path.get_current_path()[0] + '/log/' + str(datetime.now()).replace(' ', '_').replace(':', '_').replace('.','_') + '_input_criteria.txt', 'w')
    errorlog.write("This log contains criteria for research in the online LOTUS DataBase on the "+ str(datetime.now()) + " ." + "\n")
    errorlog.write('The research has been made with the "for selected chemical class.es in selected family.ies" method.' + "\n")
    errorlog.write("There are " + str(len(df_general2['Lotus_ID'])) +" molecules corresponding to your criteria." + "\n") 
    for IDD in list_IDD:
        errorlog.write(str(IDD) + "\n")
    errorlog.close()

    
