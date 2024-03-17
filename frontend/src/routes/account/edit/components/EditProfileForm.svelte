<script>
let username, password, accountInfo;

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
            "inputUsername": username,
            "inputPassword": password,
            "displayName": accountInfo.displayName,
            "profilePictureRef": accountInfo.profilePictureRef,
            "currentLocation": accountInfo.currentLocation,
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
        alert("Account was not updated. Please enter a valid username and password")
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
                <input type="text" bind:value={accountInfo.displayName}>
            </div>

            <div class="input-block">
                <label for="profilePictureRef">Profile Picture Link</label>
                <input type="text" bind:value={accountInfo.profilePictureRef}>
            </div>

            <div class="input-block">
                <label for="currentLocation">Location</label>
                <input type="text" bind:value={accountInfo.currentLocation}>
            </div>
            
            <div class="input-block">
                <label for="preferredLanguage">Preferred Language</label>
                <input type="text" bind:value={accountInfo.preferredLanguage}>
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