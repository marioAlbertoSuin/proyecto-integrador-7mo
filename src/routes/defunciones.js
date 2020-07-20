const express = require('express');
const router = express.Router();
const defunciones =require('../models/Defuncion');
const { isAuthenticated } = require('../helpers/auth');
const madres =require("../models/Madre");

const passport = require('passport');


//****************************************************************************
// GRAFICAS DEFUNCIONES
//****************************************************************************

router.get('/defunciones/generarGraficas/:parametros',isAuthenticated ,(req, res) => {
    let parametros=req.params.parametros;
    
    res.render('defunciones/graficas-defunciones',{parametros});
});

router.get('/defun/graficas',isAuthenticated ,(req, res) => {
    res.render('defunciones/menu-defunciones');
    //res.render('defunciones/graficas-defunciones');
});

router.post('/defun/datos/graficas', async(req, res) => {
    let {           
        parametro,
        año_fall,
        mes_fall,
        provFall,
        cantFall}=req.body;
    
    
    
    const año = await defunciones.aggregate([{$match:{"anio_fall":parseInt(año_fall)}},{$group:{_id:`$${parametro}`,total:{$sum:1}}}]);
    const mes = await defunciones.aggregate([{$match:{"mes_fall":mes_fall}},{$group:{_id:`$${parametro}`,total:{$sum:1}}}]);
    const provincia = await defunciones.aggregate([{$match:{"prov_fall":provFall}},{$group:{_id:`$${parametro}`,total:{$sum:1}}}]);
    const canton = await defunciones.aggregate([{$match:{"cant_fall":cantFall}},{$group:{_id:`$${parametro}`,total:{$sum:1}}}]);
    
        res.send({año,mes,provincia,canton})

    
});

//****************************************************************************
//INGRESO DE DEFUNCIONES
//****************************************************************************
router.get('/defunciones/registro',isAuthenticated ,async(req, res) => {
   
    res.render('defunciones/defunciones-signup');
});

router.post('/defunciones/registro', isAuthenticated,async(req, res) => {
    var codEntidad=String(req.user._id);
    
    let errors = [];
    var { sexo, sem_gest, fecha_fall, p_emb, asis_por , lugar_ocur ,prov_fall ,cant_fall,
        parr_fall ,area_fall ,causa_fetal, con_pren,Codmadre,fecha_insc 
        }  = req.body; 
    


    if(fecha_fall==""){
        errors.push({text:"Escoja la fecha de la defuncion"});
    }
    if(fecha_insc==""){
        errors.push({text:"Escoja la fecha de la inscripcion"});
    }

    if (causa_fetal.length < 10) {
        errors.push({ text: "Ingrese una causa fetal." });
    }

    if (prov_fall=='--') {
        errors.push({ text: "Escoja una opcion valida para la provincia del falleciminto." });
    } 
    if (cant_fall=='--') {
        errors.push({ text: "Escoja una opcion valida para el canton del falleciminto." });
    } 

    if (errors.length > 0) {
        res.render("defunciones/defunciones-signup", {
            errors,

        });
    } 
    else {
      
        
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
       var fechaFallecimiento = new Date(fecha_fall.replace(/-/g, '\/'))
       var dia_fall = fechaFallecimiento.getDate();
       var mes_fall = meses[fechaFallecimiento.getMonth()];
       var anio_fall = fechaFallecimiento.getFullYear();
       //////////////////////////////////////////////////
       var fechainscrip = new Date(fecha_insc.replace(/-/g, '\/'))
       var dia_insc = fechainscrip.getDate();
       var mes_insc= meses[fechainscrip.getMonth()];
       var anio_insc = fechainscrip.getFullYear();
       ////////////////////////////////////////////////////
       sem_gest = parseInt(sem_gest);
       con_pren=parseInt(con_pren);
       
        const defuncion = new defunciones({ sexo, sem_gest, fecha_fall, p_emb, asis_por , lugar_ocur ,prov_fall ,cant_fall,
            parr_fall ,area_fall ,causa_fetal,con_pren ,dia_fall,mes_fall,anio_fall,Codmadre,dia_insc,anio_insc,mes_insc});
         
            await defuncion.save();
            req.flash("success_msg", "estas registrado.");
            res.redirect("/usuario/login/succes");
        }
    
});
///////////////////////////////////////////////////////////////////////////////

router.post('/defunciones/registro/llenar-canton', async(req, res) => {
    let datoCanton=req.body.datoCanton ;
    
    const parroquias = await defunciones.aggregate([
        {$match:{prov_fall:datoCanton}},
        {$group:{_id:'$cant_insc'}}
        ]);
    res.send(parroquias);
    
});

router.post('/defunciones/registro/llenar-parroquia', async(req, res) => {
    let datoParroquia=req.body.datoParroquia ;
    
    const parroquias = await defunciones.aggregate([
        {$match:{cant_insc:datoParroquia}},
        {$group:{_id:'$parr_fall'}}
        ]);
    res.send(parroquias);
    
});


router.post('/defunciones/registro/llenar-madre', async(req, res) => {
       
    const madre = await madres.find({},["_id","nom_mad"]);
    res.send(madre);
    
});

/////////////////////////////////////////////////////////////////////////////////////


//****************************************************************************
//INGRESO DE MADRES
//****************************************************************************

