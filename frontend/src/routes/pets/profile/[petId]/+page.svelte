<script>
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";

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
	let ownerUserId;
	let ownerProfilePicture;

    async function getPetData() {
        console.log("running");
        let data = await fetch(`http://localhost:3000/pet/profile/${petId}`);
        let json = await data.json();
        console.log(json);
        owner = json.owner;
        petName = json.name;
        profilePicture = json.profilePicture;
        species = json.species;
		bio = json.bio;
        breed = json.breed;
        color = json.color;
        birthDate = json.birthDate;
		ownerUserId = json.userId;
		ownerProfilePicture = json.ownerProfilePicture;
    }

    onMount(async () => {
        await getPetData();
    });
</script>

<SiteHeader/>
<NavBar/>
<div class="pet-container">
	<div class="header-section">
		<img src = {profilePicture}>
		<div class="pet-info">
			<h1>{petName}</h1>
			<a rel="external" href="/user/profile/{ownerUserId}">
				<div class="owner-section">
					<img class="owner-profile-picture" src="{ownerProfilePicture}">
					<p class="owner-text">{owner}</p>
				</div>
			</a>
		</div>
	</div>
	<!--
	<p>Owner: {owner}</p>
    <p>Species {species}</p>
    <p>Breed: {breed}</p>
    <p>Color: {color}</p>
    <p>Birth Date: {birthDate}</p>
	<p>Bio: {bio}</p>
	-->
</div>

<style>
	.header-section {
		display: flex;
	}

	.owner-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 10px;
	}

	a {
		text-decoration: none;
	}

	.owner-section:hover {
		background-color: gray;
	}

	.owner-profile-picture {
		width: 30px;
		height: 30px;
		object-fit: cover;
	}

    .pet-container {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		width: 500px;
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
		border: 3px solid #000;
		border-radius: 50%;
		width: 120px;
		height: 120px;
		margin-right: 20px;
		object-fit: cover;
	}
</style>
