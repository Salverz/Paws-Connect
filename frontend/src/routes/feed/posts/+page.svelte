<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
    let postPicture;


    let connections = [
        { id: 'conn1', name: 'Buddy', logo: 'path/to/buddy/logo.jpg' },
        { id: 'conn2', name: 'Daisy', logo: 'path/to/daisy/logo.jpg' },
        { id: 'conn3', name: 'Rocky', logo: 'path/to/rocky/logo.jpg' },
    ];

    let selectedConnections = [];

    let showConnectionsList = false;

    function handleUserIDChange(event) {
        if (event.target.value !== '') {
            showConnectionsList = true;
        } else {
            showConnectionsList = false;
        }
    }

    function handleCheckboxChange(event, connectionId) {
        if (event.target.checked) {
            selectedConnections.push(connectionId);
        } else {
            selectedConnections = selectedConnections.filter(id => id !== connectionId);
        }
    }
</script>

<SiteHeader />
<h1>Create a post</h1>

<form method="POST" action="http://localhost:3000/post/create">
    <div class="input-section">
        <label for="userID">User ID</label>
        <input id="userID" name="userID" on:input={handleUserIDChange}>
    </div>

    <div class="input-section">
        <label for="text_content">Caption</label>
        <textarea id="text_content" name="text_content" rows="4" cols="50"></textarea>
    </div>
    <div class="input-section">
        <label for="post_photo_link">Picture</label>
        <input id="post_photo_link" name="post_photo_link" bind:value={postPicture}>
    </div>
    <div class="input-section">
        <label for="visibility">Visibility</label>
        <input id="visibility" name="visibility">
    </div>
    <div class="input-section">
        <label for="post_language">Post language</label>
        <input id="post_language" name="post_language">
    </div>
    <button type="submit">Create post</button>
    <img src={postPicture} alt="Post Picture" />
</form>

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
        <img src={connection.logo} alt={connection.name} class="connection-logo">
        <span class="connection-name">{connection.name}</span>
    </div>
    {/each}
</div>
{/if}

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
