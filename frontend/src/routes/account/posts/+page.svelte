<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Posts and Pet Posts</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
  }
  .container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    text-align: center;
    color: #333;
  }
  .post-container {
    margin-bottom: 20px;
  }
  .post {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 10px;
  }
</style>
</head>
<body>
<div class="container">
  <h1>My Posts</h1>
  <div id="userPosts" class="post-container">
   
  </div>
  <button onclick="addUserPost()">Add New Post</button>

  <h1>Pet Posts</h1>
  <div id="petPosts" class="post-container">
   
  </div>
  <button onclick="addPetPost()">Add New Pet Post</button>
</div>

<script>
  let userPosts = [];
  let petPosts = [];

  function displayUserPosts() {
    const userPostsDiv = document.getElementById('userPosts');
    userPostsDiv.innerHTML = '';
    userPosts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = "User Post Image";
      postDiv.appendChild(img);
      const text = document.createElement('p');
      text.textContent = post.text;
      postDiv.appendChild(text);
      userPostsDiv.appendChild(postDiv);
    });
  }

  function displayPetPosts() {
    const petPostsDiv = document.getElementById('petPosts');
    petPostsDiv.innerHTML = '';
    petPosts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = "Pet Post Image";
      postDiv.appendChild(img);
      const text = document.createElement('p');
      text.textContent = post.text;
      postDiv.appendChild(text);
      petPostsDiv.appendChild(postDiv);
    });
  }

  function addUserPost() {
    const text = prompt('Enter your post text:');
    const image = prompt('Enter image URL for your post:');
    if (text && image) {
      userPosts.push({ text: text, image: image });
      displayUserPosts();
    }
  }

  function addPetPost() {
    const text = prompt('Enter pet post text:');
    const image = prompt('Enter image URL for pet post:');
    if (text && image) {
      petPosts.push({ text: text, image: image });
      displayPetPosts();
    }
  }

  displayUserPosts();
  displayPetPosts();
</script>
</body>
</html>

