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

		const response = await fetch("http://localhost:3000/connection",
			{ headers: { 'Authorization': `Bearer ${token}` }});
		connections = await response.json();
		console.log(connections);
	}

	let connections = [];

	async function removeFriend(index) {
		const deleteFriend = confirm(`Are you sure you want to remove ${connections[index].display_name} as a friend?`);
		if (!deleteFriend) {
			return;
		}

		const response = await fetch(`http://localhost:3000/connection`, {
			method: "DELETE",
			body: JSON.stringify({
				"friend": connections[index].user_id
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': `Bearer ${token}`
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (json.success) {
			alert(`Removed ${connections[index].display_name} as a friend`);
			connections.splice(index, 1);
			connections = connections;
		}
	}

	async function respondToRequest(doAccept, index) {
		const response = await fetch(`http://localhost:3000/connection/request/respond`, {
			method: "POST",
			body: JSON.stringify({
				"senderId": connections[index].user_id,
				"doAccept": doAccept
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': `Bearer ${token}`
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));

		if (!json.success) {
			alert(json.message);
			return;
		}

		if (doAccept) {
			alert(json.message);
			connections[index].receiver_user_id = null;
		} else {
			alert(json.message);
			connections.splice(index, 1);
			connections = connections;
		}
	}

	async function cancelFriendRequest(petIndex) {
		const response = await fetch(`http://localhost:3000/connection/request`, {
			method: "DELETE",
			body: JSON.stringify({
				"connectionReceiver": userId
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': `Bearer ${token}`
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));

		alert(json.message);
		friendRequestStatus = "none";
	}
</script>

<SiteHeader/>
<NavBar/>
<div class="connections-page">
	<h2>Your Connections</h2>
	<div class="connection-list">
		{#each connections as connection, index}
			<div class="connection-entry">
				<img class="profile-picture" src={connection.profile_picture}>
				{connection.display_name}
				<a href="/user/profile/{connection.user_id}">Profile</a>


				{#if connection.receiver_user_id == null}
					<button on:click={() => { removeFriend(index) }}>Remove</button>
				{:else}

					<button on:click={() => respondToRequest(true, index)} class="add-friend-button">Accept friend request</button>
					<button on:click={() => respondToRequest(false, index)} class="add-friend-button">Deny friend request</button>
				{/if}

			</div>
		{/each}
	</div>
</div>

<style>
	.connections-page {
		font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.connection-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
		align-items: center;

		margin: 0px 100px;
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
		height: 80px;
		width: 45%;
	}

	.profile-picture {
		height: 100px;
		width: 100px;
		border-radius: 50%;
		object-fit: cover;
		border-style: solid;
		border-width: 1px;
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
