// Here's the example of how to grab data from the backend and give it to the frontend

// Function name must have async
export async function load({params}) {

    // Fetch the data from the backend url ("/test" in this case)
    let databaseResult = await fetch("http://localhost:3000/test");
    // Format the data into json
    let json = await databaseResult.json();

    // Return a json object with the fetched data
    return {
        databaseResult: databaseResult
    };
}