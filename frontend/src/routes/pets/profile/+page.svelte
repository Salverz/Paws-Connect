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
        background-color: #f4f4f4; /* Light Grey */
        margin: 0;
        padding: 0;
    }

    .pet-container {
        max-width: 400px;
        margin: 20px;
        padding: 20px;
        background-color: #e6e6fa; /* Lavender */
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: row; /* Changed to row */
        align-items: flex-start; /* Changed to flex-start */
        border: 3px solid #000;
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
        top: 150px; /* Position below the profile header */
    }

    .dropdown-item {
        margin-bottom: 5px;
    }

    .action-buttons {
        display: flex;
        flex-direction: column; /* Changed to column */
        justify-content: flex-start; /* Changed to flex-start */
        margin-top: 10px;
        margin-left: 50px;
        margin-right: 10px;
    }

    .action-button {
        background-color: #7b68ee; /* Dark Lavender */
        color: #fff;
        padding: 10px 20px;
        border: 2px solid #000; /* Added border */
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease; /* Smooth Transition */
        margin-bottom: 10px; /* Added margin-bottom */
    }

    .action-button:hover {
        background-color: #6a5acd; /* Darker Lavender */
    }

    .action-button:focus {
        outline: none;
    }
    h1 {
        font-size: 30px;
        margin: 20px;
        font-weight: bold;
        margin-top: 0px;
        margin-left: 8px;
   
    }
    div {
        font-size: 16px;
        margin: 5;
        margin-top: 30px;
        margin-left: -87px;
    }
</style>

<div class="pet-container">
    <h1>{petInfo.name}</h1>
    <div>
        <p>Species: {petInfo.species}</p>
        <p>Breed: {petInfo.breed}</p>
        <p>Color: {petInfo.color}</p>
        <p>Birth Date: {petInfo.birthDate}</p>
        <p>Owner: {petInfo.owner}</p>
    </div>

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
