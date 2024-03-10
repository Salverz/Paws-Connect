<!-- This is the page for modifying the user profile -->
<!-- It should use the data it got from the backend to show the current user profile data -->
<!-- The user can change the data, then send that new data back to the backend to be updated in the database -->
<script>
let username, password;

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

let accountInfo;
</script>

<!--  We want to fill in pre-fill-in the input fields with the data we got from +page.js -->

<!-- TODO: make this form send a POST request to the /account/edit route so that the backend -->
<!-- can update the user's profile with the new information -->
<a href="/account/create">Create a new account</a>
<br>
<br>
<br>
<h1>Edit your profile</h1>

<h2>Login to update your account details</h2>
<!-- The user will put their id here so that we know which user to update -->
<label for="username">Username</label>
<input type="text" bind:value={username}>
<button on:click={getAccountInfo}>Get account details</button>
<br/>
<br/>
<br/>

{#if accountInfo != undefined}
<form on:submit={updateAccountInfo}>
    <!-- TODO: Pre-fill-in with the display name -->
    <label for="displayName">Display Name</label>
    <input type="text" bind:value={accountInfo.displayName}>
    <br/>
    
    <!-- TODO: Pre-fill-in with the profile picture link -->
    <label for="profilePictureRef">Profile Picture Link</label>
    <input type="text" bind:value={accountInfo.profilePictureRef}>
    <br/>

    <!-- TODO: Pre-fill-in with the geographical location -->
    <label for="currentLocation">Location</label>
    <input type="text" bind:value={accountInfo.currentLocation}>
    <br/>

    <!-- TODO: Pre-fill-in with the preferred language -->
    <label for="preferredLanguage">Preferred Language</label>
    <input type="text" bind:value={accountInfo.preferredLanguage}>
    <br/>

    <!-- TODO: make a submit button that will submit the form to send the new profile info to the backend -->
    <input type="submit" value="Update account">
</form>
{/if}

<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->