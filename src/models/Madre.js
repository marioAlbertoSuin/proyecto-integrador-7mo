const mongoose = require("mongoose");
const { Schema } = mongoose;



const MadreSchema = new Schema({
        nom_mad:{type:String},
        ced:{type:String},
        nac_mad : {type:String},
        nom_pais : {type:String},
        anio_mad : {type:Number},
        mes_mad : {type:String},
        dia_mad : {type:Number},
        fecha_mad :{type:String},
        edad_mad : {type:Number},
        hij_viv : {type:Number},
        hij_vivm : {type:Number},
        hij_nacm : {type:Number},
        etnia : {type:String},
        est_civil :{type:String},
        niv_inst : {type:String},
        sabe_leer : {type:String},
        prov_res : {type:String},
        cant_res : {type:String},
        parr_res : {type:String},
        area_res : {type:String},    
        date: { type: Date, default: Date.now },
        codEntidad:{type:String,required:true}
  
});

module.exports = mongoose.model("madres", MadreSchema);