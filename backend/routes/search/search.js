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
// Search pet profiles
router.get("/pet", async (req, res) => {
    const { petId = "", petName = "", distance = "" } = req.query;
    const searcherID = req.userID; // Use userID from the session or authentication context

    try {
        const [{ latitude: searcherLat, longitude: searcherLon }] = await db.executeSQL(
            `SELECT latitude, longitude FROM location_lat_long WHERE user_id = ?`, [searcherID]
        );

        let sql = `
        SELECT p.pet_id, p.name, p.profile_picture, p.species, p.breed, p.color, p.birth_date, lll.latitude, lll.longitude
        FROM pet_profile p
        JOIN location_lat_long lll ON p.pet_id = lll.pet_id
        WHERE (p.pet_id = ? OR p.name LIKE ?)`;

        const params = [petId, `%${petName}%`];
        const rows = await db.executeSQL(sql, params);

        const maxDistanceMeters = distance * 1609.34; // Convert miles to meters
        const filteredRows = rows.filter(row => {
            return geolib.getDistance(
                { latitude: searcherLat, longitude: searcherLon },
                { latitude: row.latitude, longitude: row.longitude }
            ) <= maxDistanceMeters;
        });

        res.json(filteredRows);
    } catch (error) {
        console.error("Error executing pet profile search:", error);
        res.status(500).send("An error occurred while fetching pet profiles.");
    }
});
// Search user profiles
router.get("/user", async (req, res) => {
    const { username = "", displayName = "", distance = "" } = req.query;
    const searcherID = req.userID;

    try {
        const [{ latitude: searcherLat, longitude: searcherLon }] = await db.executeSQL(
            `SELECT latitude, longitude FROM location_lat_long WHERE user_id = ?`, [searcherID]
        );

        let sql = `
        SELECT u.username, up.display_name, up.profile_picture, up.location, lll.latitude, lll.longitude
        FROM user_account u
        JOIN user_profile up ON u.user_id = up.user_id
        JOIN location_lat_long lll ON u.user_id = lll.user_id
        WHERE (u.username LIKE ? OR up.display_name LIKE ?)`;

        const params = [`%${username}%`, `%${displayName}%`];
        const rows = await db.executeSQL(sql, params);

        const maxDistanceMeters = distance * 1609.34; // Convert miles to meters
        const filteredRows = rows.filter(row => {
            return geolib.getDistance(
                { latitude: searcherLat, longitude: searcherLon },
                { latitude: row.latitude, longitude: row.longitude }
            ) <= maxDistanceMeters;
        });

        res.json(filteredRows);
    } catch (error) {
        console.error("Error executing user profile search:", error);
        res.status(500).send("An error occurred while fetching user profiles.");
    }
});
module.exports = router;
