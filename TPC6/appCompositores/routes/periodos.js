var express = require('express');
var router = express.Router();
var Periodo = require("../controllers/periodos")


/* GET periodos listing. */
router.get('/', function(req, res, next) {
  Periodo.list()
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});

/* POST periodos listing. */
router.post('/', function(req, res, next) {
  Periodo.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});

/* PUT periodos listing. */
router.put('/:id', function(req, res, next) {
  Periodo.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});

/* DELETE periodos listing. */
router.delete('/:id', function(req, res, next) {
  Periodo.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(e => res.jsonp(e))
});


module.exports = router;
