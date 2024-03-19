SET REFERENTIAL_INTEGRITY FALSE;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS tagged_friends;
DROP TABLE IF EXISTS tagged_pets;
DROP TABLE IF EXISTS post_photo;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS pet_profile;
DROP TABLE IF EXISTS connection;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS language;
SET REFERENTIAL_INTEGRITY TRUE;

CREATE TABLE user_profile (
    user_id INT,
    birth_date DATE,
    display_name VARCHAR(32),
    location VARCHAR(32),
    preferred_language_code CHAR(4),
    FOREIGN KEY (user_id) REFERENCES account(user_id),
	FOREIGN KEY (preferred_language_code) REFERENCES language(language_code)
);

CREATE TABLE user_account (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(256) NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES user_account(user_id),
);

CREATE TABLE connection (
    user_1_id INT NOT NULL,
    user_2_id INT NOT NULL,
    PRIMARY KEY (user_1_id, user_2_id),
    FOREIGN KEY (user_1_id) REFERENCES user_account(user_id),
    FOREIGN KEY (user_2) REFERENCES user_account(user_id)
);

CREATE TABLE language (
    language_code CHAR(4) UNIQUE NOT NULL PRIMARY KEY,
    language VARCHAR(64) UNIQUE
);

CREATE TABLE post (
    post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(1000),
    visibility ENUM('private', 'public', 'friend') NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_language_code CHAR(4),
    FOREIGN KEY (user_id) REFERENCES user_account(user_id),
    FOREIGN KEY (post_language_code) REFERENCES language(language_code)
);

CREATE TABLE post_photo (
    photo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    photo_link VARCHAR(256) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

CREATE TABLE tagged_pet (
    post_id INT NOT NULL,
    pet_id INT NOT NULL,
    PRIMARY KEY (post_id, pet_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (pet_id) REFERENCES pet_profile(pet_id)
);

CREATE TABLE tagged_friend (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

CREATE TABLE activity_log (
    log_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    activity_type VARCHAR(100),
    description VARCHAR(500),
    activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE notification (
    notification_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(100),
    message VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE search_history (
    search_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    searchQuery VARCHAR(250),
    searchDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE post_like (
    like_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL, 
    user_id INT NOT NULL, 
    likeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE comment (
    comment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    commentText VARCHAR(500),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

CREATE TABLE pet_type (
    type_of_pets_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100)
);

CREATE TABLE transfer_pet_log (
    pet_id INT,
    user_id_1 INT,
    user_id_2 INT,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES user_account(user_id),
    FOREIGN KEY (user_id_2) REFERENCES user_account(user_id)
);
