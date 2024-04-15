<script>
	import NavBar from "$lib/components/NavBar.svelte";
    import { onMount } from 'svelte';

    let searchType = 'user';
    let searchTerm = '';
    let locationRange = 0;
	let userId;

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

	async function doSearch() {
		
		if (searchType == "pet") {
			const databaseResult = await fetch(`http://localhost:3000/search/pet?
				petId=${searchTerm}&
				petName=${searchTerm}&
				distance=${locationRange}&
				userId=${userId}`);

			let json = await databaseResult.json();
			console.log(json);
			searchResults = json;
		} else {
			const databaseResult = await fetch(`http://localhost:3000/search/user?
				username=${searchTerm}&
				displayName=${searchTerm}&
				distance=${locationRange}&
				userId=${userId}`);

			let json = await databaseResult.json();
			console.log(json);
			searchResults = json;
		}
	}

</script>

<NavBar/>
<h1>Profile Search</h1>

        <label for="userId">Searcher ID</label>
        <input type="number" id="userId" bind:value={userId}>
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

    <button on:click={doSearch}>Search</button>
    <button on:click={clearSearch}>Clear</button>


<div class="results-section">
    <h2>Search Results</h2>
    {#if searchResults.length}
        {#each searchResults as result}
            <div class="result-item">
                <img src={result.profile_picture} alt={result.display_name} class="profile-picture">
                
                <div class="result-info">
                    <h3>
                        {#if result.user_id}
                            <a href={`/user/profile/${result.user_id}`}>{result.display_name}</a> (user)
						{:else}
                            <a href={`/pets/profile/${result.pet_id}`}>{result.name}</a> (pet)
                        {/if}
                    </h3>
                    
                    <p>Longitude: {result.longitude}</p>
                    <p>Latitude: {result.latitude}</p>
                </div>

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
