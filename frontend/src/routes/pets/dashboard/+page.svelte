<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";

	let userId;

	async function getPets() {
		console.log("calling user: " + userId);
		const response = await fetch(`http://localhost:3000/pet/pets/${userId}`);
		pets = await response.json();
	}

	let pets = [];

	async function deletePet(petIndex) {
		const deletePet = confirm(`Are you sure you want to delete ${pets[petIndex].name}?`);
		if (!deletePet) {
			return;
		}

		const response = await fetch(`http://localhost:3000/pet/remove`, {
			method: "DELETE",
			body: JSON.stringify({
				"petId": pets[petIndex].id
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (json.deleted) {
			alert(`Deleted ${pets[petIndex].name}`);
			getPets();
		}
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
	{#each pets as pet, index}
		<div class="pet-entry">
			<input type="hidden" value={index}/>
			<img class="profile-picture" src={pet.profile_picture}>
			{pet.name}
			<a href="/pets/edit/{pet.id}">Edit</a>
			<button on:click={() => { deletePet(index) }}>Delete</button>
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
