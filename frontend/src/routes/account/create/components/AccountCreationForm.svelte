<div>
    <form class="create-account-card" action="http://localhost:3000/account/create" method="post">
        <h1 class="card-header">Create a new account</h1>
        <div class="input-block">
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
        </div>

        <div class="input-block">
            <label for="password">Password</label>
            <input type="password" id="password" name="password">
        </div>
    
        <button>Create Account</button>
        <div class="google">
            <a>Sign in with Google</a>
            <img class="google-logo-icon" alt="Sign in with google icon" src="/images/Google_G_logo.svg">
        </div>
</form>

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
        padding: 10px 30px 30px 30px;
        border-radius: 5px;
    }

    .card-header {
        font-size: 25px;
        width: 300px;
        font-weight: 350;
        margin-bottom: 40px;
    }

    .input-block {
        /* Flexbox */
        display: flex;
        flex-direction: column;

        margin-bottom: 20px;
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
        padding: 10px 0px;
        width: 220px;
        color: white;
        border-radius: 5px;
        border-style: none;
    }

    button:hover {
        background-color: rgb(157, 157, 157);
        cursor: pointer;
    }

    .google {
        /* Flexbox */
        display: flex;
        justify-content: center;
        gap: 10px;
        align-items: center;

        /* Text */
        color: white;

        margin-top: 20px;
        padding: 5px 0px;
        width: 220px;
        border-style: solid;
        border-radius: 5px;
        background-color: rgb(55, 126, 240);
        border-color: rgb(55, 126, 240);
    }

    .google-logo-icon {
        background-color: white;
        border-radius: 20px;
        padding: 4px;
        height: 15px;
    }
</style>