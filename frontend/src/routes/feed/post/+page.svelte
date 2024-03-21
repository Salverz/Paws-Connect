<script>
    import SiteHeader from "$lib/components/SiteHeader.svelte";
    let postPicture;
</script>

<SiteHeader/>
<h1>Create a post</h1>

<form method="POST" action="http://localhost:3000/post/create">
    <div class="input-section">
        <label for="username">Username</label>
        <input id="username" name="username">

    </div>
    <div class="input-section">
        <label for="postText">Caption</label>
        <textarea id="postText" name="postText" rows="4" cols="50"></textarea>
    </div>
    <div class="input-section">
        <label for="postImage">Picture</label>
        <input id="postImage" name="postImage" bind:value={postPicture}>
    </div>
    <img src={postPicture}>
    <button>Create post</button>
</form>

<style>
    form {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
</style>