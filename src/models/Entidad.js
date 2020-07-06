const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require("bcryptjs");

const EntidadSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    residencia: { type: String, required: true },
    role: { type: String, default: "Entidad" }
});

EntidadSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

EntidadSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Entidad", EntidadSchema);