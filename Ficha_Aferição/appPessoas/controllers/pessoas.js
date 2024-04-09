var mongoose = require("mongoose")

const { modelName } = require("../models/pessoas")
var Pessoa = require("../models/pessoas")


//=================================================== GET =================================================
module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome : 1})
        .exec()
}

//=================================================== POST ===================================================
module.exports.insert = (pessoa) => {
    var newPessoa = new Pessoa(pessoa)
    return newPessoa.save()
}

//=================================================== PUT ====================================================
module.exports.update = (id, pesssoa) => {
    return Pessoa
        .findByIdAndUpdate(id, pessoa, {new : true})
        .exec()
}


//=================================================== DELETE =================================================
module.exports.remove = id => {
    return Pessoa
        .findByIdAndDelete(id)
        .exec()
}
