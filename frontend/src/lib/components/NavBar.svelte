<div class="nav-bar">
    <a class="nav-link" href="/">Home</a>
    <a class="nav-link" href="/feed">Feed</a>
    <a class="nav-link" href="/">View Pets</a>
    <a class="nav-link" href="/account/edit">Edit Account</a>
</div>

<style>
    .nav-bar {
        /* Flexbox */
        display: flex;
        flex-direction: column;

        width: 300px;
        margin-left: 50px;
    }

    .nav-link {
        background-color: rgb(221, 221, 221);
        padding-left: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        outline-style: solid;
        outline-width: 1px;
        /* border-top-left-radius: 10px;
        border-bottom-left-radius: 10px; */

        /* Text styles */
        text-decoration: none;
        font-family: 'Segoe UI';
        color: black;

        /* Animation */
        transition: transform .2s ease,
                    background-color .2s ease;
                    /* margin-top .5s ease, */
                    /* margin-bottom .5s ease; */
    }

    .nav-link:hover {
        background-color: rgb(168, 168, 168);
        transform: translateX(-20px);
        background-color: rgb(175, 175, 175);
        /* padding-bottom: 15px;
        padding-top: 15px; */
        /* margin-top: 10px; */
        /* margin-bottom: 10px; */
    }
</style>