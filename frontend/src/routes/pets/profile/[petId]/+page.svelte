<script>
    const petInfo = {
        "petId": 7,
        "species": "dog",
        "breed": "Poodle",
        "color": "brown",
        "name": "Rena",
        "birthDate": "2021-05-12",
        "profilePicture": "https://mleiatrkukou.i.optimole.com/cb:iQWp.102bc/w:auto/h:auto/q:mauto/f:best/https://bon[…]img-products-1200x628.png",
        "owner": "Joshua"
    };

    let name = "Max";
    let gender = "Male";
    let bio = "A friendly and playful pet.";
    let location = "New York";
    
    let connections = [
        { name: "Buddy", gender: "Male" },
        { name: "Daisy", gender: "Female" },
        { name: "Rocky", gender: "Male" }
    ];
    
    let suggestedProfiles = [
        { name: "Lucy", gender: "Female" },
        { name: "Charlie", gender: "Male" },
        { name: "Bella", gender: "Female" }
    ];
    
    let showConnections = false;
    let showSuggestedProfiles = false;
    
    function toggleConnections() {
        showConnections = !showConnections;
    }
    
    function toggleSuggestedProfiles() {
        showSuggestedProfiles = !showSuggestedProfiles;
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #fafafa;
        margin: 0;
        padding: 0;
    }

    .pet-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #87CEEB; /* Blue background color */
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .dropdown-list {
        position: absolute;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        padding: 10px;
        z-index: 1;
        width: 100%;
        left: 0;
    }

    .dropdown-item {
        margin-bottom: 5px;
    }

    .action-buttons {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
    }

    .action-button {
        background-color: #ccc; 
        color: black;
        padding: 10px 20px;
        border: 2px solid #000; 
        border-radius: 5px;
        margin: 0 10px;
        cursor: pointer;
    }

    .action-button:hover {
        background-color: #999; /* Darker Grey */
    }

    .action-button:focus {
        outline: none;
    }
</style>

<div class="pet-container">
    <h1>{petInfo.name}</h1>
    <p>Species: {petInfo.species}</p>
    <p>Breed: {petInfo.breed}</p>
    <p>Color: {petInfo.color}</p>
    <p>Birth Date: {petInfo.birthDate}</p>
    <p>Owner: {petInfo.owner}</p>

    <div class="action-buttons">
        <button class="action-button" on:click={toggleConnections}>Connections</button>
        {#if showConnections}
        <div class="dropdown-list">
            {#each connections as connection}
            <div class="dropdown-item">
                <p>{connection.name}</p>
                <p>Gender: {connection.gender}</p>
            </div>
            {/each}
        </div>
        {/if}

        <button class="action-button" on:click={toggleSuggestedProfiles}>Suggested Profiles</button>
        {#if showSuggestedProfiles}
        <div class="dropdown-list">
            {#each suggestedProfiles as profile}
            <div class="dropdown-item">
                <p>{profile.name}</p>
                <p>Gender: {profile.gender}</p>
            </div>
            {/each}
        </div>
        {/if}
    </div>
</div>
