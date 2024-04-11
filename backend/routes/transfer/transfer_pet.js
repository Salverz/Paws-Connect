const db = require("../../helper_files/database");
const router = require("express").Router();

router.patch("/transfer", async (req, res)=> {
    const{} = req.query;
    let sql = `
    SELECT `;

    const params = [`%${}%`, `%${}%`, `%${}%`];

    try{

    }catch(ERROR){

    }
});

module.exports = router;
