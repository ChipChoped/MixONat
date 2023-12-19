#!/usr/bin/env python
# coding: utf-8


from glob import glob
import os
import shutil

path_id = os.getcwd()
path_id_2 = str('/'.join(path_id.split('\\')[:-1]) + '/')


target1 = '*.sdf'
target2 = '*.txt'

files1 = glob(target1)
files2 = glob(target2)

directory = 'Your_NMR_DataBase'

if os.path.exists(path_id_2 + 'Your_NMR_DataBase'):
    shutil.rmtree(path_id_2 + 'Your_NMR_DataBase')
    os.mkdir(path_id_2 + 'Your_NMR_DataBase')
else:
    os.mkdir(path_id_2 + 'Your_NMR_DataBase')


       
for file1 in files1:
         os.rename( file1,  path_id_2 + directory + "/" + os.path.basename(file1))

for file2 in files2:
         os.rename(file2,  path_id_2 + directory + "/" + os.path.basename(file2))

