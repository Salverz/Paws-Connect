const router = require('express').Router();

// Router files
const profileRoute = require('./profile/profile');

// Routers
router.use('/profile', profileRoute);

// Create a new pet
// (accessed at [POST] http://localhost:3000/pet/create)
router.post("/create", async (req, res) => {

});

// Remove a pet
// (accessed at [DELETE] http://localhost:3000/pet/remove)
router.delete("/remove", async (req, res) => {

});

module.exports = router;