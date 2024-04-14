<script>
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import NavBar from "$lib/components/NavBar.svelte";

    let petId = $page.params.petId;
    console.log(petId);

    // let petId;
    let owner;
    let petName//name
    let profilePicture;
    let species;
    let breed;
    let color;
    let birthDate;

    async function getPetData() {
        console.log("running");
        let data = await fetch(`http://localhost:3000/pet/profile/${petId}`);
        let json = await data.json();
        console.log(json);
        owner = json.owner;
        petName = json.name;
        profilePicture = json.profilePicture;
        species = json.species;
        breed = json.breed;
        color = json.color;
        birthDate = json.birthDate;
    }

    onMount(async () => {
        await getPetData();
    });
</script>

<NavBar/>
<div class="pet-container">
    <h1>{petName}</h1>
    <img src = {profilePicture}>
	<p>Owner: {owner}</p>
    <p>Species: {species}</p>
    <p>Breed: {breed}</p>
    <p>Color: {color}</p>
    <p>Birth Date: {birthDate}</p>

</div>

<style>
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

	img {
		width: 500px;
	}
</style>
