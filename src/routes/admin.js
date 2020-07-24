const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

    if (req.user.role == "Admin") {
        const usuarios = await User.find({ role: "Entidad" }).lean().sort({ date: "desc" });

    res.render("admin/all-entidades", {
        user: req.user.name,
        usuarios
     
    });

    }else if(req.user.role=='User') {
        
            const usuarios = await User.find({ role: "Entidad" },["name","email","residencia"]).lean().sort({ date: "desc" });
    
        res.render("users/all-entidades", {
            user: req.user.name,
            usuarios
         
        });
    }else {
            const usuarios = await User.find({ role: "Entidad" },["name","email","residencia"]).lean().sort({ date: "desc" });
    
        res.render("users/all-entidades", {
            user: req.user.name,
            usuarios
         
        });
    }
    
});
//defun-entidad
router.get('/admin/allentidad/defunciones', isAuthenticated, async(req, res) => {

    const usuarios = await User.find({ role: "Entidad" }).lean().sort({ date: "desc" });

    res.render("admin/entidades-defun", {
        user: req.user.name,
        usuarios
     
    });
});

router.delete('/admin/delete/:id', isAuthenticated, async(req, res) => {

    await User.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Entidad borrada satifactoriaente ");
    res.redirect("/admin/entidadAll");
});


//defunciones
//********************************************************************
//********************************************************************




//REPORTES
//********************************************************************
//********************************************************************
    
   
  
router.get('/admin/reportes', isAuthenticated, async(req, res) => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
     if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    
    today = yyyy+'-'+mm+'-'+dd;
    res.render("defunciones/reportes",{today});
 
});

router.post('/admin/reportes', isAuthenticated, async(req, res) => {
    var parametro=req.body.Parametro;
    if (parametro=="dia") { 
        var dia=req.body.dia;
        const causas = await defunciones.aggregate([
            {$match:{"fecha_insc":dia}},  
            {$group:{_id:"$causa_fetal",total:{$sum:1}}}
        ]);
        const etnia = await defunciones.aggregate([
            {$match:{"fecha_insc":dia}},  
            {$group:{_id:"$etnia",total:{$sum:1}}}
        ]);
        const instruccion = await defunciones.aggregate([
            {$match:{"fecha_insc":dia}},  
            {$group:{_id:"$niv_inst",total:{$sum:1}}}
        ]);
        const prov = await defunciones.aggregate([
            {$match:{"fecha_insc":dia}},  
            {$group:{_id:"$prov_fall",total:{$sum:1}}}
        ]);
        res.send({causas,etnia,instruccion,prov});
    }else if(parametro=="mes"){
        var mes=req.body.mes;
        var año=parseInt(req.body.año);
        const causas = await defunciones.aggregate([
            {$match:{"mes_insc":mes,"anio_insc":año}},  
            {$group:{_id:"$causa_fetal",total:{$sum:1}}}
        ]);
        const etnia = await defunciones.aggregate([
            {$match:{"mes_insc":mes,"anio_insc":año}},  
            {$group:{_id:"$etnia",total:{$sum:1}}}
        ]);
        const instruccion = await defunciones.aggregate([
            {$match:{"mes_insc":mes,"anio_insc":año}},  
            {$group:{_id:"$niv_inst",total:{$sum:1}}}
        ]);
        const prov = await defunciones.aggregate([
            {$match:{"mes_insc":mes,"anio_insc":año}},  
            {$group:{_id:"$prov_fall",total:{$sum:1}}}
        ]);
        res.send({causas,etnia,instruccion,prov});
    }else{
        
        var año=parseInt(req.body.año);
        const causas = await defunciones.aggregate([
            {$match:{"anio_insc":año}},  
            {$group:{_id:"$causa_fetal",total:{$sum:1}}}
        ]);
        const etnia = await defunciones.aggregate([
            {$match:{"anio_insc":año}},  
            {$group:{_id:"$etnia",total:{$sum:1}}}
        ]);
        const instruccion = await defunciones.aggregate([
            {$match:{"anio_insc":año}},  
            {$group:{_id:"$niv_inst",total:{$sum:1}}}
        ]);
        const prov = await defunciones.aggregate([
            {$match:{"anio_insc":año}},  
            {$group:{_id:"$prov_fall",total:{$sum:1}}}
        ]);
        res.send({causas,etnia,instruccion,prov});

    }
    
    
 
});

module.exports = router