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
		width: 80%; 
		background-color: rgb(240,240,250);
		padding: 40px;
		margin: 20px auto;
		border-radius: 15px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1); /* subtle shadow */
	}

	.card-header-section {
		width: 100%;
		text-align: center; 
	}

	.card-header-text {
		font-size: 32px; 
		font-weight: 500;
		color: #333; 
		margin-bottom: 20px;
	}

	.form-input-area {
		width: 100%;
	}

	.input-row {
		display: flex;
		justify-content: space-between; 
		gap: 10px;
	}

	.input-block {
		flex-grow: 1; 
		display: flex;
		flex-direction: column;
	}

	label {
		font-size: 16px;
		color: rgb(50, 50, 50); 
		margin-bottom: 5px;
	}

	.text-input, select {
		height: 40px;
		border-radius: 5px;
		border: 1px solid #ccc;
		padding: 0 10px;
	}

	.results-section {
		width: 80%; 
		margin: 20px auto; 
		display: flex; 
		flex-direction: column;
		align-items: center;
	}

	.result-item {
		background-color: #fff; 
		border-radius: 10px;
		padding: 15px;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		width: 20%; 
		box-shadow: 0 1px 5px rgba(0,0,0,0.1); 
		transition: box-shadow 0.2s ease; 
	}

	.result-item:hover {
		box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
	}

	.profile-picture {
		width: 60px; 
		height: 60px;
		border-radius: 50%;
		margin-right: 20px; 
	}

	h2 {
		text-align: center; 
		width: 100%; 
	}

	button {
		padding: 10px 20px;
		margin-top: 20px;
		background-color: #001a72; 
		color: white;
		border-radius: 5px;
		border: none;
		font-weight: 500;
		transition: background 0.2s;
	}

	button:hover {
		background-color: #000d48; /* Darker on hover */
	}
</style>