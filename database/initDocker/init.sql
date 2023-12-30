DROP DATABASE IF EXISTS mixonat;
CREATE DATABASE mixonat;

DO $$
    BEGIN
        CREATE USER mixo WITH PASSWORD 'mixo';
        GRANT ALL PRIVILEGES ON DATABASE Mixonat TO mixo;
        EXCEPTION WHEN duplicate_object THEN RAISE NOTICE '%, skipping', SQLERRM USING ERRCODE = SQLSTATE;
    END
$$;

\connect mixonat

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sdf;
DROP TABLE IF EXISTS rmn;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    role VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE sdf (
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    file TEXT,
    author TEXT NOT NULL,
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS rmn (
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    file TEXT,
    author TEXT NOT NULL,
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMPTZ DEFAULT NOW());

INSERT INTO users (first_name, last_name, email, password, role)
VALUES ('Admin', 'Mixonat', 'admin@mixonat.fr',
        '$2a$06$hxJgB9phgXE1N0PzFJGcHeFrMjHzcYouIAgifa/AKlHemKgr9cr1q', -- 1pwdAdmin
        'ROLE_ADMIN');