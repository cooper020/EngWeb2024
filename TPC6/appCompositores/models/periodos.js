var mongoose = require("mongoose")

var periodoSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    }, 
    nome : String
}, { versionKey : false })

module.exports = mongoose.model('periodos', periodoSchema)