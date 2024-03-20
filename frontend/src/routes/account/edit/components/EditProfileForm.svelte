<script>
let username, accountInfo;

async function getAccountInfo() {
    // Fetch the data from the backend (/account/info/[userId] in this case, put the user's userId, in the [userId] slot)
    let databaseResult = await fetch(`http://localhost:3000/account/info/${username}`);

    // Format the data into json
    let json = await databaseResult.json();
    if (json.message == "User not found") {
        alert("Account not found")
        accountInfo = undefined;
    } else {
        accountInfo = json;
    }
}

async function updateAccountInfo() {
    let databaseResult = await fetch(`http://localhost:3000/account/edit`, {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "displayName": accountInfo.displayName,
            "profilePicture": accountInfo.profilePicture,
            "location": accountInfo.location,
            "preferredLanguage": accountInfo.preferredLanguage
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    let json = await databaseResult.json();

    console.log(json);
    if (json.success) {
        alert("Account updated successfully!")
    } else {
        alert("Account was not updated. Please enter a valid username")
    }
}
</script>

<div class="edit-account-form">
    <h1>Edit your profile</h1>
    <div class="input-block">
        <label for="username">Username</label>
        <input type="text" bind:value={username}>
    </div>
    <button on:click={getAccountInfo}>Get account details</button>

    {#if accountInfo != undefined}
        <form on:submit={updateAccountInfo}>
            <div class="input-block">
                <label for="displayName">Display Name</label>
                <input id="displayName" type="text" bind:value={accountInfo.displayName}>
            </div>

            <div class="input-block">
                <label for="profilePicture">Profile Picture Link</label>
                <input id="profilePicture" type="text" bind:value={accountInfo.profilePicture}>
            </div>

            <div class="input-block">
                <label for="location">Location</label>
                <input id="location" type="text" bind:value={accountInfo.location}>
            </div>
            
            <div class="input-block">
                <label for="preferredLanguage">Preferred Language</label>
                <input id="preferredLanguage" type="text" bind:value={accountInfo.preferredLanguage}>
            </div>

            <div class="input-block">
                <label for="birthDate">Date of birth</label>
                <input id="birthDate" type="date" bind:value={accountInfo.birthDate}>
            </div>
            <input type="submit" value="Update account">
        </form>
    {/if}
</div>

<style>
.edit-account-form {
    /* background-color: rgb(221, 221, 221); */
    padding: 20px;
    width: 100%;

    /* Text */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.input-block {
    /* Flexbox */
    display: flex;
    flex-direction: column;

    margin: 20px 0px;
}

label {
    margin-bottom: 5px;
}

input {
    height: 25px;
    border-radius: 5px;
    border-style: inset;
    padding: 5px 10px;
}
</style>