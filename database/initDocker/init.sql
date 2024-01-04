DROP DATABASE IF EXISTS mixonat;
CREATE DATABASE mixonat;

DO $$
DECLARE 
    seq_name RECORD;
BEGIN
    -- Créer l'utilisateur mixo et accorder des privilèges sur la base de données
    BEGIN
        CREATE USER mixo WITH PASSWORD 'mixo';
        GRANT ALL PRIVILEGES ON DATABASE Mixonat TO mixo;
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE '%, skipping', SQLERRM USING ERRCODE = SQLSTATE;
    END;

    -- Accorder des droits sur toutes les séquences du schéma public à l'utilisateur mixo
    FOR seq_name IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public.' || seq_name.sequencename || ' TO mixo';
    END LOOP;
END $$;




\connect mixonat

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sdf;
DROP TABLE IF EXISTS rmn;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id SERIAL,
    uuid UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    role VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE sdf (
    id SERIAL,
    uuid UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    file TEXT,
    author TEXT NOT NULL,
    added_by UUID REFERENCES users(uuid),
    added_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS rmn (
    id SERIAL,
    uuid UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    file TEXT,
    author TEXT NOT NULL,
    added_by UUID REFERENCES users(uuid),
    added_at TIMESTAMPTZ DEFAULT NOW());

INSERT INTO users (first_name, last_name, email, password, role)
VALUES ('Admin', 'Admin', 'admin@mixonat.fr',
        '$2a$06$hxJgB9phgXE1N0PzFJGcHeFrMjHzcYouIAgifa/AKlHemKgr9cr1q', -- 1pwdAdmin
        'ROLE_ADMIN');