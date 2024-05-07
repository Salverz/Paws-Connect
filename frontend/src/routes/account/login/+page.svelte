<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { goto } from "$app/navigation";

	let username, password;

	async function login() {
		let databaseResult = await fetch(`http://localhost:3000/account/login`, {
			method: "POST",
			body: JSON.stringify({
				"username": username,
				"password": password,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});

		let json = await databaseResult.json();
		console.log("token: " + json.token);
		localStorage.setItem("token", json.token);
		console.log(json);

		if (json.login) {
			goto("/feed");
		} else {
			alert(json.message);
		}
	}
</script>

<SiteHeader/>
<NavBar/>
<div class="login-page">
	<div class="create-account-card">
		<div class="card-header-section">
			<h1 class="card-header-text">Login</h1>
			<h2 class="tagline">Enter your username and password</h2>
		</div>
		<div class="form-input-area">
			<div class="input-row">
				<div class="input-block">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" bind:value={username}>
				</div>
			</div>
			<div class="input-row">
				<div class="input-block">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" bind:value={password}>
				</div>
			</div>
		</div>

		<button on:click={login}>LOGIN</button>
		<div class="sign-in-link">
			Don't have an account? <a href="./create">Create one</a>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
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
