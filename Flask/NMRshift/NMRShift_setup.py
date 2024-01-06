import os

path_id = os.getcwd()
if " "in path_id :
    ll=path_id.split('\\')
    pa = ""
    for i in range(len(ll)):
        if " " in ll[i] :
            pa += '"'+ll[i]+'"/'
        else :
            pa+=ll[i]+"/"
    path_idg = pa[:-1]
else:
    path_idg = path_id

if "app" in path_id:
    
    java_path_file = path_idg + '/java_path.txt'
    if not os.path.exists(java_path_file):
        os.system('which java > ' + java_path_file)
        java_path = open(java_path_file, 'r').read().split('\n')[0]
        predictSdf = open(path_id + '/predictSdf.bat','w').write('"' + java_path + '"' +  ' -Xmx1g -classpath predictorc.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-interfaces.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-io.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-core.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-data.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-standard.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-sdg.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-valencycheck.jar:/app/flask/NMRshift/nmrshiftdb2/library/vecmath1.2-1.14.jar:/app/flask/NMRshift/nmrshiftdb2/library/jgrapht.jar:/app/flask/NMRshift/nmrshiftdb2/library/antlr-2.7.2.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-atomtype.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-ioformats.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-legacy.jar:/app/flask/NMRshift/nmrshiftdb2/library/guava-17.0.jar:/app/flask/NMRshift/nmrshiftdb2/library/cdk-smiles.jar:/app/flask/NMRshift/nmrshiftdb2/library/beam-core-0.9.2.jar:/app/flask/NMRshift/nmrshiftdb2/library/beam-func-0.9.2.jar:. Demo $1 $2 $3')
        print('NMRshift has been configured.')
    else:
        print('NMRshift has already been configured.')

else:
    
    if not os.path.exists(path_idg + '/java_path.txt'):
        os.system('where java.exe > ' + path_idg + '/java_path.txt')
        java_path = open(path_id + '/java_path.txt','r').read().split('\n')[0]
        predictSdf = open(path_id + '/predictSdf.bat','w').write('"' + java_path + '"' +  ' -Xmx1g -classpath predictorc.jar;nmrshiftdb2/library/cdk-interfaces.jar;nmrshiftdb2/library/cdk-io.jar;nmrshiftdb2/library/cdk-core.jar;nmrshiftdb2/library/cdk-data.jar;nmrshiftdb2/library/cdk-standard.jar;nmrshiftdb2/library/cdk-sdg.jar;nmrshiftdb2/library/cdk-valencycheck.jar;nmrshiftdb2/library/vecmath1.2-1.14.jar;nmrshiftdb2/library/jgrapht.jar;nmrshiftdb2/library/antlr-2.7.2.jar;nmrshiftdb2/library/cdk-atomtype.jar;nmrshiftdb2/library/cdk-ioformats.jar;nmrshiftdb2/library/cdk-legacy.jar;nmrshiftdb2/library/guava-17.0.jar;nmrshiftdb2/library/cdk-smiles.jar;nmrshiftdb2/library/beam-core-0.9.2.jar;nmrshiftdb2/library/beam-func-0.9.2.jar;. Demo "%1" "%2" "%3"')
        print('NMRshift has been configurated.')
    else:
        print('NMRshift has already been configurated.')
