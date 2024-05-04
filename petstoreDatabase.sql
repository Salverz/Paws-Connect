USE j59qb6u7tk71ja7u;


DROP TABLE IF EXISTS pet_profile;
DROP TABLE IF EXISTS connection;

DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS post_photo;
DROP TABLE IF EXISTS tagged_pet;
DROP TABLE IF EXISTS tagged_friend;
DROP TABLE IF EXISTS post_like;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS language;

-- Unused tables
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS pet_type;
DROP TABLE IF EXISTS transfer_pet_log;

CREATE TABLE language (
    language_code VARCHAR(16) UNIQUE NOT NULL PRIMARY KEY,
    language VARCHAR(64) UNIQUE NOT NULL
    
);

CREATE TABLE user_account (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(128) NOT NULL,
	is_admin BOOLEAN NOT NULL
);

CREATE TABLE user_profile (
    user_id INT,
    birth_date DATE,
    display_name VARCHAR(32),
    profile_picture VARCHAR(512),
    zip VARCHAR(10),
    preferred_language VARCHAR(64),
    FOREIGN KEY (user_id) REFERENCES user_account(user_id),
	FOREIGN KEY (preferred_language) REFERENCES language(language)
);

CREATE TABLE pet_profile (
    pet_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    owner_user_id INT,
    name VARCHAR(64) NOT NULL,
    profile_picture VARCHAR(256),
    species VARCHAR(128),
    breed VARCHAR(64),
    color VARCHAR(16),
	birth_date DATE,
    FOREIGN KEY (owner_user_id) REFERENCES user_account(user_id)
);

CREATE TABLE connection (
    user_1_id INT NOT NULL,
    user_2_id INT NOT NULL,
    PRIMARY KEY (user_1_id, user_2_id),
    FOREIGN KEY (user_1_id) REFERENCES user_account(user_id),
    FOREIGN KEY (user_2_id) REFERENCES user_account(user_id)
);

CREATE TABLE connection_request (
	sender_user_id INT NOT NULL,
    receiver_user_id INT NOT NULL,
    UNIQUE (sender_user_id, receiver_user_id),
    FOREIGN KEY (sender_user_id) REFERENCES user_account(user_id),
    FOREIGN KEY (receiver_user_id) REFERENCES user_account(user_id)
);

CREATE TABLE post (
    post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    poster_user_id INT NOT NULL,
    text_content VARCHAR(512),
    visibility ENUM('private', 'public', 'friend') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_language VARCHAR(64),
    FOREIGN KEY (poster_user_id) REFERENCES user_account(user_id),
    FOREIGN KEY (post_language) REFERENCES language(language)
);

CREATE TABLE post_photo (
    photo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    attached_to_post_id INT NOT NULL,
    photo_link VARCHAR(256) NOT NULL,
    FOREIGN KEY (attached_to_post_id) REFERENCES post(post_id)
);

CREATE TABLE tagged_pet (
    tagged_post_id INT NOT NULL,
    tagged_pet_id INT NOT NULL,
    PRIMARY KEY (tagged_post_id, tagged_pet_id),
    FOREIGN KEY (tagged_post_id) REFERENCES post(post_id),
    FOREIGN KEY (tagged_pet_id) REFERENCES pet_profile(pet_id)
);

CREATE TABLE tagged_friend (
    tagged_post_id INT NOT NULL,
    tagged_friend_user_id INT NOT NULL,
    PRIMARY KEY (tagged_post_id, tagged_friend_user_id),
    FOREIGN KEY (tagged_post_id) REFERENCES post(post_id),
    FOREIGN KEY (tagged_friend_user_id) REFERENCES user_account(user_id)
);

CREATE TABLE post_like (
    like_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    liked_post_id INT NOT NULL, 
    liker_user_id INT NOT NULL,
    FOREIGN KEY (liked_post_id) REFERENCES post(post_id),
    FOREIGN KEY (liker_user_id) REFERENCES user_account(user_id)
);

CREATE TABLE comment (
    comment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    commented_post_id INT NOT NULL,
    commenter_user_id INT NOT NULL,
    comment_text VARCHAR(256),
    comment_creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commented_post_id) REFERENCES post(post_id),
    FOREIGN KEY (commenter_user_id) REFERENCES user_account(user_id)
);

CREATE TABLE transfer_pet(
    pet_id INT,
    previous_owner INT,
    new_owner INT,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (previous_owner) REFERENCES user_account(user_id),
    FOREIGN KEY (new_owner) REFERENCES user_account(user_id)
); 

CREATE TABLE location_lat_long(
    user_id INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

-- Unused tables
/* CREATE TABLE activity_log (
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

*/

