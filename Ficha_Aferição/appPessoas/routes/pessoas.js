var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoas")

//=================================================== GET =================================================
// /pessoa 

/* GET pessoas listing. */
router.get('/', function(req, res, next) {
  Pessoa.list()
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
}); 


//=================================================== POST ===================================================
/* POST pessoas listing. */
router.post('/', function(req, res, next) {
  Pessoa.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});

//=================================================== PUT ====================================================
/* PUT pessoas listing. */
router.put('/:id', function(req, res, next) {
  Pessoa.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});


//=================================================== DELETE =================================================
/* DELETE pessoas listing. */
router.delete('/:id', function(req, res, next) {
  Pessoa.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});


module.exports = router;
