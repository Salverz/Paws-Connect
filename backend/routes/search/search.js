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
async function fetchLocationAndUpdate(location, userId = null, petId = null){
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
    const {petId = "", petName = "", distance = ""} = req.query;

    const searcherID = req.userID;
    const locationName = await getSearcherLocation(searcherID);
    const searcherLocation = await fetchLocationAndUpdate(locationName);
    
    let sql = `
    SELECT p.pet_id, p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, lll.latitude, lll.longitude
    FROM pet_profile p
    LEFT JOIN location_lat_long lll ON p.pet_id = lll.pet_id
    WHERE (p.pet_id = ? OR p.name LIKE ?)`;

    const params = [petId, `%${petName}%`];

    try {
        const rows = await db.executeSQL(sql, params);

        // Apply distance filtering if distance is specified
        if (distance && searcherLocation) {
            const maxDistanceMeters = distance * 1609.34; // Convert miles to meters
            const filteredRows = rows.filter(row => {
                if (row.latitude && row.longitude) {
                    return geolib.getDistance(
                        { latitude: searcherLocation.latitude, longitude: searcherLocation.longitude },
                        { latitude: row.latitude, longitude: row.longitude }
                    ) <= maxDistanceMeters;
                }
                return false;
            });
            res.json(filteredRows);
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error("Error executing pet profile search:", error);
        res.status(500).send("An error occurred while fetching pet profiles.");
    }
});
// Search user profiles
router.get("/user", async (req, res) => {
    const {username = "", displayName = "", distance = ""} = req.query;
    
    const searcherID = req.userID;
    const locationName = await getSearcherLocation(searcherID);
    const searcherLocation = await fetchLocationAndUpdate(locationName);
    
    let sql = `
    SELECT u.username, up.display_name, up.profile_picture, up.location, lll.latitude, lll.longitude
    FROM user_account u
    JOIN user_profile up ON u.user_id = up.user_id
    LEFT JOIN location_lat_long lll ON u.user_id = lll.user_id
    WHERE (u.username LIKE ? OR up.display_name LIKE ?)`;

    const params = [`%${username}%`, `%${displayName}%`];

    try {
        const rows = await db.executeSQL(sql, params);

        // Apply distance filtering if distance is specified
        if (distance && searcherLocation) {
            const maxDistanceMeters = distance * 1609.34; // Convert miles to meters
            const filteredRows = rows.filter(row => {
                if (row.latitude && row.longitude) {
                    return geolib.getDistance(
                        { latitude: searcherLocation.latitude, longitude: searcherLocation.longitude },
                        { latitude: row.latitude, longitude: row.longitude }
                    ) <= maxDistanceMeters;
                }
                return false;
            });
            res.json(filteredRows);
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error("Error executing user profile search:", error);
        res.status(500).send("An error occurred while fetching user profiles.");
    }
});
module.exports = router;
