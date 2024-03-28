var mongoose = require("mongoose")

const { modelName } = require("../models/compositores")
var Compositor = require("../models/compositores")

module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.insert = (compositor) => {
    var newCompositor = new Compositor(compositor)
    return newCompositor.save()
}

module.exports.update = (id, compositor) => {
    return Compositor
        .findByIdAndUpdate(id, compositor, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Compositor
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
