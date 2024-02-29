export async function load({params}) {
    const response = await fetch('http://localhost:3000/account/create');
    const json = await response.json();
    
    data = json.response;

    return {    
        "setup": data
    }
}