DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS files;

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

CREATE TABLE files (
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    type TEXT,
    file TEXT,
    author TEXT NOT NULL,
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT type_check CHECK (type IN ('SDF', 'SPECTRUM', 'DEPT90', 'DEPT135')));

INSERT INTO users (id, first_name, last_name, email, password, role)
VALUES ('d287b4b3-16ac-4b83-800e-42a6d64d6df1',
        'Test', 'Test', 'test@test.fr',
        '$2a$06$bwpaSKPLACLvlg/SW/r1hOd9Cadf9U0hdQB/W2Xp5XW7mn0ykorCm', -- 1pwdTest?
        'ROLE_USER');

INSERT INTO files (id, name, type, file, author, added_by)
VALUES ('3aa1c8f4-14dc-499b-a876-0c6c2c497ec8',
        'SDF Test', 'SDF', 'SDF test file content',
        'Test', 'd287b4b3-16ac-4b83-800e-42a6d64d6df1'),
       ('1b8c7f80-559f-4c33-9c65-86bab55e4ada',
        'SPECTRUM Test', 'SPECTRUM', 'SPECTRUM test file content',
        'Test', 'd287b4b3-16ac-4b83-800e-42a6d64d6df1'),
       ('e4c4696e-e024-4a90-a975-bac150343b22',
        'DEPT90 Test', 'DEPT90', 'DEPT90 test file content',
        'Test', 'd287b4b3-16ac-4b83-800e-42a6d64d6df1'),
       ('71764318-4565-4c74-bb97-0985b7a0e497',
        'DEPT135 Test', 'DEPT135', 'DEPT135 test file content',
        'Test', 'd287b4b3-16ac-4b83-800e-42a6d64d6df1');
