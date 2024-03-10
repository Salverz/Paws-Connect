SET REFERENTIAL_INTEGRITY FALSE;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS pet_profile;
DROP TABLE IF EXISTS connection;
DROP TABLE IF EXISTS language;
SET REFERENTIAL_INTEGRITY TRUE;


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

CREATE TABLE posts(
    psotID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    content VARCHAR(1000),
    visibility VARCHAR(50),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userID) REFERENCES user(user_id)
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
    FOREIGN KEY (userID) REFERENCES userProfile(user_id)
);


CREATE TABLE notifications(
    notificationID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    type VARCHAR(100),
    message VARCHAR(500),
    isRead BOOLEAN DEFAULT FALSE,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES userProfile(user_id)
);


CREATE TABLE search_history(
    searchID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    searchQuery VARCHAR(250),
    searchDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES userProfile(user_id)
);


CREATE TABLE likes(
    likeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL, 
    userID INT NOT NULL, 
    likeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES posts(postID),
    FOREIGN KEY (userID) REFERENCES userProfile(user_id)
);


CREATE TABLE comments(
    commentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    userID INT NOT NULL,
    commentText VARCHAR(500),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES posts(postID),
    FOREIGN KEY (userID) REFERENCES userProfile(user_id)
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
    FOREIGN KEY (senderID) REFERENCES userProfile(user_id),
    FOREIGN KEY (recieverID) REFERENCES userProfile(user_id)
);