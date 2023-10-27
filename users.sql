DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS USERS;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password CHAR(256) NOT NULL,
    status VARCHAR(20)
);

INSERT INTO users (firstname, lastname, email, password, status) VALUES
 -- PSW: Axel-Brunet1!
('Axel', 'Brunet', 'axel-brunet@outlook.fr', 'f64ca5862980325338b915dffb91f94d5b69f7ed4ac5f92ea48fbfd03fcd6e99', 'Researcher'),
-- PSW: Laura-Marty2?
('Laura', 'Marty', 'laura-marty@outlook.fr', 'e9ca86992cf8941700f9a77f531313b190638d2c1012508be48b6cf46b875dd9', 'Researcher'),
-- PSW: Lucie-Riviere3#
('Lucie', 'Rivière', 'lucie-riviere@outlook.fr', '2c769b915eb55aac2edd9900a1000c72f3de4cd04504a40c7cc4b1264ac9b577', 'PhD Student')
;