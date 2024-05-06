<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import NavBar from "../../lib/components/NavBar.svelte";
	import { checkAuthenticated } from "$lib/functions/authentication"
	import { onMount } from "svelte";

    let posts = [];
	let tags = [];

	let token;

	async function getPosts() {
		const token = localStorage.getItem("token");
		const response = await fetch("http://localhost:3000/post/get",
			{ headers: { 'Authorization': `Bearer ${token}` }});
			let json = await response.json();
			console.log(json.posts);
			console.log(json.tags);
			posts = json.posts;
			tags = json.tags;

			for (let i = 0; i < tags.length; i++) {
				for (let j = 0; j < posts.length; j++) {
					if (!posts[j].tags) {
						posts[j].tags = [];
					}
					if (tags[i].tagged_post_id == posts[j].post_id) {
						posts[j].tags.push(tags[i]);
					}
				}
			}
			console.log(posts);

	}

	function swapLanguages(index) {
		console.log(index);
		console.log(posts[index]);

		const temp = posts[index].text_content;
		posts[index].text_content = posts[index].translated_text;
		posts[index].translated_text = temp;
		posts[index].translated = !posts[index].translated;
	}

    onMount(async () => {
		token = await checkAuthenticated();
        await getPosts();
    });
</script>

<SiteHeader/>
<NavBar/>
<div class="feed">
    {#each posts as post, index}
        <div class="post">
			<a class="poster-profile-section" href="/user/profile/{post.poster_user_id}">
				<img class="poster-profile-picture" src={post.poster_profile_picture}>
				<h1>{post.poster_username}</h1>
			</a>
			<div class="tagged-pets">
				{#each post.tags as taggedPet}
					<a class="tagged-pet" href="/pets/profile/{taggedPet.tagged_pet_id}">
						<img class="tagged-pet-profile-picture" src={taggedPet.profile_picture}>
						{taggedPet.name}
					</a>
				{/each}
			</div>
			<div class="post-photo-area">
				<img class="post-photo" src="{post.post_photo_link}">
			</div>
			<div class="post-text-section">
				<p class="post-text">{post.text_content}</p>
				<p class="created-at">Posted on {post.created_at_date} at {post.created_at_time}</p>
			</div>
			{#if post.post_language != post.preferred_language}
				<div class="translate-post">
					{#if !post.translated}
						<button on:click={ () => swapLanguages(index) }>Translate this post to {post.preferred_language.charAt(0).toUpperCase() + post.preferred_language.slice(1).toLowerCase()}</button>
					{:else}
						<button on:click={ () => swapLanguages(index) }>View original</button>
					{/if}
				</div>
			{/if}
            <div class="post-information-section">
				<!-- <p class="likes">{post.likes} likes</p> -->
            </div>
        </div>
    {/each}
</div>

<style>
    .feed {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .post {
        border-style: solid;
        border-radius: 10px;
		padding: 25px 5%;
        width: 50%;
        margin: 10px 0px;
		background-color: lightgray;
    }

	a {
		height: 100%;
		text-decoration: none;
	}

    .poster-profile-section {
        display: flex;
		width: auto;
    }

	.poster-profile-section:hover {
		background-color: gray;
	}

    .poster-profile-picture {
        height: 50px;
		width: 50px;
		object-fit: cover;
        border-radius: 100px;
        border-style: solid;
        border-width: 2px;
        margin-right: 10px;
    }

	.post-text-section {
		background-color: #adadad;
		border-radius: 10px;
		padding: 2px 15px;
	}

    .post-text {
    }

	.post-photo-area {
		display:flex;
		justify-content: center;
	}

    .post-photo {
        margin: 10px 0%;
		max-width: 100%;
		border-style: solid;
    }

    .post-information-section {
        display: flex;
        align-items: center;
    }

    .likes {
        margin: 0px 10px;
    }

	.tagged-pet-label {
		margin: 0 0 10px 0;
	}

	.tagged-pets {
		display: flex;
		gap: 20px;
	}

	.tagged-pet {
		padding: 10px;
		display: flex;
		flex-direction: column;
	}

	.tagged-pet:hover {
		background-color: gray;
	}

	.tagged-pet-profile-picture {
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-style: solid;
		border-width: 1px;
		border-radius: 50%;
	}

	.translate-post {
		margin-top: 20px;
	}

	.created-at {
		font-size: 10px;
	}
</style>
