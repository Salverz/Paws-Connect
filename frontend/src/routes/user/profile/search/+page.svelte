<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "../../../../lib/components/SiteHeader.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"
    import { onMount } from 'svelte';

	let token;

	onMount(async () => {
		token = await checkAuthenticated();
	});

    let searchType = 'user';
    let searchTerm = '';
    let locationRange = 0;
	let userId;

    let searchResults = [];

    function clearSearch() {
        searchType = 'user';
        searchTerm = '';
        locationRange = 0;
        searchResults = [];
    }

	async function doSearch() {
		if (searchType == "pet") {
			const databaseResult = await fetch(`http://localhost:3000/search/pet?
				petId=${searchTerm}&
				petName=${searchTerm}&
				distance=${locationRange}&
				userId=${userId}`,
				{ headers: { 'Authorization': `Bearer ${token}` }});

			let json = await databaseResult.json();
			console.log(json);
			searchResults = json;
		} else {
			const databaseResult = await fetch(`http://localhost:3000/search/user?
				username=${searchTerm}&
				displayName=${searchTerm}&
				distance=${locationRange}&
				userId=${userId}`,
				{ headers: { 'Authorization': `Bearer ${token}` }});

			let json = await databaseResult.json();
			console.log(json);
			searchResults = json;
		}
	}

</script>

<SiteHeader/>
<NavBar/>
<div class="search-card">
	<div class="card-header-section">
		<h1 class="card-header-text">Profile Search</h1>
	</div>
	<div class="form-input-area">
		<div class="input-row">
			<div class="input-block">
				<label for="searchType">Search for:</label>
				<select id="searchType" bind:value={searchType}>
					<option value="user">User Profile</option>
					<option value="pet">Pet Profile</option>
				</select>
			</div>
			<div class="input-block">
				<label for="searchTerm">Search Term:</label>
				<input class="text-input" id="searchTerm" bind:value={searchTerm} placeholder="Enter username, display name, or pet name">
			</div>
			<div class="input-block">
				<label for="locationRange">Location Range (in miles):</label>
				<input class="text-input" id="locationRange" type="number" bind:value={locationRange} placeholder="Enter location range">
			</div>
		</div>
		<button on:click={doSearch}>Search</button>
		<button on:click={clearSearch}>Clear</button>
	</div>
</div>

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
	.search-card {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
		background-color: rgb(240,240,250);
		padding: 60px;
		margin: 20px auto;
		border-radius: 15px;
	}

	.card-header-section {
		width: 100%;
	}

	.card-header-text {
		font-size: 40px;
		font-weight: 450;
		margin: 0;
	}

	.form-input-area {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 20px 0px;
	}

	.input-row {
		display: flex;
		justify-content: center;
		gap: 20px;
		width: 100%;
	}

	.input-block {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	label {
		font-size: 15px;
		color: rgb(76, 76, 76);
		margin-bottom: 3px;
	}

	.text-input {
		height: 40px;
		border-radius: 5px;
		border-style: solid;
		border-width: 1px;
		padding: 0px 10px;
	}

	.results-section {
		margin-top: 30px;
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
		margin-top: 20px;
        font-weight: 500;
        background-color: rgb(19, 13, 212);
        width: 100%;
		height: 50px;
        color: white;
        border-radius: 5px;
        border-style: none;

		/* Animation */
		transition: background-color 0.15s ease;
	}
    button:hover {
        background-color: rgb(4, 1, 97);
        cursor: pointer;
    }
</style>