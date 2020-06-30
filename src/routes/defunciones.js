const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');

const passport = require('passport');




router.get('/defun/ini', isAuthenticated, (req, res) => {


    res.render('admin/all-users');
})



module.exports = router