<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"
	import { onMount } from "svelte";

	let token;

	onMount(async () => {
		token = await checkAuthenticated();
		await getConnections();
	});

	async function getConnections() {
		const token = localStorage.getItem("token");

		const response = await fetch("http://localhost:3000/connections/list",
			{ headers: { 'Authorization': `Bearer ${token}` }});
		connections = await response.json();
	}

	let connections = [];

	async function deleteConnection(connectionIndex) {
		const deleteConnection = confirm(`Are you sure you want to delete ${connections[connectionIndex].name}?`);
		if (!deleteConnection) {
			return;
		}

		const response = await fetch(`http://localhost:3000/connections/remove`, {
			method: "DELETE",
			body: JSON.stringify({
				"connectionId": connections[connectionIndex].id
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': `Bearer ${token}`
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (json.deleted) {
			alert(`Deleted ${connections[connectionIndex].name}`);
			getConnections();
		}
	}
</script>

<SiteHeader/>
<NavBar/>
<div class="connection-list">
	<h2>Your Connections</h2>
	{#each connections as connection, index}
		<div class="connection-entry">
			<img class="profile-picture" src={connection.profile_picture}>
			{connection.name}
			{connection.age}
			<a href="/connections/profile/{connection.id}">Profile</a>
			<button on:click={() => { deleteConnection(index) }}>Delete</button>
		</div>
	{/each}
	<a class="add-connection-button" href="/connections/add">Add a New Connection</a>
</div>

<style>
	.connection-list {
		display: flex;
		flex-direction:column;
		gap: 10px;
		align-items: center;

		margin: 0px 50px;
		font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.connection-entry {
		display: flex;
		align-items: center;
		gap: 20px;

		background-color: lightgray;
		padding: 20px;
		outline-width: 1px;
		outline-style: solid;
		border-radius: 5px;
		width: 1000px;
	}

	.profile-picture {
		max-height: 100px;
		max-width: 100px;
	}

	.add-connection-button {
		text-decoration: none;
		color: black;
		background-color: rgb(30, 220, 227);
		padding: 10px;
		border-radius: 5px;
		align-self: left;
	}

	.add-connection-button:hover {
		background-color: rgb(21, 143, 148);
	}
</style>
