const express = require('express');
const router = express.Router();
const defunciones =require('../models/Defuncion');
const { isAuthenticated } = require('../helpers/auth');

const passport = require('passport');



// GRAFICAS DEFUNCIONES
router.get('/defun/graficas', (req, res) => {
    res.render('defunciones/graficas-defunciones');
});

router.post('/defun/datos/graficas', async(req, res) => {
    let datoGrafica=req.body.datoGrafica ;
    if (datoGrafica == 1) {
        const defuncion = await defunciones.aggregate([{$group:{_id:'$mes_fall',total:{$sum:1}}}]);
        res.send(defuncion);
    }else if (datoGrafica == 2) {
        const defuncion = await defunciones.aggregate([{$group:{_id:'$etnia',total:{$sum:1}}}]);
        res.send(defuncion);  
    }else if (datoGrafica == 3) {
        const defuncion = await defunciones.aggregate([{$group:{_id:'$edad_mad',total:{$sum:1}}}]).sort({edad_mad:"desc"});
        res.send(defuncion);
    }else if (datoGrafica == 4) {
        const defuncion = await defunciones.aggregate([{$group:{_id:'$area_fall',total:{$sum:1}}}]);
        res.send(defuncion);
    }else if (datoGrafica == 5) {
        const defuncion = await defunciones.aggregate([{$group:{_id:'$nom_pais',total:{$sum:1}}}]);
        res.send(defuncion);
    }else{
        res.send("falso");
        
    }
  
    
});

//INGRESO DE DEFUNCIONES



router.get('/defunciones/registro', (req, res) => {
    res.render('defunciones/defunciones-signup');
})

router.post('/defunciones/registro', async(req, res) => {
    let errors = [];
    const { name, residencia, email, password, confirm_password } = req.body;
    res.send(name)
   /* if (password != confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }
    if (name.length < 1) {
        errors.push({ text: "Ingrese un nombre." });
    }
    if(email.length<3){
        errors.push({ text: "Ingrese un email." });
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
    }*/
});




module.exports = router