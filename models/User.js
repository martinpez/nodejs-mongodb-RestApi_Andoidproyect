const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone: { type: String, required: true },
    rol: { type: String, required: true },
    password: { type: String, required: true },
});

// Crear el modelo apuntando a la colección "usersCollection"
const User = mongoose.model('User', userSchema, 'usersCollection');

// Exportar el modelo
module.exports = User;
