import motor.ginfo
#from tool_path import *

def get_family():
    #selected_taxonomy_db  = gui.get_taxonomy_db_var()
    #print(str(datetime.now()) +" The Taxonomy you have chosen is: " + selected_taxonomy_db +".")
    #global taxonomy_family_list
    taxonomy_family_list = []
    #global taxonomy_dataframe_1
    '''
    if selected_taxonomy_db != "All_Taxonomy_DB":    # if All_Taxonomy_DB not chosen, get Family_list from chosen Taxonomy criteria
        taxonomy_dataframe_1 = motor.ginfo.get_taxonomy_file()[0].loc[motor.ginfo.get_taxonomy_file()[0]['Taxonomy_DB'] == selected_taxonomy_db]
        
        for family in taxonomy_dataframe_1['family'].to_list():
            if family not in taxonomy_family_list:
                taxonomy_family_list.append(str(family))
     
    else : 
    '''
    for family in motor.ginfo.get_taxonomy_file()[1]['family'].to_list(): # if All_Taxonomy_DB has been chosen, get Family_list for general 
        if family not in taxonomy_family_list:
            taxonomy_family_list.append(str(family))
    taxonomy_family_sorted_list = sorted(taxonomy_family_list)
    #clear_taxonomy()
    '''
    for unique_family in taxonomy_family_sorted_list:
        gui.taxonomy_family_listbox.insert('end', unique_family)
    gui.taxonomy_family_listbox.pack()
    '''
    return taxonomy_family_sorted_list
    
# Get Genus_list from corresponding family and Taxonomy
def get_genus(family=None):
    taxonomy_unique_genus_list = []
    '''
    global taxonomy_dataframe_2
    selected_taxonomy_family  = gui.get_taxonomy_db_var()
    if selected_taxonomy_family != "All_Taxonomy_DB":
        taxonomy_dataframe_2 = taxonomy_dataframe_1.loc[taxonomy_dataframe_1['family'] == family]
    else :
        taxonomy_dataframe_2 = motor.ginfo.get_taxonomy_file()[1].loc[motor.ginfo.get_taxonomy_file()[1]['family'] == family]
    '''
    global taxonomy_dataframe_2 
    if family == None:
        return taxonomy_unique_genus_list
    else:
        taxonomy_dataframe_2 = motor.ginfo.get_taxonomy_file()[1].loc[motor.ginfo.get_taxonomy_file()[1]['family'] == family]
        
    for genus in taxonomy_dataframe_2['genus'].to_list():
        #for genus in taxonomy_dataframe_2['genus'].to_list():
        if genus not in taxonomy_unique_genus_list:
            taxonomy_unique_genus_list.append(str(genus))
    return sorted(taxonomy_unique_genus_list)
    

# Get Species_list from corresponding genus and Taxonomy
def get_species(genus=None):
    taxonomy_species_list = []
    global taxonomy_dataframe_3
    if genus == None:
       return taxonomy_species_list
    else:
        taxonomy_dataframe_3 = taxonomy_dataframe_2.loc[taxonomy_dataframe_2['genus'] == genus]
    #taxonomy_dataframe_3 = taxonomy_dataframe_2.loc[taxonomy_dataframe_2['genus'] == genus]
    for species in taxonomy_dataframe_3['species'].to_list():
        #for species in taxonomy_dataframe_3['species'].to_list():
        if species not in taxonomy_species_list:
            taxonomy_species_list.append(species)
    return sorted(taxonomy_species_list)

# Get the NP_Pathway
def get_NPclassifierPathway():
    chemontology_NPclassifierPathway_list = []
    
    for pathway in motor.ginfo.get_chemontology_file()['chemicalTaxonomyNPclassifierPathway'].to_list():
        if pathway not in chemontology_NPclassifierPathway_list:
            chemontology_NPclassifierPathway_list.append(str(pathway))
    chemontology_NPclassifierPathway_sorted_list =  sorted(chemontology_NPclassifierPathway_list)
    #clear_chemontology()
    '''
    for NPclassifierPathway in chemontology_NPclassifierPathway_sorted_list:
        gui.chemontology_pathway_listbox.insert('end', NPclassifierPathway)
    gui.chemontology_pathway_listbox.pack()
    '''
    return chemontology_NPclassifierPathway_sorted_list

# Get the NP_Superclass corresponding to the chosen NP_Pathway
def get_NPclassifierSuperclass(chemicalTaxonomyNPclassifierPathway=None):
    chemontology_NPclassifieSuperclass_list = []
    global chemontology_dataframe_1
    if chemicalTaxonomyNPclassifierPathway == None:
        return chemontology_NPclassifieSuperclass_list
    else:
        chemontology_dataframe_1 = motor.ginfo.get_chemontology_file().loc[motor.ginfo.get_chemontology_file()['chemicalTaxonomyNPclassifierPathway'] == chemicalTaxonomyNPclassifierPathway]
    #chemontology_dataframe_1 = motor.ginfo.get_chemontology_file().loc[motor.ginfo.get_chemontology_file()['chemicalTaxonomyNPclassifierPathway'] == chemicalTaxonomyNPclassifierPathway]
    for NPclassifierSuperclass in chemontology_dataframe_1['chemicalTaxonomyNPclassifierSuperclass'].to_list():
        #for NPclassifierSuperclass in chemontology_dataframe_1['chemicalTaxonomyNPclassifierSuperclass'].to_list():
        if NPclassifierSuperclass not in chemontology_NPclassifieSuperclass_list:
            chemontology_NPclassifieSuperclass_list.append(str(NPclassifierSuperclass))
    return sorted(chemontology_NPclassifieSuperclass_list)

# Get the NP_Superclass corresponding to the chosen NP_Class
def get_NPclassifierClass(chemicalTaxonomyNPSuperclass=None):
    chemontology_NPclassifierClass_list = []
    if chemicalTaxonomyNPSuperclass == None:
        return chemontology_NPclassifierClass_list
    else:
        chemontology_dataframe_2 = chemontology_dataframe_1.loc[chemontology_dataframe_1['chemicalTaxonomyNPclassifierSuperclass'] == chemicalTaxonomyNPSuperclass]
    #chemontology_dataframe_2 = chemontology_dataframe_1.loc[chemontology_dataframe_1['chemicalTaxonomyNPclassifierSuperclass'] == chemicalTaxonomyNPSuperclass]
    for NPclassifierClass in chemontology_dataframe_2['chemicalTaxonomyNPclassifierClass'].to_list():
        #for NPclassifierClass in chemontology_dataframe_2['chemicalTaxonomyNPclassifierClass'].to_list():
        if NPclassifierClass not in chemontology_NPclassifierClass_list:
            chemontology_NPclassifierClass_list.append(str(NPclassifierClass))
    return sorted(chemontology_NPclassifierClass_list)