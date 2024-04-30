<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import NavBar from "../../lib/components/NavBar.svelte";
	import { onMount } from "svelte";
    let posts = [];
	let tags = [];

    async function getPosts() {
    try { 
        let response = await fetch ("http://localhost:3000/post/get/dave");
        if (response.status === 401) {
            console.error("Unauthorized")
            window.location.href = 'account/create';
            return
        }
  
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

    } catch (error) {
        console.error('Error getting post', error);
    }
    }

    onMount(async () => {
        await getPosts();
    });
</script>

<SiteHeader/>
<NavBar/>
<div class="feed">
    {#each posts as post}
        <div class="post">
            <div class="poster-profile-section">
                <img class="poster-profile-picture" src={post.poster_profile_picture}>
                <a href="/user/profile/{post.poster_user_id}"><h1>{post.poster_username}</h1></a>
            </div>
			<p>Tagged pets:</p>
			{#each post.tags as taggedPet}
				<img class="tagged-pet-profile-picture" src={taggedPet.profile_picture}>
				<a href="/pets/profile/{taggedPet.tagged_pet_id}">{taggedPet.name}</a>
			{/each}
            <img class="post-photo" src="{post.post_photo_link}">
            <p class="post-text">{post.text_content}</p>
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
        margin: 10px 5%;
		border-style: solid;
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
