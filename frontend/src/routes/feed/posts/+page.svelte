<script>
	import { onMount } from "svelte";
	import NavBar from "$lib/components/NavBar.svelte";
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"

	let token;

	onMount(async () => {
		token = await checkAuthenticated();
		await getUserPets();
	});

    let userId, postPicture, textContent, visibility, language;

	async function getUserPets() {
		const response = await fetch(`http://localhost:3000/pet/pets/`,
			{ headers: { 'Authorization': `Bearer ${token}` }});
		const json = await response.json();
		console.log(json);
		connections = [];
		json.forEach(pet => {
			connections.push({
				"id": pet.id,
				"name": pet.name,
				"profile_picture": pet.profile_picture
			});
		});

		console.log(connections);

		selectedConnections = [];
	}

    let connections = [];
    let selectedConnections = [];

    function handleCheckboxChange(event, connectionId) {
        if (event.target.checked) {
            selectedConnections.push(connectionId);
        } else {
            selectedConnections = selectedConnections.filter(id => id !== connectionId);
        }
		console.log(selectedConnections);
    }

	async function createPost() {
		const databaseResult = await fetch(`http://localhost:3000/post/create`, {
			method: "POST",
			body: JSON.stringify({
				"petsToTag": selectedConnections,
				"text_content": textContent,
				"post_photo_link": postPicture,
				"visibility": visibility,
				"post_language": language
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${token}` 
			}
		});

		const json = await databaseResult.json();

		console.log(json);
		if (json.profileCreated) {
			alert("Profile created successfully!");
		} else {
			alert(json.message)
		}
	}
</script>

<SiteHeader />
<NavBar />
<div class="create-post-card">
	<div class="card-header-section">
		<h1 class="card-header-text">Create a Post</h1>
	</div>

	<div class="form-input-area">
		<div class="input-block">
			<label for="text_content">Caption</label>
			<textarea id="text_content" name="text_content" bind:value={textContent} rows="4" cols="50"></textarea>
		</div>
		<div class="input-block">
			<label for="post_photo_link">Picture URL</label>
			<input id="post_photo_link" name="post_photo_link" bind:value={postPicture}>
		</div>
		<div class="input-block">
			<label for="visibility">Visibility</label>
			<input id="visibility" name="visibility" bind:value={visibility}>
		</div>
		<div class="input-block">
			<label for="post_language">Post Language</label>
			<input id="post_language" name="post_language" bind:value={language}>
		</div>
	</div>

	<div class="connections-section">
		<h2>Tag Connections</h2>
		{#each connections as connection}
		<div class="connection-item">
			<img src={connection.profile_picture} alt={connection.name} class="connection-logo">
			<span class="connection-name">{connection.name}</span>
			<input
				type="checkbox"
				value={connection.id}
				on:change={event => handleCheckboxChange(event, connection.id)}
				class="small-checkbox"
			/>
		</div>
		{/each}
	</div>
	<button on:click={createPost}>Create Post</button>
	{#if postPicture}
		<img class="post-image-preview" src={postPicture} alt="Post Picture" />
	{/if}
</div>

<style>
	.create-post-card {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
		background-color: rgb(240,240,250);
		padding: 40px;
		margin: 20px auto;
		border-radius: 15px;
	}

	.card-header-section {
		width: 100%;
	}

	.card-header-text {
		font-size: 40px;
		font-weight: 450;
		margin-bottom: 30px;
	}

	.form-input-area {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 20px;
	}

	.input-block {
		display: flex;
		flex-direction: column;
	}

	label {
		font-size: 15px;
		color: rgb(76, 76, 76);
		margin-bottom: 3px;
	}

	input,
	textarea {
		height: 40px;
		border-radius: 5px;
		border-style: solid;
		border-width: 1px;
		padding: 0px 10px;
		width: 100%;
	}

	textarea {
		height: auto;
	}

	.connections-section {
		width: 100%;
		margin-top: 20px;
	}

	.connection-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.connection-logo {
		width: 30px;
		height: 30px;
		
		border-radius: 50%;
		margin-right: 10px;
	}

	.connection-name {
		flex-grow: 1;
		margin-left: 10px;
	}
	.small-checkbox {
		transform: scale(0.55); /* Makes the checkbox smaller */
		margin-left: auto; 
   		margin-right: 1000px;
	}
	button {
		margin-top: 20px;
		background-color: rgb(19, 13, 212);
		width: 20%;
		margin-right: 1000px;
		height: 50px;
		color: white;
		border-radius: 5px;
		border-style: none;
		transition: background-color 0.15s ease;
	}

	button:hover {
		background-color: rgb(4, 1, 97);
		cursor: pointer;
	}

	.post-image-preview {
		margin-top: 20px;
		width: 100%;
		border-radius: 8px;
		
	}
</style>
