from rdkit import Chem
import sys
import pandas as pd
import os


    
path_id = os.getcwd()
path_id_1 = str('/'.join(path_id.split('\\')[:-1]) + '/')
path_id_2 = str('/'.join(path_id.split('\\')) + '/')

sdfnamein = path_id_2 + 'fake_acd_LOTUS_DB_predict.sdf'
sdfnameout = path_id_2 + '13C_NMR_Database.sdf'
tag_file = pd.read_csv(path_id_1 + 'LOTUS_DB_input/cfmid_input.tsv', sep = '\t')

reader = Chem.SDMolSupplier(sdfnamein)
writer = Chem.SDWriter(sdfnameout)


for molindex, m in enumerate(reader, start=1):
    NOM = m.GetProp('_Name')
    if str(NOM) in tag_file['Lotus_ID'].to_list():
        m.SetProp('ID' , str(molindex) )
        
        #m.SetProp('superkingdom' , str(tag_file['superkingdom'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]) )
        #m.SetProp('kingdom' , str(tag_file['kingdom'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('phylum' , str(tag_file['phylum'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('classx' ,str(tag_file['classx'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])] ))
        #m.SetProp('order' , str(tag_file['order'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('family' , str(tag_file['family'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('genus' , str(tag_file['genus'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('species' , str(tag_file['species'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))

        #m.SetProp('chemicalTaxonomyClassyfireKingdom' ,str(tag_file['chemicalTaxonomyClassyfireKingdom'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))] ))
        #m.SetProp('chemicalTaxonomyClassyfireSuperclass' ,str(tag_file['chemicalTaxonomyClassyfireSuperclass'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))
        #m.SetProp('chemicalTaxonomyClassyfireClass' , str(tag_file['chemicalTaxonomyClassyfireClass'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))
        #m.SetProp('chemicalTaxonomyClassyfireDirectParent' , str(tag_file['chemicalTaxonomyClassyfireDirectParent'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))
        
        #m.SetProp('chemicalTaxonomyNPclassifierPathway' , str(tag_file['chemicalTaxonomyNPclassifierPathway'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))
        #m.SetProp('chemicalTaxonomyNPclassifierSuperclass' , str(tag_file['chemicalTaxonomyNPclassifierSuperclass'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))
        #m.SetProp('chemicalTaxonomyNPclassifierClass' , str(tag_file['chemicalTaxonomyNPclassifierClass'][int(str(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0]))]))

        #m.SetProp('smiles' , str(tag_file['smiles'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('inchi' , str(tag_file['inchi'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('inchikey' , str(tag_file['inchikey'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        #m.SetProp('iupac_name' , str(tag_file['iupac_name'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        m.SetProp('Formula' , str(tag_file['molecular_formula'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        m.SetProp('FW' , str(tag_file['molecular_weight'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        m.SetProp('CAS' , str(tag_file['cas'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])]))
        m.SetProp('Name' , str(tag_file['traditional_name'][int(tag_file.Lotus_ID[tag_file.Lotus_ID == NOM].index.to_list()[0])][2:-1]).replace('\\', '|'))        
      
        old_13Cpredicted = m.GetProp('NMRSHIFTDB2_ASSIGNMENT')
        m.SetProp('Predicted 13C shifts', old_13Cpredicted)
        m.ClearProp('NMRSHIFTDB2_ASSIGNMENT')  
        
        old_13Cpredicted = m.GetProp('CNMR_SHIFTS')
        m.ClearProp('CNMR_SHIFTS')  
        m.SetProp('CNMR_SHIFTS', old_13Cpredicted)
        
        m.SetProp('HNMR_SHIFTS' , '')
        m.SetProp('CNMR_CALC_SHIFTS' , '')
        m.SetProp('HNMR_CALC_SHIFTS' , '')
        m.SetProp('NMR_CONSTANTS' , '')

        writer.write(m)
        

