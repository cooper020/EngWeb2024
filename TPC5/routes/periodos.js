var express = require('express');
var router = express.Router();
var axios = require("axios");

router.get('/', function(req, res, next) {
    axios.get("http://localhost:3000/periodos")
      .then(resp => {
        var periodos = resp.data; // Obtendo os períodos da resposta da API
        var d = new Date().toISOString().substring(0, 16); // Obtendo a data atual
        res.status(200).render("periodosListPage", {"lperiodos": periodos, "date": d}); // Renderizando a página com os períodos e a data
      })
      .catch(erro => {
        res.status(507).render("error", { error: erro });
      });
});


/*Registo */
router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("periodoFormPage", {"date" : d})
});

/*Registo - POST*/
router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  result = req.body
  axios.post("http://localhost:3000/periodos/", result)
      .then(resp => {
        res.redirect("/periodos")
      })
      .catch(erro =>{
        res.status(502).render("error", {"error" : erro})
      })
});


/*Perfil - GET*/
router.get('/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  
  axios.get("http://localhost:3000/periodos/" + id)
    .then(resp =>{
      periodo = resp.data

      axios.get("http://localhost:3000/compositores?periodo=" + id)
        .then(compositoresResp => {
          compositores = compositoresResp.data

          res.status(200).render("periodoPage", {"periodo" : periodo, "compositores": compositores, "date" : d})
        })
        .catch(compositoresErro => {
          res.status(503).render("error", {"error" : compositoresErro})
        })
    })
    .catch(erro =>{
      res.status(503).render("error", {"error" : erro})
    })
});



/*Perfil(Edit)- GET*/
router.get('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  axios.get("http://localhost:3000/periodos/" + id)
    .then(resp =>{
      periodo = resp.data
      res.status(200).render("periodoFormEditPage", {"periodo" : periodo, "date" : d})
    })
    .catch(erro =>{
      res.status(504).render("error", {"error" : erro})
    })
});

/*Perfil(Edit)- POST*/
router.post('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var periodo = req.body
  axios.put("http://localhost:3000/periodos/" + periodo.id, periodo)
    .then(resp =>{
      res.redirect("/periodos")
    })
    .catch(erro =>{
      res.status(505).render("error", {"error" : erro})
    })
});

/*Perfil(Delete)- GET*/
router.get('/delete/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var id = req.params.idPeriodo
  axios.delete("http://localhost:3000/periodos/" + id)
    .then(resp =>{
      res.redirect("/periodos")
    })
    .catch(erro =>{
      res.status(506).render("error", {"error" : erro})
    })
});

module.exports = router;
