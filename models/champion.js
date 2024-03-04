'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const championSchema = new Schema({
    id: Number,
    name: String,
    abilities: {
        Q: String,
        W: String,
        E: String,
        R: String
    },
    role:String,
    description:String,
    image: String
});
// para evitar la inserción de __V:0... no necesario, registro de veces actualizado un doc
// aunque a mi sinceramente no me aumenta la contidad, se mantiene en 0
//}, { versionKey: false }); // Desactivar la opción versionKey
//creamos el modelo
//! 'DBNAME',nombre schema,'collection'
const Champions = mongoose.model('LeagueOfLegends',championSchema,"Champions");

module.exports = Champions;