<!-- This is the page for modifying the user profile -->
<!-- It should use the data it got from the backend to show the current user profile data -->
<!-- The user can change the data, then send that new data back to the backend to be updated in the database -->


<!--  We want to fill in pre-fill-in the input fields with the data we got from +page.js -->

<!-- TODO: make this form send a POST request to the /account/edit route so that the backend -->
<!-- can update the user's profile with the new information -->
<h1>Edit your profile</h1>
<form>
    <!-- TODO: Put the user's id in here so the backend knows what account to update -->
    <input type="hidden" id="userId" name="userId" value={}>

    <!-- TODO: Pre-fill-in with the display name -->
    <input type="text" id="displayName" name="displayName" value={}>

    <!-- TODO: Pre-fill-in with the profile picture link -->
    <input type="text" id="profilePictureRef" name="profilePictureRef" value={}>

    <!-- TODO: Pre-fill-in with the current location -->
    <input type="text" id="profilePictureRef" name="profilePictureRef" value={}>

    <!-- TODO: Pre-fill-in with the geographical location -->
    <input type="text" id="currentLocation" name="currentLocation" value={}>

    <!-- TODO: Pre-fill-in with the preferred language -->
    <input type="text" id="preferredLanguage" name="preferredLanguage" value={}>

    <!-- TODO: make a submit button that will submit the form to send the new profile info to the backend -->
</form>

<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->