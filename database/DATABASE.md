/**************************************/
/*     INSTALLATION DE POSTGRESQL     */
/**************************************/

Dans un terminal, lancer la commande suivante :

sudo apt install postgresql



/**********************************/
/*     CONNEXION A POSTGRESQL     */
/**********************************/

Dans un terminal, lancer les commandes suivantes :

sudo su - postgres

psql



/**********************************************/
/*     CREER UNE NOUVELLE BASE DE DONNEES     */
/**********************************************/

Lancer la commande suivante pour créer une nouvelle base de données mixonat :

CREATE DATABASE mixonat;



/***************************************/
/*     CREER UN NOUVEL UTILISATEUR     */
/***************************************/

Lancer les commandes suivantes pour créer un nouvel utilisateur mixo et lui donner les droits sur la base de données mixonat :

CREATE USER mixo WITH PASSWORD 'mixo';

GRANT ALL PRIVILEGES ON DATABASE Mixonat TO mixo;



/************************************/
/*     CREER UNE NOUVELLE TABLE     */
/************************************/

Lancer les commandes suivantes pour ajouter une nouvelle table sdf à la base de données :

exit

psql -h localhost -U mixo -d mixonat -f <chemin absolu du fichier>/sdf.sql
