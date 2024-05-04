<script>
import { checkAuthenticated } from "$lib/functions/authentication"
import { onMount } from "svelte";

let token;

onMount(async () => {
	token = await checkAuthenticated();
	await getAccountInfo();
});

let userId, accountInfo;
let displayName, profilePicture, zip, preferredLanguage, birthDate;

async function getAccountInfo() {
    let databaseResult = await fetch(`http://localhost:3000/account/profile`,
		{ headers: { 'Authorization': `Bearer ${token}` }});

    // Format the data into json
    let json = await databaseResult.json();
    if (!json.accountFound) {
        alert(json.message)
        accountInfo = undefined;
		return
	}
	accountInfo = json;
	displayName = json.displayName;
	profilePicture = json.profilePicture;
	zip = json.zip;
	birthDate = json.birthDate;
	preferredLanguage = json.preferredLanguage;
}

async function updateAccountInfo() {
	let databaseResult = await fetch(`http://localhost:3000/account/profile/edit`, {
        method: "PUT",
        body: JSON.stringify({
            "displayName": displayName,
            "profilePicture": profilePicture,
            "zip": zip,
			"preferredLanguage": preferredLanguage,
            "birthDate": birthDate
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
			'Authorization': `Bearer ${token}`
        }
    });
    let json = await databaseResult.json();

    console.log(json);
    if (json.accountUpdated) {
        alert("Account updated successfully!")
    } else {
        alert(json.message)
    }
}
</script>

<div class="edit-account-page">
	<div class="create-account-card">
		<div class="card-header-section">
			<h1 class="card-header-text">Edit Profile</h1>
			<h2 class="tagline">Modify your profile</h2>
		</div>
		<div class="form-input-area">
			<div class="input-row">
				<div class="input-block">
					<label for="displayName">Display Name</label>
					<input type="text" id="displayName" name="displayName" bind:value={displayName}>
				</div>
				<div class="input-block">
					<label for="displayName">Profile Picture</label>
					<input type="text" id="displayName" name="profilePicture" bind:value={profilePicture}>
				</div>
			</div>
			<div class="input-row">
				<div class="input-block">
					<label for="zip">Zip Code</label>
					<input type="number" id="zip" name="zip" bind:value={zip}>
				</div>
				<div class="input-block">
					<label for="preferredLanguage">Preferred Language</label>
					<input type="text" id="preferredLanguage" name="preferredLanguage" bind:value={preferredLanguage}>
				</div>
				<div class="input-block">
					<label for="birthDate">Birth Date</label>
					<input type="date" id="birthDate" name="birthDate" bind:value={birthDate}>
				</div>
			</div>
		</div>
	<button on:click={updateAccountInfo}>CONFIRM</button> </div>
</div>

<style>
	.edit-account-page {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

	}

    .create-account-card {
        /* Text properties */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

        /* Flexbox */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

		width: 50%;
        background-color: rgb(240,240,250);
		padding: 60px;
        margin: 10px 0px;
        border-radius: 20px;
    }

	.card-header-section {
		width: 100%;
	}

    .card-header-text {
        font-size: 50px;
        font-weight: 450;
        margin: 0;
    }

	.tagline {
		font-weight: 100;
		font-size: 15px;
		margin-bottom: 0;
	}

	.form-input-area {
		/* Flexbox */
		display: flex;
		flex-direction: column;
		gap: 10px;

		width: 100%;
		margin: 30px 0px;
	}

	.input-row {
		/* Flexbox */
		display: flex;
		justify-content: center;
		gap: 20px;
		
		width: 100%;
	}

    .input-block {
        /* Flexbox */
        display: flex;
        flex-direction: column;

		width: 100%;
    }

    .sign-in-link {
		margin-top: 20px;
    }

    label {
        /* Text properties */
        font-size: 15px;
        color: rgb(76, 76, 76);

        margin-bottom: 3px;
    }

    input {
        height: 40px;
        border-radius: 5px;
		border-style: solid;
		border-width: 1px;
		padding: 0px 10px;
    }

    button {
		/* Text properties */
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

    .google {
        /* Flexbox */
        display: flex;
        justify-content: center;
        gap: 10px;
        align-items: center;

        /* Text */
        color: rgb(55, 126, 240);
		font-weight: 500;

		width: 100%;
		height: 50px;
        border-style: solid;
        border-radius: 5px;
		border-width: 1px;
		border-color: rgb(55, 126, 240);
        background-color: white;

		/* Animation */
		transition: color 0.15s ease,
					background-color 0.15s ease;
    }

	.google:hover {
		background-color: rgb(55, 126, 240);
		color: white;
		cursor: pointer;
	}

    .google-logo-icon {
        height: 20px;
		border-radius: 50px;
		background-color: white;
		padding: 4px;
    }
</style>
