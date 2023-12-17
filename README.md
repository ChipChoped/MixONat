# MixONat

## Docker


### 3 services existants :
```
Front : react-mixonat
Back : conductor-mixonat
BDD : postgres
Flask : flask
```

### Pour exécuter l'app :
> docker-compose build \
> docker-compose up

### Pour exécuter un service en particulier :
> docker-compose build [service] \
> docker-compose up [service]

### /!\ Pour exécuter en local, mettre localhost dans le fichier properties :
> ./Conductor/src/main/resources/application.properties

## Structure


### Front

./react

Exécution :
> npm install \
> npm start

### Back

./Conductor 

Exécution :
> ./mvnw dependency:go-offline \
> ./mvnw spring-boot:run

### Base de donnée

./database

Base de donnée Postgresql, voir DATABASE.md \
Afin de lancer un script sql au lancement de l'image Docker, placer le fichier sql dans :
> ./database/initDocker/

### Flask

./Flask

> pip install -r requirements.txt \
> py main.py

## Getting started

### Launching the MixONat server

A version of Python 3.9 is required.

```bash
pip install -r ./Flask/requirements.txt
python ./Flask/main.py
```

### Launching the website server

You must first define the environment variable JAVA_HOME to the path of your JDK installation.

```bash
cd ./Conductor/
./mvnw.cmd compile spring-boot:run
```

### Launching the website client

```bash
npm install react-scripts --save --prefix ./react/my-app/
npm start --prefix ./react/my-app/
```

