"""
nmr_tags.py:
	reads: cfmid_input_2D.sdf
	reads: cfmid_input_2D_nmr_sorted.txt
	writes: LOTUS_DB_predict.sdf


cfmid_input_2D_nmr_sorted.txt: wwritten by molsort.py
fcfmid_input_2D.sdf: read by user, possibly using EdiSdf

called by: python nmr_tags.py 

The file cfmid_input_2D.sdf contains structural data about compounds
The file cfmid_input_2D_nmr_sorted.txt contains 13C NMR chemical shift data for all molecules
in cfmid_input_2D.sdf
nmr_tags.py appends NMR data to cfmid_input_2D.sdf according to a trivial format
and writes the result to file LOTUS_DB_predict.sdf
"""

from rdkit import Chem
import sys


# get family name from command line
inputfilename = 'cfmid_input_2D_nmr_sorted.txt'
sdfnamein = 'cfmid_input_2D.sdf'
sdfnameout = 'LOTUS_DB_predict.sdf'
# build names from family name for input and output files

reader = Chem.SDMolSupplier(sdfnamein)
writer = Chem.SDWriter(sdfnameout)
# open input and output SDF files for reading and for writing

with open(inputfilename) as fpin:
	for molindex, m in enumerate(reader, start=1):
# iterate through compounds in file
		carbons = [a for a in m.GetAtoms() if a.GetSymbol() == 'C']
# make list of carbon atoms
		if not carbons:
			continue
# skip to next molecule if the current one has no carbon atom
		nmrindex, atomstring, cshiftstring = fpin.readline().strip().split('|')
# extract carbon atom index and correspond chemical shifts, as strings
		atoms = atomstring.strip().split()
# get list of carbon atom indexes
		cshifts = [float(x) for x in cshiftstring.strip().split()]
# get list of chemical shifts, in the order of carbon atom indexes
		pairs = zip(atoms, cshifts)
# prepare write according to trivial format
		nmrlines = ["%s, %.1f \\" % pair for pair in pairs]
# NMR data formatting for each carbon atom
		assignment = '\n'.join(nmrlines)
# create property value for SDF
		m.SetProp('NMRSHIFTDB2_ASSIGNMENT', assignment)
# append NMReDATA assignment tag to the current compound
		writer.write(m)
# write the current NMReDATA record to file LOTUS_DB_predict.sdf
