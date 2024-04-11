<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";

	let userId;

	async function getPets() {
		console.log("calling user: " + userId);
		const response = await fetch(`http://localhost:3000/pet/pets/${userId}`);
		pets = await response.json();
	}

let pets = [
	{
		id: 1,
		name: "Buster",
		profile_picture: "https://www.akc.org/wp-content/uploads/2017/11/Manchester-Terrier-Standard-on-White-08.jpg",
		species: "dog",
		breed: "Manchester Terrier",
		color: "black",
		birth_date: "2014-12-04"
	},
	{
		id: 4,
		name: "Max",
		profile_picture: "https://dogtime.com/wp-content/uploads/sites/12/2023/11/GettyImages-1454565264-e1701120522406.jpg",
		species: "dog",
		breed: "Siberian Husky",
		color: "black and white",
		birth_date: "2019-03-12"
	},
	{
		id: 11,
		name: "Shelby",
		profile_picture: "https://13630656.rocketcdn.me/wp-content/uploads/2020/01/Golden4.jpg.webp",
		species: "dog",
		breed: "Golden Retriever",
		color: "black",
		birth_date: "2012-10-01"
	}
];

function deletePet(petName) {
	confirm(`Are you sure you want to delete ${petName}?`);
}
</script>

<SiteHeader/>
<NavBar/>
<label for="userId">Enter your user ID: </label>
<input type="text" id="userId" bind:value={userId}>
<button on:click={getPets}>View your pets</button>
<div class="pet-list">
<h2>Your pets</h2>
<a href="/pets/add">Add a new pet</a>
	{#each pets as pet}
		<div class="pet-entry">
			<input type="hidden" value={pet.id}/>
			<img class="profile-picture" src={pet.profile_picture}>
			{pet.name}
			<button>Edit</button>
			<button on:click={() => { deletePet(pet.name) }}>Delete</button>
		</div>
	{/each}
</div>

<style>
	.pet-list {
		/* Flexbox */
		display: flex;
		flex-direction:column;

		margin: 0px 50px;
		font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.pet-entry {
		/* Flexbox */
		display: flex;
		align-items: center;
		gap: 20px;

		background-color: lightgray;
		padding: 20px;
		outline-width: 1px;
		outline-style: solid;
	}

	.profile-picture {
		max-height: 100px;
		max-width: 100px;
	}
</style>
