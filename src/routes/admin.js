const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../helpers/auth');


router.get('/admin/usersAll', isAuthenticated, async(req, res) => {
    const usuarios = await User.find({ role: "User" }).lean().sort({ date: "desc" });
    const tamaño = usuarios.length
    res.render("admin/all-users", {
        user: req.user.name,
        usuarios,
        tamaño
    });

});

router.delete('/user/delete/:id', isAuthenticated, async(req, res) => {

    await User.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Usuario borrado satifactoriaente ");
    res.redirect("/admin/usersAll");
});


module.exports = router