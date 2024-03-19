<script>
    // Need to have this to have access to the json from the +page.js file
    // export let data;
</script>

<h1>account page</h1>

<!-- Use a form to make a POST request and send data back to the server's "/login" POST route -->
<form action="http://localhost:3000/login" method="POST">
    <!-- Username field -->
    <!-- Must have id and name = username -->
    <input type="text" id="username" name="username">
    <!-- Input type submit is just a button that will send the data to the backend for us -->
    <input type="submit">
</form>


<!-- TYPE "npm run dev" IN THE CONSOLE TO RUN THE WEBSITE -->
<!-- WHEN YOU SAVE A FILE, YOUR CHANGES SHOULD SHOW ON THE WEBSITE -->