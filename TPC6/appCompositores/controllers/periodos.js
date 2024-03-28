var mongoose = require("mongoose")

const { modelName } = require("../models/periodos")
var Periodo = require("../models/periodos")

module.exports.list = () => {
    return Periodo
        .find()
        .sort({nome : 1})  
        .exec()
}

module.exports.insert = (periodo) => {
    var newPeriodo = new Periodo(periodo)
    return newPeriodo.save()
}

module.exports.update = (id, periodo) => {
    return Periodo
        .findByIdAndUpdate(id, periodo, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Periodo
        .findByIdAndDelete(id)
        .exec()

    //alternativa
    /*
        Compositor.
            find({_id:id})
            .deleteOne()
            .exec()
    */    
}
