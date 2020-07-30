const express = require('express');
const router = express.Router();
const defunciones =require('../models/Defuncion');


router.get('/',async(req, res) => {
    const causa= await defunciones.aggregate([{$group:{_id:'$causa_fetal',total:{$sum:1}}},{$sort:{total:-1}},{$limit:10}]);
    res.render("index",{causa});
})

router.get('/about', (req, res) => {
    res.render("about");
})

module.exports = router 