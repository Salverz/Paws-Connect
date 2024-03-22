<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import { onMount } from "svelte";
    let posts = [
        {
            "post_id": 1,
            "poster_username": "David",
            "poster_profile_picture": "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
            "text_content": "Say hi to Sparky!",
            "visability": "public",
            "created_at": "2024-3-18 15:30:45",
            "post_language": "English",
            "post_photo_link": "https://www.millardveterinaryclinics.com/sites/default/files/styles/large/public/breeds/labrador-retriever-dog-breed-info_0.jpg",
            "likes": 20,
        },
        {
            "post_id": 2,
            "poster_username": "Josh",
            "poster_profile_picture": "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
            "text_content": "A fun day at the beach!",
            "visability": "public",
            "created_at": "2024-2-11 13:12:58",
            "post_language": "English",
            "post_photo_link": "https://drupal8-prod.visitcalifornia.com/sites/drupal8-prod.visitcalifornia.com/files/VC_8GreatCaliforniaDogBeaches_Rosies_PascalShirley_C0A0231_1280x640.jpg",
            "likes": 14,
        }
    ];

    async function getPosts() {
        let response = await fetch("http://localhost:3000/post/get/dave");
        let json = await response.json();
        console.log(json.posts);
        posts = json.posts;
    }

    onMount(async () => {
        await getPosts();
    });
</script>

<SiteHeader/>
<h1>Feed</h1>
<a href="/feed/post">Create a new post!</a>
<div class="feed">
    {#each posts as post}
        <div class="post">
            <div class="poster-profile-section">
                <img class="poster-profile-picture" src={post.poster_profile_picture}>
                <a href="/user/profile/{post.poster_username}"><h1>{post.poster_username}</h1></a>
            </div>
            <p class="post-text">{post.text_content}</p>
            <img class="post-photo" src="{post.post_photo_link}">
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
</style>