<script>
	import { onMount } from "svelte";
	import NavBar from "$lib/components/NavBar.svelte";
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"

	let token;

	onMount(async () => {
		token = await checkAuthenticated();
	});

    let userId, postPicture, textContent, visibility, language;

	async function getUserPets() {
		const response = await fetch(`http://localhost:3000/pet/pets/${userId}`);
		const json = await response.json();
		console.log(json);
		connections = [];
		connections = json;
		selectedConnections = [];
	}

    let connections = [
        { id: 1, name: 'Buddy', logo: 'path/to/buddy/logo.jpg' },
        { id: 2, name: 'Daisy', logo: 'path/to/daisy/logo.jpg' },
        { id: 3, name: 'Rocky', logo: 'path/to/rocky/logo.jpg' },
    ];

    let selectedConnections = [];

    let showConnectionsList = false;

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
<NavBar/>
<h1>Create a post</h1>
	<input type="hidden" id="petsToTag" name="petsToTag" bind:value={selectedConnections}>
    <div class="input-section">
        <label for="text_content">Caption</label>
        <textarea id="text_content" name="text_content" bind:value={textContent} rows="4" cols="50"></textarea>
    </div>
    <div class="input-section">
        <label for="post_photo_link">Picture</label>
        <input id="post_photo_link" name="post_photo_link" bind:value={postPicture}>
    </div>
    <div class="input-section">
        <label for="visibility">Visibility</label>
        <input id="visibility" name="visibility" bind:value={visibility}>
    </div>
    <div class="input-section">
        <label for="post_language">Post language</label>
        <input id="post_language" name="post_language"bind:value={language}>
    </div>
	{#if showConnectionsList}
	<div class="connections-section">
		<h2>Tag Connections</h2>
		{#each connections as connection}
		<div class="connection-item">
			<input
				type="checkbox"
				value={connection.id}
				on:change={event => handleCheckboxChange(event, connection.id)}
			/>
			<img src={connection.profile_picture} alt={connection.name} class="connection-logo">
			<span class="connection-name">{connection.name}</span>
		</div>
		{/each}
	</div>
	{/if}
    <button on:click={createPost}>Create post</button>
    <img src={postPicture} alt="Post Picture" />

<style>
    form {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .connections-section {
        margin-top: 20px;
    }

    .connection-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .connection-logo {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    .connection-name {
        flex-grow: 1;
        margin-left: 10px;
    }
</style>