router.get('/defunciones/madres/registro',isAuthenticated ,async(req, res) => {
   
    res.render('madres/madres-signup');
});

router.post('/defunciones/madres/registro',isAuthenticated ,async(req, res) => {

    var codEntidad=String(req.user._id);
    
    let errors = [];
    var { nom_mad, nac_mad ,nom_pais, fecha_mad , hij_viv ,hij_vivm ,
        hij_nacm  ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res
    }  = req.body; 
    

   
    if(fecha_mad==""){
        errors.push({text:"Escoja la fecha del nacimiento de la madre"});
    }else{
        
        var hoy = new Date();
        var cumpleanos = new Date(fecha_mad);
        var edad_mad = hoy.getFullYear() - cumpleanos.getFullYear();
        
    }


    if (nom_mad.length < 7) {
        errors.push({ text: "Ingrese un nombre y apellido." });
    }
    if(nom_pais.length<4){
        errors.push({ text: "Ingrese un pais." });
    }
    if (prov_res=='--') {
        errors.push({ text: "Escoja una opcion valida para la provincia de residencia." });
    } 
    if (cant_res=='--') {
        errors.push({ text: "Escoja una opcion valida para el canton de residencia." });
    } 
    if (errors.length > 0) {
        res.render("defunciones/defunciones-signup", {
            errors,

        });
    } 
    else {
      
        
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
       var fechaMadre = new Date(fecha_mad.replace(/-/g, '\/'))
       var dia_mad = fechaMadre.getDate();
       var mes_mad = meses[fechaMadre.getMonth()];
       var anio_mad = fechaMadre.getFullYear();
       hij_viv= parseInt(hij_viv);
       hij_vivm= parseInt(hij_vivm);
       hij_nacm=parseInt(hij_nacm);
  
       
        const madre = new madres({ nom_mad ,nac_mad ,nom_pais, fecha_mad , hij_viv ,hij_vivm ,
            hij_nacm ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res,dia_mad,mes_mad,anio_mad,edad_mad,codEntidad});
         
            await madre.save();
            req.flash("success_msg", "Madre Registrada.");
            res.redirect("/usuario/login/succes");
        }
    
});

//****************************************************************************
//GESTION DE DEFUNCIONES
//****************************************************************************


router.get('/defunciones/gestion-entidad', isAuthenticated, async(req, res) => {
    let id = req.user._id;
    const MADRES = await madres.find({ codEntidad: String(id) }).lean().sort({ date: "desc" });
  
    res.render("defunciones/defunciones-madres-gestion", {
        user: req.user.name,
        MADRES
   
    });

});

////////////////obtener madres desde entidad (admin)

router.get('/defunciones/gestion-ad-entidad/:id', isAuthenticated, async(req, res) => {
    let id = req.params.id;
    const MADRES = await madres.find({ codEntidad: String(id) }).lean().sort({ date: "desc" });
  
    res.render("defunciones/defunciones-madres-gestion", {
        user: req.user.name,
        MADRES
   
    });

});


///////////////////



//
//OBTENER TODAS LAS DEFUNCIONES POR MADRE
router.get('/defunciones/madres/:id', isAuthenticated, async(req, res) => {
    let id = req.params.id;
    
    const defuncion = await defunciones.find({ Codmadre: String(id) }).lean().sort({ date: "desc" });
  
    res.render("defunciones/defunciones-gestion-admin", {
        user: req.user.name,
        defuncion
   
    }); 
  

});

//delete defuncion
router.delete('/defunciones/delete/:id', isAuthenticated, async(req, res) => {

    await defunciones.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Defuncion borrada satifactoriaente ");
    res.redirect("/usuario/login/succes");
});
//delete madre

router.delete('/defunciones/delete-madre/:id', isAuthenticated, async(req, res) => {

    await madres.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Madre borrada satifactoriaente ");
    res.redirect("/usuario/login/succes");
});



//****************************************************************************
//editar DE DEFUNCIONES
//****************************************************************************

router.get("/defunciones/edit/:id",isAuthenticated,async(req,res)=>{
    const defuncion= await defunciones.findById(req.params.id).lean();
    res.render("defunciones/defunciones-form-edit",{defuncion});
});


router.put("/defunciones/edite/:id",isAuthenticated,async(req,res)=>{
   
   /* 
    var index = Object.keys(body).indexOf("sexo","sem_gest");
     console.log(index); */
     let body = req.body;
     await defunciones.findByIdAndUpdate(req.params.id, body);
     req.flash("success_msg", "defuncion Actualizada correctamente");
     res.redirect('/usuario/login/succes');
    
});

//****************************************************************************
//editar DE madres
//****************************************************************************

router.get("/madres/edit/:id",isAuthenticated,async(req,res)=>{
    const defuncion= await madres.findById(req.params.id).lean();
    res.render("defunciones/madres-form-edit",{defuncion});
});


router.put("/madres/edite/:id",isAuthenticated,async(req,res)=>{
   
    /* 
     var index = Object.keys(body).indexOf("sexo","sem_gest");
      console.log(index); */
      let body = req.body;
      await madres.findByIdAndUpdate(req.params.id, body);
      req.flash("success_msg", "defuncion Actualizada correctamente");
      res.redirect('/usuario/login/succes');
     
 });




module.exports = router