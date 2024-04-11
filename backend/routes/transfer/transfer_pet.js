const db = require("../../helper_files/database");
const router = require("express").Router();

router.patch("/transfer", async (req, res)=> {
    const{} = req.query;
    let sql = `
    SELECT `;

    const params = [`%${}%`, `%${}%`, `%${}%`];

    try{

    }catch(ERROR){
        console.error("Error transferring pet to new user:", ERROR);
        res.status(500).send("An error occurred while transferring pet.");
    }
});

module.exports = router;
