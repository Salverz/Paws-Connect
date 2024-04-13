<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
	import NavBar from "../../../lib/components/NavBar.svelte";
    let postPicture;
</script>

<SiteHeader/>
<h1>Create a post</h1>

<NavBar/>
<form method="POST" action="http://localhost:3000/post/create">
    <div class="input-section">
        <label for="userID">user ID</label>
        <input id="userID" name="userID">

    </div>
    <div class="input-section">
        <label for="text_content">Caption</label>
        <textarea id="text_content" name="text_content" rows="4" cols="50"></textarea>
    </div>
    <div class="input-section">
        <label for="post_photo_link">Picture</label>
        <input id="post_photo_link" name="post_photo_link" bind:value={postPicture}>
    </div>
    <div class="input-section">
        <label for="visibility">Visability</label>
        <input id="visibility" name="visibility">
    </div>
    <div class="input-section">
        <label for="post_language">Post language</label>
        <input id="post_language" name="post_language">
    </div>
    <button>Create post</button>
    <img src={postPicture}>
</form>

<style>
    form {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
</style>
