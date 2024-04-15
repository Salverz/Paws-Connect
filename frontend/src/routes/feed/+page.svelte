<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import NavBar from "../../lib/components/NavBar.svelte";
	import { onMount } from "svelte";
    let posts = [];
	let tags = [];

    async function getPosts() {
        let response = await fetch("http://localhost:3000/post/get/dave");
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

    onMount(async () => {
        await getPosts();
    });
</script>

<SiteHeader/>
<h1>Feed</h1>
<NavBar/>
<div class="feed">
    {#each posts as post}
        <div class="post">
            <div class="poster-profile-section">
                <img class="poster-profile-picture" src={post.poster_profile_picture}>
                <a href="/user/profile/{post.poster_user_id}"><h1>{post.poster_username}</h1></a>
            </div>
            <p class="post-text">{post.text_content}</p>
            <img class="post-photo" src="{post.post_photo_link}">


			<p>Tagged pets:</p>
			{#each post.tags as taggedPet}
				<img class="tagged-pet-profile-picture" src={taggedPet.profile_picture}>
				<a href="/pets/profile/{taggedPet.tagged_pet_id}">{taggedPet.name}</a>
			{/each}

            <div class="post-information-section">
                <p class="likes">{post.likes} likes</p>
                <p>Posted on {post.created_at.split("T")[0]} at {post.created_at.split("T")[1]}</p>
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
        padding: 10px;
        width: 50%;
        margin: 10px 0px;
    }

    .poster-profile-section {
        display: flex;
        align-items: center;
    }

    .poster-profile-picture {
        height: 50px;
        border-radius: 100px;
        border-style: solid;
        border-width: 2px;
        margin-right: 10px;
    }

    .post-text {
        margin: 0 5%;
    }

    .post-photo {
        width: 90%;
        padding: 10px 5%;
    }

    .post-information-section {
        display: flex;
        align-items: center;
        margin: 0 5%;
    }

    .likes {
        margin: 0px 10px;
    }

	.tagged-pet-profile-picture {
		width: 100px;
	}
</style>
