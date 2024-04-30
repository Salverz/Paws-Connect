<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let name = "Jake";
    let profile_picture = "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*";
    let bio = "A pet who enjoys spending";
    let location, preferred_language;

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

    name = "Jake";

    async function getProfileData() {
        let data = await fetch(`http://localhost:3000/account/profile/${name}`);
        let json = await data.json();
        name = json[0].display_name;
        profile_picture = json[0].profile_picture;
        location = json[0].location;
        preferred_language = json[0].preferred_language;
    }

    onMount(async () => {
        await getProfileData();
    });
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4; /* Light Grey */
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 400px;
        margin: 20px;
        padding: 20px;
        background-color: #e6e6fa; /* Lavender */
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: row; /* Changed to row */
        align-items: flex-start; /* Changed to flex-start */
        border: 3px solid #000;
    }

    .logo {
        border: 3px solid #000;
        border-radius:50%;
        width: 100px;
        height: 100px;
        margin-right: 20px; /* Added margin-right */
        object-fit: cover;
        margin-left: 10px;
    }

    h1 {
        font-size: 30px;
        margin: 20px;
        font-weight: bold;
        margin-top: 110px;
        margin-left: -98px;
   
    }

    .bio {
        font-size: 16px;
        margin: 5;
        margin-top: -10px;
        margin-left: -98px;
    }

    .action-buttons {
        display: flex;
        flex-direction: column; /* Changed to column */
        justify-content: flex-start; /* Changed to flex-start */
        margin-top: 5px;
        margin-left: 30px;
        margin-right: 20px;
    }

    .action-button {
        background-color: #7b68ee; /* Dark Lavender */
        color: #fff; /* White Text */
        padding: 10px 20px;
        border: 2px solid #000; /* Added border */
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease; /* Smooth Transition */
        margin-bottom: 10px; /* Added margin-bottom */
    }

    .action-button:hover {
        background-color: #6a5acd; /* Darker Lavender */
    }

    .connection-list {
        position: absolute;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        padding: 10px;
        z-index: 1;
        width: 100%;
        left: 0;
        top: 150px; /* Position below the profile header */
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
</style>

<div class="container">
    <img class="logo" src="{profile_picture}" alt="Profile Picture">
    <div>
        <h1>{name}</h1>
        <p class="bio">{bio}</p>
    </div>
    <div class="action-buttons">
        <button class="action-button" on:click={toggleConnections}>Connections</button>
        <button class="action-button" on:click={toggleSimilarProfiles}>Similar Profiles</button>
        <button class="action-button">Edit Profile</button> <!-- Edit Profile Button -->
        <button class="action-button">Add Connection</button> <!-- Add Connection Button -->
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
    <div class="connection-list">
        {#each similarProfiles as profile}
        <div class="connection">
            <img src="{profile.profile_picture}" alt="{profile.name}'s Profile Picture">
            <span>{profile.name}</span>
        </div>
        {/each}
    </div>
    {/if}
</div>
