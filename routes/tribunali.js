var express = require('express');
var router = express.Router();

var cr = require('../controller/clearanceRates')
var tr = require('../controller/tribunali')

router.get('/tribunali-detail',(request,response) =>{
  //var cursor = db.collection('quotes').find().toArray(function(err, results){
  //  console.log(results)
    //getData(response)
    response.render('tribunali-detail')
  //})
  //Render takes the name of the view (home) and the data to render (name)
  //response.render('home',{
  //  name:'Martin'
  //})
})

router.get('/tribunali', (req,res) =>{
  tr.getTribunaliList().toArray(function(err,data){
    if (err) {
      console.log(err)
      return
    }
    var tribunaliArray = []
    for (index in data){
      tribunaliArray.push(data[index]._id)
    }
    var result = {
      'tribunali': tribunaliArray
    }
    res.json(result)
  })
})

router.get("/clearanceRateByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  cr.getClearanceAvg('$tribunale',years,res).toArray(function (err, data){
      if (err) {
        console.log(err)
        return
      }
      for (index in data){
        var doc = data[index]
        if (doc['_id'].aggregazione == tribunale){
          partial.push(doc)
        }
      }
  //    var result = cr.formatClearance(data,"Average")

    var filter
    tr.getTribunaleDetail(tribunale).toArray(function(err,data){
      if (err) {
        console.log(err)
        return
      }
      for (index in data){
        filter = data[index]
      }
      cr.getClearanceAvg('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = cr.formatClearance(partial,"Average")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
  // TODO falta filtrar de los del 'criteria' cuales son del mismo grupo
  //que el tribunal original de arriba

})


module.exports = router;
