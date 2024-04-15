<script>
    import { onMount } from 'svelte';

    let searchType = 'user';
    let searchTerm = '';
    let locationRange = 0;

    let searchResults = [];

    function handleSearch() {
        searchResults = [
            { id: '1', name: 'Rahul', type: 'user', location: 'New York', profilePicture: 'path/to/rahul/profile.jpg' },
            { id: '2', name: 'Fluffy', type: 'pet', location: 'San Francisco', profilePicture: 'path/to/fluffy/profile.jpg' }
        ];
    }

    function clearSearch() {
        searchType = 'user';
        searchTerm = '';
        locationRange = 0;
        searchResults = [];
    }

    function goToProfile(id) {
        const profileURL = `http://localhost:3000/profile/${id}`;
        window.location.href = profileURL;
    }

</script>

<h1>Profile Search</h1>

<form on:submit|preventDefault={handleSearch}>
    <div class="input-section">
        <label for="searchType">Search for:</label>
        <select id="searchType" bind:value={searchType}>
            <option value="user">User Profile</option>
            <option value="pet">Pet Profile</option>
        </select>
    </div>

    <div class="input-section">
        <label for="searchTerm">Search Term:</label>
        <input id="searchTerm" name="searchTerm" bind:value={searchTerm} placeholder="Enter username, display name, or pet name">
    </div>

    <div class="input-section">
        <label for="locationRange">Location Range (in miles):</label>
        <input id="locationRange" name="locationRange" type="number" bind:value={locationRange} placeholder="Enter location range">
    </div>

    <button type="submit">Search</button>
    <button type="button" on:click={clearSearch}>Clear</button>
</form>


<div class="results-section">
    <h2>Search Results</h2>
    {#if searchResults.length}
        {#each searchResults as result}
            <div class="result-item">
                <img src={result.profilePicture} alt={result.name} class="profile-picture">
                
                <div class="result-info">
                    <h3>
                        {#if result.type === 'user'}
                            <a href={`/user/profile/${result.id}`}>{result.name}</a> ({result.type})
                        {:else if result.type === 'pet'}
                            <a href={`/pets/profile/${result.id}`}>{result.name}</a> ({result.type})
                        {/if}
                    </h3>
                    
                    <p>Location: {result.location}</p>
                </div>

                <button on:click={() => goToProfile(result.id)}>View Profile</button>
            </div>
        {/each}
    {:else}
        <p>No results found.</p>
    {/if}
</div>

<style>
    form {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin-bottom: 20px;
    }

    .input-section {
        margin-bottom: 10px;
    }

    .results-section {
        margin-top: 20px;
    }

    .result-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .profile-picture {
        width: 50px;
        height: 50px;
        border-radius: 50%; 
        margin-right: 10px;
    }
    
    button {
        margin-left: auto;
    }
</style>
