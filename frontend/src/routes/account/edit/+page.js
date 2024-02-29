// Here, we should grab the user's profile data from the backend so we can display it on the front end
// Refer to EXAMPLE/+page.jsfor an example of how to fetch the data. From there, we can access our 
// fetched data using the "data" variable in +page.svelte.
// Function name must have async
export async function load({params}) {

    // Fetch the data from the backend (/account/info/[userId] in this case, put the user's userId, in the [userId] slot)
    // let databaseResult = 

    // Format the data into json
    //let json = 

    // Return a json object with the fetched data
    return {
        "displayName": "",
        "profilePictureRef": "",
        "currentLocation": "",
        "preferredLanguage": ""
    };
}