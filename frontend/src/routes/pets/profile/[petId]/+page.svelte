<script>
	import NavBar from "$lib/components/NavBar.svelte";
    import { page } from "$app/stores";
	import { onMount } from "svelte";

    let petId = $page.params.petId;
    console.log(petId);

    // let petId;
    let owner;
    let petName//name
    let profilePicture;
    let species;
    let breed;
    let color;
	let bio;
    let birthDate;

    async function getPetData() {
        console.log("running");
        let data = await fetch(`http://localhost:3000/pet/profile/${petId}`);
        let json = await data.json();
        console.log(json);
        //owner = json.owner_user_id;
        petName = json.name;
        profilePicture = json.profilePicture;
        species = json.species;
		bio = json.bio;
        breed = json.breed;
        color = json.color;
        birthDate = json.birthDate;
    }

    onMount(async () => {
        await getPetData();
    });


    // let name = "Max";
    // let gender = "Male";
    // let bio = "A friendly and playful pet.";
    // let location = "New York";
    
    let connections = [
        { name: "Buddy", gender: "Male" },
        { name: "Daisy", gender: "Female" },
        { name: "Rocky", gender: "Male" }
    ];
    
    let suggestedProfiles = [
        { name: "Lucy", gender: "Female" },
        { name: "Charlie", gender: "Male" },
        { name: "Bella", gender: "Female" }
    ];
    
    let showConnections = false;
    let showSuggestedProfiles = false;
    
    function toggleConnections() {
        showConnections = !showConnections;
    }
    
    function toggleSuggestedProfiles() {
        showSuggestedProfiles = !showSuggestedProfiles;
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #fafafa;
        margin: 0;
        padding: 0;
    }

    .pet-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #87CEEB; /* Blue background color */
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .dropdown-list {
        position: absolute;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        padding: 10px;
        z-index: 1;
        width: 100%;
        left: 0;
    }

    .dropdown-item {
        margin-bottom: 5px;
    }

    .action-buttons {
        display: flex;
        justify-content: space-around;
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

	img {
		width: 500px;
	}
</style>

<NavBar/>
<div class="pet-container">
    <h1>{petName}</h1>
    <img src = {profilePicture}>
	<p>Pet ID: {petId}</p>
    <p>Species: {species}</p>
    <p>Breed: {breed}</p>
    <p>Color: {color}</p>
    <p>Birth Date: {birthDate}</p>
	<p>Bio: {bio}</p>
    <!-- <p>Owner: {owner}</p> -->

    <div class="action-buttons">
        <button class="action-button" on:click={toggleConnections}>Connections</button>
        {#if showConnections}
        <div class="dropdown-list">
            {#each connections as connection}
            <div class="dropdown-item">
                <p>{connection.name}</p>
                <p>Gender: {connection.gender}</p>
            </div>
            {/each}
        </div>
        {/if}

        <button class="action-button" on:click={toggleSuggestedProfiles}>Suggested Profiles</button>
        {#if showSuggestedProfiles}
        <div class="dropdown-list">
            {#each suggestedProfiles as profile}
            <div class="dropdown-item">
                <p>{profile.name}</p>
                <p>Gender: {profile.gender}</p>
            </div>
            {/each}
        </div>
        {/if}
    </div>
</div>
