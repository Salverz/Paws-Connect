const db = require("../../helper_files/database");
const router = require("express").Router();
const geolib = require('geolib');
const fetch = require('fetch');

// const searchRoute = require('./routes/search/search');
// app.use('/search', searchRoute);

async function getSearcherLocation(userID){
    const sql = 'SELECT location FROM user_profile WHERE user_id = ?';
    try{
        const [user] = await db.executeSQL(sql, [userID]);
        if(user){
            return user.location;
        }
    }catch(ERROR){
        console.error("Location for user is not found", ERROR);
    }
    return null;
}
async function fetchLocationAndUpdate(location){
    const apiKey = 'e700389f30b100907f2332b17bfea4c9';
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
    try{
        const reply = await fetch(url);
        const data = await reply.json();
        if(data.length > 0){
            const latitude = data[0].lat;
            const longitude = data[0].lon;

            const type = userId ? 'user_id' : 'pet_id';
            const typeId = userId || petId;

            let sql = `
            INSERT INTO location_lat_long (${type}, latitude, longitude)
            VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE
            latitude = VALUES(latitude),
            longitude = VALUES(longitude);`;

            const params = [typeId, latitude, longitude];

            await db.executeSQL(sql, params);
            return {latitude, longitude};
        }
    }catch(ERROR){
        console.error("Coordinates not found for location", ERROR);
    };
    return null;
}



// Search pet profiles
router.get("/pet", async (req, res) => {
    const {name = "", species = "", breed = "", color = "", ownerUsername = ""} = req.query;

    const searcherID = req.userID;
    const locationName = await getSearcherLocation(searcherID);
    const searcherLocation = await fetchLocationAndUpdate(locationName);
    
    let sql = `
    SELECT p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, u.username AS owner_username, lll.latitude, lll.longitude
    FROM pet_profile p
    JOIN user_account u ON p.owner_user_id = u.user_id
    LEFT JOIN location_lat_long lll ON p.pet_id = lll.pet_id
    WHERE p.name LIKE ?
    AND p.species LIKE ?
    AND p.breed LIKE ?
    AND (p.color LIKE ? OR ? = '')
    AND u.username LIKE ?`;

    const params = [
        `%${name}%`,
        `%${species}%`,
        `%${breed}%`,
        color,
        color,
        `%${ownerUsername}%`
    ];

    try {
        const rows = await db.executeSQL(sql, params);

        const distanceFilter = async (row) => {
            if (!row.location) return false;
            const rowLocation = await fetchLocationAndUpdate(row.location);
            if (!rowLocation) return false;
            return geolib.getDistance(
                { latitude: searcherLocation.latitude, longitude: searcherLocation.longitude },
                { latitude: rowLocation.latitude, longitude: rowLocation.longitude }
            ) <= 500 * 1609.34; // 500 miles in meters
        };

        const filterResults = await Promise.all(rows.map(row => distanceFilter(row)));
        const filteredRows = rows.filter((_, index) => filterResults[index]);

        res.json(filteredRows);
    } catch (error) {
        console.error("Error executing pet profile search:", error);
        res.status(500).send("An error occurred while fetching pet profiles.");
    }
});
// Search user profiles
router.get("/user", async (req, res) => {
    const {username = "", displayName = "", language = ""} = req.query;
    
    const searcherID = req.userID;
    const locationName = await getSearcherLocation(searcherID);
    const searcherLocation = await fetchLocationAndUpdate(locationName);
    
    let sql = `
    SELECT u.username, up.display_name, up.profile_picture, up.preferred_language, up.user_id, lll.latitude, lll.longitude
    FROM user_account u
    JOIN user_profile up ON u.user_id = up.user_id
    LEFT JOIN location_lat_long lll ON u.user_id = lll.user_id
    WHERE u.username LIKE ?
    AND up.display_name LIKE ?
    AND up.preferred_language LIKE ?`;

    const params = [`%${username}%`, `%${displayName}%`, `%${language}%`];

    try {
        const rows = await db.executeSQL(sql, params);

        const filteredRowsPromises = rows.map(async row => {
            if (row.latitude && row.longitude) {
                const distance = geolib.getDistance(
                    { latitude: searcherLocation.latitude, longitude: searcherLocation.longitude },
                    { latitude: row.latitude, longitude: row.longitude }
                );
                return distance <= 500 * 1609.34 ? row : null; // 500 miles converted to meters
            }
            return null;
        });


        const filteredRows = (await Promise.all(filteredRowsPromises)).filter(row => row !== null);

        res.json(filteredRows);
    } catch (error) {
        console.error("Error executing user profile search:", error);
        res.status(500).send("An error occurred while fetching user profiles.");
    }
});
module.exports = router;
