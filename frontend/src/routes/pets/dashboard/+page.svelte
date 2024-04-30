<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";

	let userId;

	async function getPets() {
		console.log("calling user: " + userId);
		const response = await fetch(`http://localhost:3000/pet/pets/${req.session.userId}`);
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

	async function transferPet(petIndex) {
		if (pets[petIndex].transferTo == undefined) {
			alert("Please enter a recipient to transfer the pet to");
			return;
		}

		console.log(pets[petIndex].transferTo);
		const response = await fetch(`http://localhost:3000/pet/createTransferRequest`, {
			method: "POST",
			body: JSON.stringify({
				"petId": pets[petIndex].id,
				"newOwnerUsername": pets[petIndex].transferTo
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (!json.requestCreated) {
			alert(`Failed to create a transfer request. ${json.response}`);
			return;
		}

		alert(`Transfer request created successfully! When the recipient accepts it, ${pets[petIndex].name} will be transfered.`);
		pets[petIndex].transfer = false;
		pets[petIndex].new_owner = pets[petIndex].transferTo;
	}

	async function respondToTransfer(petIndex, doTransfer) {
		const response = await fetch(`http://localhost:3000/pet/transfer`, {
			method: "PUT",
			body: JSON.stringify({
				"petId": pets[petIndex].id,
				"newOwnerId": userId,
				"doTransfer": doTransfer
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));

		if (!json.success) {
			alert(`Transfer failed. ${json.message}`);
			return;
		}

		if (doTransfer) {
			alert(`Transfer successfull! ${pets[petIndex].name} is now your pet!`);
			pets[petIndex].new_owner = null;
		} else {
			alert(`Transfer closed. ${pets[petIndex].name} was not transfered.`);
			pets.splice(petIndex, 1);
			pets = pets;
		}
		console.log(JSON.stringify(pets));
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
			<a href="/pets/profile/{pet.id}">Profile</a>
			{#if pet.new_owner == userId}
				<button on:click={() => { respondToTransfer(index, true) }}>Accept Transfer</button>
				<button on:click={() => { respondToTransfer(index, false) }}>Refuse Transfer</button>
			{:else}
				<a href="/pets/edit/{pet.id}">Edit</a>
				<button on:click={() => { deletePet(index) }}>Delete</button>
				<button on:click={() => { pets[index].transfer = !pets[index].transfer; }}>Transfer Pet</button>
			{/if}

			{#if pet.new_owner}
				<p>Pending transfer</p>
			{:else if pet.transfer}
				<label for="newOwnerUsername">Who would you like to transfer {pet.name} to? </label>
				<input type="text" id="newOwnerUsername" name="newOwnerUsername" bind:value={pets[index].transferTo}>
				<button on:click={() => { transferPet(index) }}>Send Request</button>
			{/if}
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
