const mongoose = require("mongoose");
const { Schema } = mongoose;



const UserSchema = new Schema({

        prov_insc : {type:String},
        cant_insc : {type:String},
        parr_insc : {type:String},
        anio_insc : {type:Number},
        mes_insc : {type:String},
        dia_insc : {type:Number},
        fecha_insc : {type:String},
        sexo : {type:String},
        sem_gest : {type:Number},
        anio_fall : {type:Number},
        mes_fall : {type:String},
        dia_fall : {type:Number},
        fecha_fall : {type:String},
        p_emb : {type:String},
        asis_por : {type:String},
        lugar_ocur : {type:String},
        prov_fall : {type:String},
        cant_fall : {type:String},
        parr_fall : {type:String},
        area_fall : {type:String},
        causa_fetal : {type:String},
        nac_mad : {type:String},
        nom_pais : {type:String},
        cod_pais : {type:Number},
        anio_mad : {type:Number},
        mes_mad : {type:String},
        dia_mad : {type:Number},
        fecha_mad :{type:String},
        edad_mad : {type:Number},
        hij_viv : {type:Number},
        hij_vivm : {type:Number},
        hij_nacm : {type:Number},
        con_pren : {type:Number},
        etnia : {type:String},
        est_civil :{type:String},
        niv_inst : {type:String},
        sabe_leer : {type:String},
        prov_res : {type:String},
        cant_res : {type:String},
        parr_res : {type:String},
        area_res : {type:String},
        date: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("defunciones", UserSchema);