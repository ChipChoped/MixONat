import flask
from flask import Flask, request
from flask_cors import CORS
from markupsafe import escape
from checkers.matchinginputschecker import MatchingInputsChecker
from threads.matchingprocessthread import MatchingProcessThread
import io
from motor.data_structures import Spectrum, SDF
from checkers.filechecker import FileChecker
import json
import motor.lotus_ressources as lr
import motor.ginfo 
import motor.tool_path
import motor.l2sdf

app = Flask(__name__)
CORS(app)
             
"""
    Function to handle requests to start the motor from spring-boot
"""
@app.route("/motor", methods=['GET','POST'])
def startMotor():
    request = flask.request.json
    
    filesKeys = ['sdf', 'spectrum', 'dept135', 'dept90']
    files = {x:request[x] for x in filesKeys}

    params = request['params']

    molecularWeightProcessing(params)
    
    checker = MatchingInputsChecker(files, params)

    if checker.message:
        print(checker.message)  # errors message
        return "error"
    else:
        thread = MatchingProcessThread(checker)
        thread.start()
        thread.join()
        resp = flask.Response(thread.results.toJson())
        resp.headers['Content-Type'] = 'application/json'
        return resp

"""
    Function to handle Post requests for files checking from spring-boot
"""
@app.route("/checkFile", methods=['POST'])
def checkFile():
    request = flask.request.json
    fileToCheckType = request['fileType']
    file = request['file']
    
    try :
        if fileToCheckType=='sdf':
            temp = SDF(file,False)
        else : 
            temp = Spectrum(file,False)

        resp = flask.Response(temp.toJson(fileToCheckType))
        resp.headers['Content-Type'] = 'application/json'
        return resp

    except Exception as e :
        Error ='{"checkResult":' + json.dumps(str(e)) + ',"type":"'+fileToCheckType+'"}'
        resp = flask.Response(Error)
        resp.headers['Content-Type'] = 'application/json'
        return resp
        
@app.route("/getFamily", methods=['GET'])
def getFamily():
    taxonomy_family_sorted_list = lr.get_family()
    return json.dumps(taxonomy_family_sorted_list)

@app.route("/getGenus/<genus>", methods=['GET'])
def getGenus(genus):
    taxonomy_genus_sorted_list = lr.get_genus(genus)
    return json.dumps(taxonomy_genus_sorted_list)

@app.route("/getSpecies/<species>", methods=['GET'])
def getSpecies(species):
    taxonomy_species_sorted_list = lr.get_species(species)
    return json.dumps(taxonomy_species_sorted_list)

@app.route("/getPathway", methods=['GET'])
def getPathway():
    ontology_pathway_sorted_list = lr.get_NPclassifierPathway()
    return json.dumps(ontology_pathway_sorted_list)

@app.route("/getSuperclass/<pathway>", methods=['GET'])
def getSuperclass(pathway):
    ontology_superclass_sorted_list = lr.get_NPclassifierSuperclass(pathway)
    return json.dumps(ontology_superclass_sorted_list)

@app.route("/getClass/<superclass>", methods=['GET'])
def getClass(superclass):
    ontology_class_sorted_list = lr.get_NPclassifierClass(superclass)
    return json.dumps(ontology_class_sorted_list)

@app.route("/getTaxonomyFiltre/<type>/<criteria>", methods=['GET'])
def getTaxonomyFiltre(type,criteria):
    filtre = lr.put_taxonomy_criteria_to_search_criteria(type,criteria)
    return json.dumps(filtre)

@app.route("/getOntologyFiltre/<type>/<criteria>", methods=['GET'])
def getOntologyFiltre(type,criteria):
    filtre = lr.put_chemontology_criteria_to_search_criteria(type,criteria)
    return json.dumps(filtre)

@app.route('/createSdf', methods=['POST'])
def createSdf():
    data = request.json.get('array')
    fileName = request.json.get('fileName')
    flat_list = [item for sublist in data for item in sublist]
    motor.tool_path.vider_repertoires()
    motor.ginfo.get_lotus_add(flat_list)
    if fileName == "":
        fileName = "newSDF"
    #motor.l2sdf.lotus2sdf(fileName)
    return '',200
        


"""
    Function to adjust molcular_weight Parameter 
"""
def molecularWeightProcessing(params) :  # in the motor, molecular_weight takes the next possible values : False, ['x1','x2','x3'] specific values , <'x1','x2'> Interval 
    if (params['molecular_weight']==''):    # the default value of molecular_weight in front-end is an empty String
        params['molecular_weight'] = False
    else :
        str = params['molecular_weight'][1:-1]  # remove [ or < and ] or >

        if (params['molecular_weight'][0]=='['):  # check if it's [ ] or <> and convert accordingly to list or tuple 
             params['molecular_weight'] = str.split(";")
        else :
             params['molecular_weight'] = tuple(str.split(";"))


# http://127.0.0.1:5000/
if __name__ == '__main__':
     app.run()
