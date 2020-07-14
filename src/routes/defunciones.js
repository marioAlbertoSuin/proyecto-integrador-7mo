const express = require('express');
const router = express.Router();
const defunciones =require('../models/Defuncion');
const { isAuthenticated } = require('../helpers/auth');

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
        parr_fall ,area_fall ,causa_fetal, nac_mad ,nom_pais, fecha_mad , hij_viv ,hij_vivm ,
        hij_nacm ,con_pren ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res
    }  = req.body; 
    

   
    if(fecha_mad==""){
        errors.push({text:"Escoja la fecha del nacimiento de la madre"});
    }else{
        
        var hoy = new Date();
        var cumpleanos = new Date(fecha_mad);
        var edad_mad = hoy.getFullYear() - cumpleanos.getFullYear();
        
    }
    if(fecha_fall==""){
        errors.push({text:"Escoja la fecha de la defuncion"});
    }

    if (causa_fetal.length < 10) {
        errors.push({ text: "Ingrese una causa fetal." });
    }
    if(nom_pais.length<4){
        errors.push({ text: "Ingrese un pais." });
    }
    if (prov_fall=='--') {
        errors.push({ text: "Escoja una opcion valida para la provincia del falleciminto." });
    } 
    if (cant_fall=='--') {
        errors.push({ text: "Escoja una opcion valida para el canton del falleciminto." });
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
       var fechaFallecimiento = new Date(fecha_fall.replace(/-/g, '\/'))
       var dia_fall = fechaFallecimiento.getDate();
       var mes_fall = meses[fechaFallecimiento.getMonth()];
       var anio_fall = fechaFallecimiento.getFullYear();
       sem_gest = parseInt(sem_gest);
       hij_viv= parseInt(hij_viv);
       hij_vivm= parseInt(hij_vivm);
       hij_nacm=parseInt(hij_nacm);
       con_pren=parseInt(con_pren);
       
        const defuncion = new defunciones({ sexo, sem_gest, fecha_fall, p_emb, asis_por , lugar_ocur ,prov_fall ,cant_fall,
            parr_fall ,area_fall ,causa_fetal, nac_mad ,nom_pais, fecha_mad , hij_viv ,hij_vivm ,
            hij_nacm ,con_pren ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res,dia_fall,mes_fall,anio_fall,edad_mad,codEntidad});
         
            await defuncion.save();
            req.flash("success_msg", "estas registrado.");
            res.redirect("/usuario/login/succes");
        }
    
});


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

module.exports = router