DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS pet_profile;
DROP TABLE IF EXISTS connection;
DROP TABLE IF EXISTS language;

CREATE TABLE user_profile (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    birth_date DATE,
    display_name VARCHAR(32),
    location VARCHAR(32),
    preferred_language CHAR(2),
    FOREIGN KEY (user_id) REFERENCES account(user_id),
	FOREIGN KEY (preferred_language) REFERENCES language(language_code)
);
CREATE TABLE user_account (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    passcode VARCHAR(256) NOT NULL, 
    email VARCHAR(128) NOT NULL,  
	is_admin BOOLEAN NOT NULL,
);
CREATE TABLE pet_profile (
    pet_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT, 
    name VARCHAR(250) NOT NULL,
    profile_picture_link VARCHAR(256),
    breed VARCHAR(64), 
    color VARCHAR(16),
    age INT,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) 
);

CREATE TABLE connection (
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    PRIMARY KEY (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES user_account(user_id),
    FOREIGN KEY (user_id_2) REFERENCES user_account(user_id)
);

CREATE TABLE language (
    language_code CHAR(2) UNIQUE NOT NULL PRIMARY KEY,
    language VARCHAR(64) UNIQUE
);
