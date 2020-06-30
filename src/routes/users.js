const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/usuario/login', (req, res) => {

    res.render('users/signin');
})

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

router.get('/usuario/login/succes', isAuthenticated, (req, res) => {

    if (req.user.role == "Admin") {
        res.render("admin/admin-menu");
    } else {
        res.render("/users/user-menu");
    }
})



router.post('/usuario/login', passport.authenticate('local', {

    successRedirect: '/usuario/login/succes',
    failureRedirect: '/usuario/login',
    failureFlash: true
}));

router.get('/usuario/registro', (req, res) => {
    res.render('users/signup');
})

router.post('/usuario/registro', async(req, res) => {
    let errors = [];
    const { name, residencia, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }
    if (name.length < 1) {
        errors.push({ text: "Ingrese un nombre." });
    }
    if (residencia.length < 1) {
        errors.push({ text: "Ingrese una residencia." });
    }
    if (password.length < 4) {
        errors.push({ text: "La contraseña debe ser mayor a 4 caracteres." });
    }
    if (errors.length > 0) {
        res.render("users/signup", {
            errors,
            name,
            email,
            password,
            confirm_password,
            residencia
        });
    } else {
        // Look for email coincidence
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash("error_msg", "El email ya esta en uso.");
            res.redirect("/usuario/registro");
        } else {
            // Saving a New User
            const newUser = new User({ name, email, password, residencia });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash("success_msg", "estas registrado.");
            res.redirect("/usuario/login");
        }
    }
})

module.exports = router