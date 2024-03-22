<script>
<<<<<<< HEAD:frontend/src/routes/user/profile/[username]/+page.svelte
    import { page } from "$app/stores";
	import { onMount } from "svelte";
  let name = "Brownei";
  let profile_picture = "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*";
  let bio = "A pet who enjoys spending";
  let location, preferred_language;
=======
  let name = "Antonio";
  let profile_picture = "https://media.licdn.com/dms/image/C5603AQGXFbcWFMDlGA/profile-displayphoto-shrink_800_800/0/1588655970246?e=2147483647&v=beta&t=MnAPiEcWIr3dfNhJWOoxGfhUgtBEqdXE6w9_LohS0Wo";
  let bio = "I love nature";
  let pronouns = "He/Him";
  let location = "USA, California"
>>>>>>> 9b68daabe040beb9da4df9082217865f9c9070ab:frontend/src/routes/user/profile/+page.svelte

  let friends = 520;
  let posts = 121;
  let connections = [
      { name: "Rahul", profile_picture: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
      { name: "David", profile_picture: "https://i.pinimg.com/236x/39/f8/f1/39f8f15525a9d4727728aa214bae0ddf.jpg" },
      { name: "Kim", profile_picture: "https://variety.com/wp-content/uploads/2024/01/Kim-Kardashian.jpg" },
      { name: "Jeff", profile_picture: "https://media.gettyimages.com/id/143071480/photo/student-standing-on-steps-outdoors.jpg?s=612x612&w=gi&k=20&c=UbOAUe8a6nWfpfMbej3a7J8awOhBdVnNSc65rXmfV7A=" },
      { name: "Chase", profile_picture: "https://pics.craiyon.com/2023-07-07/7fc64a9b0eb141689af167796b348537.webp" },
  ];

  let showConnections = false;

  function toggleConnections() {
      showConnections = !showConnections;
  }
  let similarProfiles = [
      { name: "Isabella", profile_picture: "https://m.media-amazon.com/images/M/MV5BZDQxNGNmZDctODI3ZC00ZDNjLWE2YjctZjhhOTkzMmM1MGM1XkEyXkFqcGdeQXVyMzQ2Njc1OTY@._V1_.jpg" },
      { name: "Mike", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiyAi_e7nPeAB-jWMUT0-YsBEUhZUBcAGqxg&usqp=CAU" },
      { name: "Jack", profile_picture: "https://images.mubicdn.net/images/cast_member/24202/cache-207702-1489464067/image-w856.jpg?size=800x" },
      { name: "Noah", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkC9a9mZGJvcvFlXXR9VutCVx4TJGeVHuh4A&usqp=CAU" }
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
<<<<<<< HEAD:frontend/src/routes/user/profile/[username]/+page.svelte
              <!-- <p>Follows: {follows}</p> -->
              <!-- <p>Followers: {followers}</p> -->
              <p>Location: {location}</p>
              <p>Connections: {connections.length}</p>
              <p>Preferred language: {preferred_language}</p>
=======
              <p>Friends: {friends}</p>
              <p>Posts: {posts}</p>
              <p>Connections: {connections.length}</p>
              <p>Pronouns: {pronouns}</p>
              <p>Geo Location: {location}</p>
>>>>>>> 9b68daabe040beb9da4df9082217865f9c9070ab:frontend/src/routes/user/profile/+page.svelte
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


