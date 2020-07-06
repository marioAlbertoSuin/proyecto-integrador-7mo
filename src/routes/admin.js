const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Entidad =require('../models/Entidad');
const defunciones =require('../models/Defuncion');
const { isAuthenticated } = require('../helpers/auth');




// USUARIOS
router.get('/admin/usersAll', isAuthenticated, async(req, res) => {
    const usuarios = await User.find({ role: "User" }).lean().sort({ date: "desc" });
  
    res.render("admin/all-users", {
        user: req.user.name,
        usuarios
   
    });

});

router.delete('/user/delete/:id', isAuthenticated, async(req, res) => {

    await User.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Usuario borrado satifactoriaente ");
    res.redirect("/admin/usersAll");
});


//entidades


router.get('/admin/entidadAll', isAuthenticated, async(req, res) => {
    const usuarios = await Entidad.find({ role: "Entidad" }).lean().sort({ date: "desc" });

    res.render("admin/all-entidades", {
        user: req.user.name,
        usuarios
     
    });

});


router.delete('/admin/delete/:id', isAuthenticated, async(req, res) => {

    await Entidad.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Entidad borrada satifactoriaente ");
    res.redirect("/admin/entidadAll");
});


//defunciones



    
   
  




module.exports = router