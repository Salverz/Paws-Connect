<script>
	import NavBar from "$lib/components/NavBar.svelte";

	let userId, name, profilePictureImage, species, breed, color, bio, birthDate;

	async function createNewPet() {
		let databaseResult = await fetch(`http://localhost:3000/pet/create`, {
			method: "POST",
			body: JSON.stringify({
				"userId": userId,
				"name": name,
				"profilePicture": profilePictureImage,
				"species": species,
				"breed": breed,
				"color": color,
				"bio": bio,
				"birthDate": birthDate
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});

		let json = await databaseResult.json();
		console.log(json);

		if (json.created) {
			alert("Pet created successfully!");
		} else {
			alert("Pet creation failed");
		}
	}
</script>

<NavBar/>
<div class="create-account-card">
	<div class="card-header-section">
		<h1 class="card-header-text">Add a pet</h1>
		<h2 class="tagline">Let's meet your furry friend!</h2>
	</div>
	<div class="form-input-area">
		<div class="input-row">
			<div class="input-block">
				<label for="userId">Your user ID</label>
				<input class="text-input" type="text" id="userId" name="userId" bind:value={userId}>
			</div>
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="name">Pet's name</label>
				<input class="text-input" type="text" id="name" name="name" bind:value={name}>
			</div>
			<div class="input-block">
				<label for="profilePicture">Add a profile picture</label>
				<!-- <input type="file" id="profilePicture" name="profilePicture" bind:files={profile_picture_image}> -->
				<input class="text-input" type="text" id="profilePicture" name="profilePicture" bind:value={profilePictureImage}>
			</div>
			<!--
			TODO: MAKE UPLOADED IMAGE DISPLAY PREVIEW ON UPLOAD
			-->
			{#if profilePictureImage}
				<img class="profile-picture-preview" src={profilePictureImage} alt="uploaded profile picture preview">
				<!--
				<p>{profile_picture_image["0"].webkitRelativePath}</p>
				<img src="{profile_picture_image["0"].name}">
				-->
			{/if}
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="species">Species</label>
				<input class="text-input" type="text" id="species" name="species" bind:value={species}>
			</div>
			<div class="input-block">
				<label for="breed">Breed</label>
				<input class="text-input" type="text" id="breed" name="breed" bind:value={breed}>
			</div>
			<div class="input-block">
				<label for="color">Color</label>
				<input class="text-input" type="text" id="color" name="color" bind:value={color}>
			</div>
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="birthDate">Date of birth</label>
				<input class="text-input" type="date" id="birthDate" name="birthDate" bind:value={birthDate}>
			</div>
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="bio">Bio</label>
				<textarea class="text-input" id="bio" name="bio" rows="4" cols="50" bind:value={bio}></textarea>
			</div>
		</div>
	</div>

	<button on:click={createNewPet}>Create Pet Profile</button>
</div>

<style>
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

    label {
        /* Text properties */
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

	.profile-picture-preview {
		max-width: 300px;
		max-height: 300px;
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
</style>
