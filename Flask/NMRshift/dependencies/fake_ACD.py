#!/usr/bin/env python
# coding: utf-8

# In[1]:


"""
fakeACD.py defines a transform() function that is used by sdfrw.sdfTransform(filenameIn, filenameOut, transform)
in order to add CNMR_SHIFTS in "ACD CNMR Predictor" style tags to an input sdf file 
using 13C NMR chemical shift values calculated by nmrshiftdb2.
The resulting .sdf file is correctly imported in an ACD Database created from ACD CNMR Predictor (+DB).
"""
import os
import sys
import sdfrw


# In[2]:


def acd_string_format(s):
	"""
	formats strings that are more than 200 characters long to fit with the way
	ACD formats long strings in sdf values
	"""
	limit = 200
# maximum length of a line
	lens = len(s)
# get length of string sent by the caller
	if lens <= limit:
# is it a small string?
		return s
# nothing to do for strings with less then 200 characters (included)
	lensm1 = lens-1
# lensm1 is lens minus one
	ranges = [(x*limit, (x+1)*limit) for x in range(lensm1 // limit)]
# calulates ranges at pairs of character indexes for string slicing
	ranges.append( (ranges[-1][1], lens) )
# update ranges with the indexes of the last (most probably incomplete) slice
	return '\n'.join(s[r[0]:r[1]] for r in ranges)
# get the list of slices, joins with newlines and return the result to the caller


# In[3]:


def transform(mol):
	"""
	transform()
	"""
	nmrskey = "NMRSHIFTDB2_ASSIGNMENT"
	acdkey = "CNMR_SHIFTS"
	trueacdkey = "GENUINE_" + acdkey
# sdf tag in use here	
	sdfkeyvals = mol["keyvals"]
# get the list of pairs that is relative to the current molecule.
	sdfkeys = [kv[0] for kv in sdfkeyvals]
# build list of sdf tags
	if nmrskey not in sdfkeys:
# is there a NMRSHIFTDB2_ASSIGNMENT present in mol?
		return mol
# do not anything with mol if no NMRSHIFTDB2_ASSIGNMENT tag
	nmrs_pos = sdfkeys.index(nmrskey)
# find index of NMRSHIFTDB2_ASSIGNMENT sdf tag
	nmrs_val = sdfkeyvals[nmrs_pos][1]
# get nmrshiftdb assignment
	nmrlines = [line[:-2] for line in nmrs_val.split('\n')[1:]]
	nmrs_parts = [line.split(', ') for line in nmrlines]
	fake = '>  <'+acdkey+'>\n'+acd_string_format(';'.join([str(n)+':'+d[0]+'|'+d[1] for (n, d) in enumerate(nmrs_parts)]))
# make fake CNMR_SHIFTS value from NMRSHIFTDB2_ASSIGNMENT value
	new_acd_pair = (acdkey, fake)
# create the new tag-value pair as if it came from ACD but coming from nmrshiftdb2
	if acdkey in sdfkeys:
# is there already a CNMR_SHIFTS tag in mol?
# !!!!!!!!!!! not tested, probably wrong because new_acd_pair does not follow the same pattern as old_acd_pair
		"""
		acd_pos = sdfkeys.index(acdkey)
		old_acd_pair = sdfkeyvals[acd_pos]
		sdfkeyvals[acd_pos] = new_acd_pair
		if trueacdkey in sdfkeys:
			true_acd_pos = sdfkeys.index(trueacdkey)
			sdfkeyvals[true_acd_pos] = old_acd_pair
		else:
			sdfkeyvals.append( (trueacdkey, old_acd_pair[1]) )
		"""
		pass
	else:
# no CNMR_SHIFTS tag in mol
		sdfkeyvals.append(new_acd_pair)
# create the tag-value pair in the list of tag-values
	mol["keyvals"] = sdfkeyvals
# update molecule
	return mol
# return new molecule



filenameIn = 'LOTUS_DB_predict.sdf'
# get input .sdf file name
head, tail = os.path.split(filenameIn)
# prepare the creation of the output file name
filenameOut = os.path.join(head, 'fake_acd_' + tail)
# prepend fake_acd_ to input file name to obtain the output file name
sdfrw.sdfTransform(filenameIn, filenameOut, transform)
# simply call sdfTransform() from the sdfrw library, with the locally defined transform() function.

