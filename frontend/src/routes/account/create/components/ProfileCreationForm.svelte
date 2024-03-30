<script>
let profile_picture_image;
</script>

<form class="create-account-card" action="http://localhost:3000/account/profile/create" method="POST">
	<div class="card-header-section">
		<h1 class="card-header-text">Create your profile</h1>
		<h2 class="tagline">Let's get to know you</h2>
	</div>
	<div class="form-input-area">
		<div class="input-row">
			<div class="input-block">
				<label for="username">Re-enter your username (temporary)</label>
				<input class="text-input" type="text" id="username" name="username">
			</div>
			<div class="input-block">
				<label for="displayName">Choose a display name</label>
				<input class="text-input" type="text" id="displayName" name="displayName">
			</div>
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="profilePicture">Add a profile picture</label>
				<!-- <input type="file" id="profilePicture" name="profilePicture" bind:files={profile_picture_image}> -->
				<input class="text-input" type="text" id="profilePicture" name="profilePicture" bind:value={profile_picture_image}>
			</div>
			<!--
			TODO: MAKE UPLOADED IMAGE DISPLAY PREVIEW ON UPLOAD
			-->
			{#if profile_picture_image}
				<img class="profile-picture-preview" src={profile_picture_image} alt="uploaded profile picture preview">
				<!--
				<p>{profile_picture_image["0"].webkitRelativePath}</p>
				<img src="{profile_picture_image["0"].name}">
				-->
			{/if}
		</div>
		<div class="input-row">
			<div class="input-block">
				<label for="birthDate">Date of birth</label>
				<input class="text-input" type="date" id="birthDate" name="birthDate">
			</div>
			<div class="input-block">
				<label for="location">Your location</label>
				<input class="text-input" type="text" id="location" name="location">
			</div>
			<div class="input-block">
				<label for="language">Your preferred language</label>
				<input class="text-input" type="text" id="language" name="language">
			</div>
		</div>
	</div>

	<button>Create Profile</button>
</form>


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
