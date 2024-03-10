<div >
    <form class="create-account-card" action="http://localhost:3000/account/create" method="post">
        <div class="input-block">
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
        </div>

        <div class="input-block">
            <label for="password">Password</label>
            <input type="password" id="password" name="password">
        </div>
    
        <!-- <label for="displayName">Display Name:</label>
        <input type="text" id="displayName" name="displayName">

        <label for="profilePicture">Profile Picture Link:</label>
        <input type="text" id="profilePicture" name="profilePicture">

        <label for="location">Geographical Location:</label>
        <input type="text" id="location" name="location">

        <label for="preferredLanguage">Preferred Language:</label>
        <input type="text" id="preferredLanguage" name="preferredLanguage"> -->

        <button>Create Account</button>
    </form>
    <div class="google">
        <a>Sign in with Google</a>
    </div>
</div>


<style>
    .create-account-card {
        /* Text properties */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

        /* Flexbox */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgb(224, 224, 224);
        padding: 30px;
        border-radius: 5px;
    }

    .input-block {
        /* Flexbox */
        display: flex;
        flex-direction: column;

        margin: 20px 0px;
    }

    label {
        /* Text properties */
        font-size: 15px;
        color: rgb(76, 76, 76);

        margin-bottom: 3px;
    }

    input {
        width: 300px;
        height: 30px;
        border-radius: 5px;
        border-style: none;
    }

    button {
        background-color: rgb(134, 134, 134);
        padding: 10px 10px;
        color: white;
        border-radius: 5px;
        border-style: none;
    }

    button:hover {
        background-color: rgb(157, 157, 157);
        cursor: pointer;
    }

    .google {
        padding: 10px;
        border-style: solid;
    }
</style>