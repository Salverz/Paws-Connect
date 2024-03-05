SET REFERENTIAL_INTEGRITY FALSE;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS user_friends;
DROP TABLE IF EXISTS language;
DROP TABLE IF EXISTS breed;
DROP TABLE IF EXISTS user;
SET REFERENTIAL_INTEGRITY TRUE;

CREATE TABLE userProfile (
    ID INT NOT NULL PRIMARY KEY,
    username VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    birthDate DATE,
    displayname VARCHAR(250),
    isAdmin BOOLEAN,
    chosenLocation VARCHAR(250),
    selectedLanguage VARCHAR(100),
    FOREIGN KEY (ID) REFERENCES account(ID)
);
CREATE TABLE account (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(250) NOT NULL,
    passcode VARCHAR(250) NOT NULL, 
    email VARCHAR(250) NOT NULL,  
);
CREATE TABLE petsProfile (
    petsID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT, 
    petname VARCHAR(250) NOT NULL,
    petPictureRef VARCHAR(250),
    breed VARCHAR(100), 
    color VARCHAR(100),
    age INT,
    FOREIGN KEY (userID) REFERENCES user(ID) 
);

CREATE TABLE user_friends (
    userID INT NOT NULL,
    friendID INT NOT NULL,
    PRIMARY KEY (userID, friendID),
    FOREIGN KEY (userID) REFERENCES user(ID),
    FOREIGN KEY (friendID) REFERENCES user(ID)
);

CREATE TABLE language(
    languageID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    languageSelect VARCHAR(50) UNIQUE,
    FOREIGN KEY (languageSelect) REFERENCES user(selectedLanguage)
);

CREATE TABLE breed(
    breedID INT NOT NULL PRIMARY KEY, 
    breedName VARCHAR(100)
);

