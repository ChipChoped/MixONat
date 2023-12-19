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

DROP TABLE IF EXISTS sdf;
DROP TABLE IF EXISTS users;

CREATE TABLE sdf (
	id SERIAL PRIMARY KEY,
	name TEXT,
	sdf_file TEXT);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);