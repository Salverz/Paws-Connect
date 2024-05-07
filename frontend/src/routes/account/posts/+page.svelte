<title>My Posts and Pet Posts</title>

<script>
  let userPosts = [];
  let petPosts = [];

  function displayUserPosts() {
    const userPostsDiv = document.getElementById('userPosts');
    userpostsdiv.innerhtml = '';
    userposts.foreach(post => {
      const postdiv = document.createelement('div');
      postdiv.classlist.add('post');
      const img = document.createelement('img');
      img.src = post.image;
      img.alt = "user post image";
      postdiv.appendchild(img);
      const text = document.createelement('p');
      text.textcontent = post.text;
      postdiv.appendchild(text);
      userpostsdiv.appendchild(postdiv);
    });
  }

  function displaypetposts() {
    const petpostsdiv = document.getelementbyid('petposts');
    petpostsdiv.innerhtml = '';
    petposts.foreach(post => {
      const postdiv = document.createelement('div');
      postdiv.classlist.add('post');
      const img = document.createelement('img');
      img.src = post.image;
      img.alt = "pet post image";
      postdiv.appendchild(img);
      const text = document.createelement('p');
      text.textcontent = post.text;
      postdiv.appendchild(text);
      petpostsdiv.appendchild(postdiv);
    });
  }

  function adduserpost() {
    const text = prompt('enter your post text:');
    const image = prompt('enter image url for your post:');
    if (text && image) {
      userposts.push({ text: text, image: image });
      displayuserposts();
    }
  }

  function addpetpost() {
    const text = prompt('enter pet post text:');
    const image = prompt('enter image url for pet post:');
    if (text && image) {
      petposts.push({ text: text, image: image });
      displaypetposts();
    }
  }

  displayuserposts();
  displaypetposts();
</script>

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

