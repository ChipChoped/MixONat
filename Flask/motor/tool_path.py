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

#get the current path 	
def get_current_path():
    path_id = str(os.getcwd())
    if " "in path_id :
        ll=path_id.split('\\')
        pa = ""
        for i in range(len(ll)):
            if " " in ll[i] :
                pa += '"'+ll[i]+'"/'
            else :
                pa+=ll[i]+"/"
                path_idg = pa[:-1]
        return path_id, path_idg
    else:
        path_idg = path_id
        return path_id, path_idg
    
def vider_repertoires():
    # Définir les chemins des répertoires LOTUS_DB_input et LOTUS_DB_output
    lotus_db_input = 'LOTUS_DB_input'
    lotus_db_output = 'Your_NMR_DataBase'
    try:
        for root, dirs, files in os.walk(lotus_db_input):
            for file in files:
                file_path = os.path.join(root, file)
                os.remove(file_path)
            for dir in dirs:
                dir_path = os.path.join(root, dir)
                shutil.rmtree(dir_path)
        if not os.path.exists(lotus_db_output):
            return

    except Exception as e:
        print("Une erreur s'est produite :", str(e))
        
def get_default_download_directory():
    if os.name == 'nt':  # Windows
        return os.path.join(os.path.expanduser("~"), "Downloads")
    elif os.name == 'posix':  # macOS or Linux
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:
        raise NotImplementedError("Unsupported operating system")
    
def copy_file_to_default_directory(file_path):
    default_directory = get_default_download_directory()
    destination_path = os.path.join(default_directory, os.path.basename(file_path))
    shutil.copy2(file_path, destination_path)
    
def is_file_exist(directory, filename):
    file_path = os.path.join(directory, filename)
    return os.path.isfile(file_path)