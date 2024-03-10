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

CREATE TABLE posts(
    psotID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    content VARCHAR(1000),
    visibility VARCHAR(50),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userID) REFERENCES user(ID)
);


CREATE TABLE pet_posts(
    petID INT NOT NULL,
    postID INT NOT NULL,
    PRIMARY KEY (petID, postID),
    FOREIGN KEY (petID) REFERENCES petsProfile(petsID),
    FOREIGN KEY (postID) REFERENCES posts(postID)
);


CREATE TABLE settings(
   privateOrPublic BOOLEAN,
);


CREATE TABLE activity_logs(
    logID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL, 
    activityType VARCHAR(100),
    description VARCHAR(500),
    activityDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES userProfile(ID)
);


CREATE TABLE notifications(
    notificationID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    type VARCHAR(100),
    message VARCHAR(500),
    isRead BOOLEAN DEFAULT FALSE,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES userProfile(ID)
);


CREATE TABLE search_history(
    searchID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    searchQuery VARCHAR(250),
    searchDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES userProfile(ID)
);


CREATE TABLE likes(
    likeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL, 
    userID INT NOT NULL, 
    likeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES posts(postID),
    FOREIGN KEY (userID) REFERENCES userProfile(ID)
);


CREATE TABLE comments(
    commentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    userID INT NOT NULL,
    commentText VARCHAR(500),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES posts(postID),
    FOREIGN KEY (userID) REFERENCES userProfile(ID)
);

CREATE TABLE pet_types(
    typesOfPetsID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100)
);
CREATE TABLE messages(
    messageID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    senderID INT NOT NULL,
    recieverID INT NOT NULL,
    messageText TEXT,
    sentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES userProfile(ID),
    FOREIGN KEY (recieverID) REFERENCES userProfile(ID)
);