<script>
    import { page } from "$app/stores";
	import { onMount } from "svelte";
  let name = "Brownei";
  let profile_picture = "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*";
  let bio = "A pet who enjoys spending";
  let location, preferred_language;

  let follows = 520;
  let followers = 1234;
  let connections = [
      { name: "John", profile_picture: "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg" },
      { name: "Ty", profile_picture: "https://static.vecteezy.com/system/resources/thumbnails/023/595/164/small/rabbit-in-the-forest-at-sunset-animal-in-nature-easter-bunny-wildlife-scene-generative-ai-photo.jpg" },
      { name: "Mike", profile_picture: "https://people.com/thmb/f96tuDus6iHbftSvPZjYpMAsTCk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(777x504:779x506)/petting-dog-080323-1-b4440cd8468c4242b3a707dbcb415120.jpg" },
      { name: "Rohn", profile_picture: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?cs=srgb&dl=pexels-pixabay-416160.jpg&fm=jpg" },
      { name: "Rahui", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi4m4tcRb66quRUIsggE-2ZU8zi5LlAT960Q&usqp=CAU" },
      { name: "David", profile_picture: "https://d2zp5xs5cp8zlg.cloudfront.net/image-62867-800.jpg" },
      { name: "Kim", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6jsN-2AKB5AOLIuR8X1myKe5pdN0XPA715g&usqp=CAU" },
      { name: "Jeff", profile_picture: "https://www.worldatlas.com/r/w1200/upload/4a/08/fb/shutterstock-716133220.jpg" },
      { name: "Chase", profile_picture: "https://hips.hearstapps.com/hmg-prod/images/how-to-keep-ducks-call-ducks-1615457181.jpg?resize=2048:*" },
  ];

  let showConnections = false;

  function toggleConnections() {
      showConnections = !showConnections;
  }
  let similarProfiles = [
      { name: "Isabella", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxmPbZp25Cr3qjPxZI4Sgmq1Kk3XzgD9AWnQ&usqp=CAU" },
      { name: "Mike", profile_picture: "https://i.pinimg.com/474x/44/55/ce/4455ce9fb7a611e621ce6106f3e2b191.jpg" },
      { name: "Ramen", profile_picture: "https://www.thesprucepets.com/thmb/y4YEErOurgco9QQO-zJ6Ld1yVkQ=/3000x0/filters:no_upscale():strip_icc()/english-dog-breeds-4788340-hero-14a64cf053ca40f78e5bd078b052d97f.jpg" },
      { name: "Cookie", profile_picture: "https://media.istockphoto.com/id/1361394182/photo/funny-british-shorthair-cat-portrait-looking-shocked-or-surprised.jpg?s=612x612&w=0&k=20&c=6yvVxdufrNvkmc50nCLCd8OFGhoJd6vPTNotl90L-vo=" }
  ];

  let showSimilarProfiles = false;

  function toggleSimilarProfiles() {
      showSimilarProfiles = !showSimilarProfiles;
  }

  name = $page.params.username;
  console.log(name);

  async function getProfileData() {
    console.log("running");
    let data = await fetch(`http://localhost:3000/account/profile/${name}`);
    let json = await data.json();
    console.log(json);
    name = json[0].display_name;
    profile_picture = json[0].profile_picture;
    location = json[0].location;
    preferred_language = json[0].preferred_language;
  }


//   getProfileData();
  onMount(async () => {
    await getProfileData();
  });

</script>

<style>
  body {
      font-family: Arial, sans-serif;
      background-color: #fafafa;
      margin: 0;
      padding: 0;
  }

  .container {
      max-width: 400px;
      margin: 20px;
      padding: 20px;
      background-color: rgba(194, 237, 156, 0.941);
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
  }

  .profile-header {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
  }

  .profile-picture {
      border: 3px solid #000;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      margin-right: 20px;
      object-fit: cover;
      transform: translateY(-5%);
  }

  .profile-info {
      flex: 1;
  }

  h1 {
      font-size: 32px;
      margin: 0;
      font-weight: bold;
  }

  .bio {
      font-size: 16px;
      margin: 0;
  }

  .stats {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
  }

  .stats p {
      margin: 5px 0;
  }

  .action-buttons {
      display: flex;
      justify-content: center;
      margin-top: 20px;
  }

  .action-button {
      background-color: #ccc; 
      color: black;
      padding: 10px 20px;
      border: 2px solid #000; 
      border-radius: 5px;
      margin: 0 10px;
      cursor: pointer;
  }

  .action-button:hover {
      background-color: #999; /* Darker Grey */
  }

  .action-button:focus {
      outline: none;
  }

  .connection-list {
      position: absolute;
      background-color: #fff;
      border: 1px solid #000;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 1;
      margin-top: 220px;
      width: 100%;
      left: 0;
  }

  .connection {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
  }

  .connection img {
      border-radius: 50%;
      margin-right: 10px;
      width: 30px;
      height: 30px;
      object-fit: cover;
  }

  .similar-profiles-button {
      margin-left: auto;
  }

  .profile-list{
      position: absolute;
      background-color: #fff;
      border: 1px solid #000;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 1;
      margin-top: 220px;
      width: 100%;
      left: 0;
  }

  .profile {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
  }

  .profile img {
      border-radius: 50%;
      margin-right: 10px;
      width: 30px;
      height: 30px;
      object-fit: cover;
  }


</style>

<div class="container">
  <div class="profile-header">
      <img class="profile-picture" src="{profile_picture}" alt="Profile Picture">
      <div class="profile-info">
        <h1>{name}</h1>
          <div class="stats">
              <!-- <p>Follows: {follows}</p> -->
              <!-- <p>Followers: {followers}</p> -->
              <p>Location: {location}</p>
              <p>Connections: {connections.length}</p>
              <p>Preferred language: {preferred_language}</p>
          </div>
      </div>
  </div>
  <div class="action-buttons">
      <button class="action-button" on:click={toggleConnections}>Connections</button>
      <button class="action-button similar-profiles-button" on:click={toggleSimilarProfiles}>Similar Profiles</button>
  </div>
  {#if showConnections}
  <div class="connection-list">
      {#each connections as connection}
      <div class="connection">
          <img src="{connection.profile_picture}" alt="{connection.name}'s Profile Picture">
          <span>{connection.name}</span>
      </div>
      {/each}
  </div>
  {/if}
  {#if showSimilarProfiles}
  <div class="profile-list">
      {#each similarProfiles as profile}
      <div class="profile">
          <img src="{profile.profile_picture}" alt="{profile.name}'s Profile Picture">
          <span>{profile.name}</span>
      </div>
      {/each}
  </div>
  {/if}
</div>


