<script>
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import NavBar from "$lib/components/NavBar.svelte";
	import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"

	let token;

	let name = "Loading...";
	let profile_picture = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
	let bio = "Loading...";
	let zip, preferred_language, username, birthDate, userProfilePicture, viewerUserId, areFriends, pendingRequest, friendRequestStatus;
	let connectionPath = [];

	let friends = [], pets = [];
	let posts = 121;
	let connections = [
		{ name: "Rahul", profile_picture: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
		{ name: "David", profile_picture: "https://i.pinimg.com/236x/39/f8/f1/39f8f15525a9d4727728aa214bae0ddf.jpg" },
		{ name: "Kim", profile_picture: "https://variety.com/wp-content/uploads/2024/01/Kim-Kardashian.jpg" },
		{ name: "Jeff", profile_picture: "https://media.gettyimages.com/id/143071480/photo/student-standing-on-steps-outdoors.jpg?s=612x612&w=gi&k=20&c=UbOAUe8a6nWfpfMbej3a7J8awOhBdVnNSc65rXmfV7A=" },
		{ name: "Chase", profile_picture: "https://pics.craiyon.com/2023-07-07/7fc64a9b0eb141689af167796b348537.webp" },
	];

	let showConnections = false;

	function toggleConnections() {
		showConnections = !showConnections;
	}
	let similarProfiles = [
		{ name: "Isabella", profile_picture: "https://m.media-amazon.com/images/M/MV5BZDQxNGNmZDctODI3ZC00ZDNjLWE2YjctZjhhOTkzMmM1MGM1XkEyXkFqcGdeQXVyMzQ2Njc1OTY@._V1_.jpg" },
		{ name: "Mike", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiyAi_e7nPeAB-jWMUT0-YsBEUhZUBcAGqxg&usqp=CAU" },
		{ name: "Jack", profile_picture: "https://images.mubicdn.net/images/cast_member/24202/cache-207702-1489464067/image-w856.jpg?size=800x" },
		{ name: "Noah", profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkC9a9mZGJvcvFlXXR9VutCVx4TJGeVHuh4A&usqp=CAU" }
	];

	let showSimilarProfiles = false;

	function toggleSimilarProfiles() {
		showSimilarProfiles = !showSimilarProfiles;
	}

	const userId = $page.params.userId;
	console.log(userId);

	async function getProfileData() {
		let data = await fetch(`http://localhost:3000/account/profile/${userId}`,
			{ headers: { 'Authorization': `Bearer ${token}` }});
		let json = await data.json();
		console.log(json);
		username = json.username;
		name = json.displayName;
		profile_picture = json.profilePicture;
		zip = json.zip;
		preferred_language = json.preferredLanguage;
		birthDate = json.birthDate;
		friends = json.friends;
		pets = json.pets;
		userProfilePicture = json.userProfilePicture;
		viewerUserId = json.viewerUserId;
		areFriends = json.areFriends;
		friendRequestStatus = json.friendRequestStatus;
	}

	async function getConnectionPath() {
		const path = await fetch(`http://localhost:3000/connection/path?end=${userId}`,
			{ headers: { 'Authorization': `Bearer ${token}` }});
		const json = await path.json();

		connectionPath = json;
		console.log(json);
	}

	async function removeFriend() {
		const deleteFriend = confirm(`Are you sure you want to remove ${name} as a friend?`);
		if (!deleteFriend) {
			return;
		}

		const response = await fetch(`http://localhost:3000/connection`, {
			method: "DELETE",
			body: JSON.stringify({
				"friend": userId
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': `Bearer ${token}`
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (json.success) {
			alert(`Removed ${name} as a friend`);
			areFriends = false;
			await getConnectionPath();
		}
	}

	async function createFreindRequest() {
		const response = await fetch(`http://localhost:3000/connection/request/create`, {
			method: "POST",
			body: JSON.stringify({
				"connectionReceiver": userId
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${token}` 
			}
		});
		const json = await response.json();
		console.log(JSON.stringify(json));
		if (!json.success) {
			alert(json.message);
			return;
		}

		friendRequestStatus = "sent";
		alert(json.message);
	}

	async function respondToRequest(doAccept) {
		const response = await fetch(`http://localhost:3000/connection/request/respond`, {
			method: "POST",
			body: JSON.stringify({
				"senderId": userId,
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
			areFriends = true;
		} else {
			alert(json.message);
			friendRequestStatus = "none";
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

	onMount(async () => {
		token = await checkAuthenticated();
		await getProfileData();
		await getConnectionPath();
	});

</script>

<SiteHeader/>
<NavBar/>
<div class="profile-page">
	<div class="container">
		<div class="profile-header">
			<img class="profile-picture" src="{profile_picture}" alt="Profile Picture">
			<div class="profile-info">
				<h1>{name}</h1>
				{#if areFriends}
					<button on:click={removeFriend} class="add-friend-button">Remove friend</button>
				{:else if friendRequestStatus == "sent"}
					<button on:click={cancelFriendRequest} class="add-friend-button">Cancel friend request</button>
				{:else if friendRequestStatus == "received"}
					<button on:click={() => respondToRequest(true)} class="add-friend-button">Accept friend request</button>
					<button on:click={() => respondToRequest(false)} class="add-friend-button">Deny friend request</button>
				{:else}
					<button on:click={createFreindRequest} class="add-friend-button">Send friend request</button>
				{/if}
				<!--
				<div class="stats">
					<p>Username: {username}</p>
					<p>Zip code: {zip}</p>
					<p>Birthday: {birthDate}</p>
					<p>Preferred language: {preferred_language}</p>
				</div>
				-->
			</div>
			<div class="friend-list pets-list">
				{#each pets as pet}
					<a rel="external" href="http://localhost:5173/pets/profile/{pet.pet_id}">
						<div class="friend">
							<img class="friend-profile-picture" src={pet.profile_picture}>
							<p class="friend-name">{pet.name}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
		<br>
		<div class="connection-path">
			<div class="connection-path-text">
				Connection path:
			</div>
			{#if connectionPath.length == 0}
				<div class="connection-path-text">
					No path
				</div>
			{:else}
				<div class="connection-path-text">
					<a rel="external" href="/user/profile/{viewerUserId}">
						<div class="you friend">
							<img class="friend-profile-picture" src={userProfilePicture}>
							<span class="friend-name">You</span>
						</div>
					</a>
				</div>
					{#each connectionPath as connection}
						{#if connection != connectionPath[0]}
							<div class="arrow">
								&rarr;
							</div>
							<a rel="external" href="/user/profile/{connection[0].user_id}">
								<div class="friend">
									<img class="friend-profile-picture" src={connection[0].profile_picture}>
									<span class="friend-name">{connection[0].display_name}</span>
								</div>
							</a>
						{/if}
					{/each}
				{/if}
		</div>
		Friends
		<div class="friend-list">
			{#each friends as friend}
				<a rel="external" href="http://localhost:5173/user/profile/{friend.user_id}">
					<div class="friend">
						<img class="friend-profile-picture" src={friend.profile_picture}>
						<p class="friend-name">{friend.display_name}</p>
					</div>
				</a>
			{/each}
		</div>

	<!--
		<div class="action-buttons">
		  <button class="action-button" on:click={toggleConnections}>Connections</button>
		  <button class="action-button similar-profiles-button" on:click={toggleSimilarProfiles}>Similar Profiles</button>
	  </div>
	  {#if showConnections}
	  <div class="connection-list">
		  {#each connections as connection}
		  <div class="connection">
			  <img src="{connection.profile_picture}" alt="{connection.name}'s Profile Picture">
			  <span>{connection.name}</span>
		  </div>
		  {/each}
	  </div>
	  {/if}
	  {#if showSimilarProfiles}
	  <div class="profile-list">
		  {#each similarProfiles as profile}
		  <div class="profile">
			  <img src="{profile.profile_picture}" alt="{profile.name}'s Profile Picture">
			  <span>{profile.name}</span>
		  </div>
		  {/each}
	  </div>
	  {/if}
	  -->
	</div>
</div>

<style>
	.profile-page {
		display: flex;
		justify-content: center;
	}

	.container {
		font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #fafafa;
		width: 1000px;
		margin: 20px;
		padding: 20px;
		background-color: rgba(194, 237, 156, 0.941);
		border-radius: 12px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.profile-header {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.profile-picture {
		border: 3px solid #000;
		border-radius: 50%;
		width: 120px;
		height: 120px;
		margin-right: 20px;
		object-fit: cover;
		transform: translateY(-5%);
	}

	.profile-info {
		flex: 1;
	}

	.add-friend-button {
		margin-top: 20px;
	}

	.pets-list {
		margin-left: 20px;
	}

	.connection-path {
		display: flex;
		justify-items: center;
		align-items: center;
		gap: 15px;
	}

	.you:hover {
		background-color: none;
	}

	.arrow {
		font-size: 30px;
	}

	h1 {
		font-size: 32px;
		margin: 0;
		font-weight: bold;
	}

	.bio {
		font-size: 16px;
		margin: 0;
	}

	.stats {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.stats p {
		margin: 5px 0;
	}

	.friend-list {
		margin-top: 20px;
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.friend {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.friend:hover {
		background-color: gray;
	}

	a {
		text-decoration: none;
	}

	.friend-profile-picture {
		border-radius: 100px;
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-style: solid;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.action-button {
		background-color: #ccc; 
		color: black;
		padding: 10px 20px;
		border: 2px solid #000; 
		border-radius: 5px;
		margin: 0 10px;
		cursor: pointer;
	}

	.action-button:hover {
		background-color: #999; /* Darker Grey */
	}

	.action-button:focus {
		outline: none;
	}

	.connection-list {
		position: absolute;
		background-color: #fff;
		border: 1px solid #000;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		padding: 10px;
		z-index: 1;
		margin-top: 220px;
		width: 100%;
		left: 0;
	}

	.connection {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}

	.connection img {
		border-radius: 50%;
		margin-right: 10px;
		width: 30px;
		height: 30px;
		object-fit: cover;
	}

	.similar-profiles-button {
		margin-left: auto;
	}

	.profile-list{
		position: absolute;
		background-color: #fff;
		border: 1px solid #000;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		padding: 10px;
		z-index: 1;
		margin-top: 220px;
		width: 100%;
		left: 0;
	}

	.profile {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}

	.profile img {
		border-radius: 50%;
		margin-right: 10px;
		width: 30px;
		height: 30px;
		object-fit: cover;
	}


</style>
