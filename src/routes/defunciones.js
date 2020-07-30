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
       inscrip=fechainscrip.getMonth()+1+'/'+dia_insc+'/'+anio_insc;
        const defuncion = new defunciones({"fecha_insc":inscrip, sexo, sem_gest, fecha_fall, p_emb, asis_por , lugar_ocur ,prov_fall ,cant_fall,
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

router.post('/defunciones/registro/buscar-madre', async(req, res) => {
    ced=req.body.ced;
    const madre = await madres.findOne({"ced":ced},["_id","nom_mad"]);
    res.send(madre);
    
});


router.post('/defunciones/registro/llenar-causa', async(req, res) => {
       
    const causa = await defunciones.aggregate([
        {$group:{_id:"$causa_fetal"}}
        ]);
    
    
    res.send(causa);
    
});

router.post('/defunciones/registro/llenar-anio', async(req, res) => {
       //console.log("hola")
    const causa = await defunciones.aggregate([
        {$group:{_id:"$anio_insc"}}
        ]);
    
    
    res.send(causa);
    
});


/////////////////////////////////////////////////////////////////////////////////////

function validar(cedula) {

 //Preguntamos si la cedula consta de 10 digitos
 if(cedula.length == 10){
        
    //Obtenemos el digito de la region que sonlos dos primeros digitos
    var digito_region = cedula.substring(0,2);
    
    //Pregunto si la region existe ecuador se divide en 24 regiones
    if( digito_region >= 1 && digito_region <=24 ){
      
      // Extraigo el ultimo digito
      var ultimo_digito   = cedula.substring(9,10);

      //Agrupo todos los pares y los sumo
      var pares = parseInt(cedula.substring(1,2)) + parseInt(cedula.substring(3,4)) + parseInt(cedula.substring(5,6)) + parseInt(cedula.substring(7,8));

      //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
      var numero1 = cedula.substring(0,1);
      var numero1 = (numero1 * 2);
      if( numero1 > 9 ){ var numero1 = (numero1 - 9); }

      var numero3 = cedula.substring(2,3);
      var numero3 = (numero3 * 2);
      if( numero3 > 9 ){ var numero3 = (numero3 - 9); }

      var numero5 = cedula.substring(4,5);
      var numero5 = (numero5 * 2);
      if( numero5 > 9 ){ var numero5 = (numero5 - 9); }

      var numero7 = cedula.substring(6,7);
      var numero7 = (numero7 * 2);
      if( numero7 > 9 ){ var numero7 = (numero7 - 9); }

      var numero9 = cedula.substring(8,9);
      var numero9 = (numero9 * 2);
      if( numero9 > 9 ){ var numero9 = (numero9 - 9); }

      var impares = numero1 + numero3 + numero5 + numero7 + numero9;

      //Suma total
      var suma_total = (pares + impares);

      //extraemos el primero digito
      var primer_digito_suma = String(suma_total).substring(0,1);

      //Obtenemos la decena inmediata
      var decena = (parseInt(primer_digito_suma) + 1)  * 10;

      //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
      var digito_validador = decena - suma_total;

      //Si el digito validador es = a 10 toma el valor de 0
      if(digito_validador == 10)
        var digito_validador = 0;

      //Validamos que el digito validador sea igual al de la cedula
      if(digito_validador == ultimo_digito){
        return 'correcta';
      }else{
        return('la cedula:' + cedula + ' es incorrecta');
      }
      
    }else{
      // imprimimos en consola si la region no pertenece
      return('Esta cedula no pertenece a ninguna region');
    }
 }else{
    //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
    return('Esta cedula tiene menos de 10 Digitos');
 }    
  }

//****************************************************************************
//INGRESO DE MADRES
//****************************************************************************

router.get('/defunciones/madres/registro',isAuthenticated ,async(req, res) => {
   
    res.render('madres/madres-signup');
});

router.post('/defunciones/madres/registro',isAuthenticated ,async(req, res) => {

    var codEntidad=String(req.user._id);
    
    let errors = [];
    var { nom_mad, nac_mad ,nom_pais, fecha_mad , hij_viv ,hij_vivm ,ced,
        hij_nacm  ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res
    }  = req.body; 
    

    let val=validar(ced);
    console.log(val)

    if(val!="correcta"){
        errors.push({text:"Cedula Inválida"});
    }
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
        res.render("madres/madres-signup", {
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
            hij_nacm ,etnia ,est_civil, niv_inst ,sabe_leer ,prov_res ,cant_res ,parr_res ,area_res,dia_mad,mes_mad,anio_mad,edad_mad,codEntidad,ced});
         
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


//****************************************************************************
//INGRESO DE MADRES
//****************************************************************************


router.get("/defun/banco/datos",isAuthenticated,async(req,res)=>{
    const causa= await defunciones.aggregate([{$group:{_id:'$causa_fetal',total:{$sum:1}}},{$sort:{total:-1}},{$limit:5}]);
    const provi= await defunciones.aggregate([{$group:{_id:'$prov_fall',total:{$sum:1}}},{$sort:{total:-1}},{$limit:5}]);
    const etnia= await defunciones.aggregate([{$group:{_id:'$etnia',total:{$sum:1}}},{$sort:{total:-1}},{$limit:5}]);
    const lugar_ocur= await defunciones.aggregate([{$group:{_id:'$lugar_ocur',total:{$sum:1}}},{$sort:{total:-1}},{$limit:5}]);
    res.render("users/datos",{causa,provi,etnia,lugar_ocur});
});




module.exports = router