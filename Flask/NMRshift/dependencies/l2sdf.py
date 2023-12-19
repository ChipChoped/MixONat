import os, sys
from rdkit import Chem

try:
	from rdkit.Chem import rdCoordGen
	drawingFunction = rdCoordGen.AddCoords
# recent, nice (slow?) 2D coordinates generator
except:
	from rdkit.Chem import AllChem
	drawingFunction = AllChem.Compute2DCoords
# historical 2D coordinates generator

# define path
path_id = os.getcwd()
path_id_1 = str('/'.join(path_id.split('\\')[:-1]) + '/')

# define input and output files
inputfilename =  path_id_1 + '/LOTUS_DB_input/cfmid_input.txt'
outputfilename = path_id +'/cfmid_input_2D.sdf'

# get data for the whole set of compounds
with open(inputfilename, "r") as fpin, open(outputfilename, 'w') as sdfile:
	data = fpin.read().split('\n')
	for compound in data[:-1]:
		cid, smiles = compound.split(' ')
        
# get compound_id, SMILES for the current compound
		if not smiles:
			print(cid, "SMILES is empty")
			continue
# next compound if no SMILES (should not happen?)
		m = Chem.MolFromSmiles(smiles)
# RDKit molecule construction from SMILES decoding
		if m is None:
			print(cid, "Cannot build molecule from SMILES")
			continue
		m.SetProp("_Name", str(cid ))
# give the compound_id as title to the MolBlock
		try:
			drawingFunction(m)
# calculate 2D coordinates
		except:
			print("Cannot generate structure diagram for molecule")
			continue
# next compound if 2D coordinate generation failed (why should this happen?)
		sdfile.write(Chem.MolToMolBlock(m) + "$$$$\n")
# write MolBlock of the current compound to file cfmid_input_2D.sdf and make an SDF record of it.