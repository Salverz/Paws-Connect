<!-- This page will be for the "create account" feature -->
<!-- It should have a POST method form that sends username and password data to the backend to create an account -->
<!-- This page will have a very similar structure to the +page.svelte in /account/edit -->
<a href="/account/edit">Edit an existing account</a>
<br>
<br>

<h1>Create a new account</h1>
<!-- TODO: Edit this form so that it sends a post request to the /account/create route on the backend -->
<form action="http://localhost:3000/account/create" method="post">
    <!-- EXAMPLE: create a username input -->
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">
    <br>

    <!-- TODO: create a password input-->
    <label for="password">Password:</label>
    <input type="password" id="password" name="password">
    <br>
    
    <!-- TODO: create a display name input-->
    <label for="displayName">Display Name:</label>
    <input type="text" id="displayName" name="displayName">
    <br>

    <!-- TODO: create a profile picture link input-->
    <label for="profilePicture">Profile Picture Link:</label>
    <input type="text" id="profilePicture" name="profilePicture">
    <br>

    <!-- TODO: create a geographical location input-->
    <label for="location">Geographical Location:</label>
    <input type="text" id="location" name="location">
    <br>

    <!-- TODO: create a preferred language input-->
    <label for="preferredLanguage">Preferred Language:</label>
    <input type="text" id="preferredLanguage" name="preferredLanguage">
    <br>

    <!-- TODO: create a submit button -->
    <button type="submit">Create Account</button>
</form>
<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->