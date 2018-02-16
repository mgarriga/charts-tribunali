var express = require('express');
var router = express.Router();

var tr = require('../controller/tribunali')
var dp = require('../controller/durataPrognostica')
var utils = require('../utils/utils.js')


router.get("/DurataPrognosticaByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getDurataPrognosticaByTribunale('Average', tribunale,criteria,years,function(result){
      res.json(result)
  })
})


function getDurataPrognosticaByTribunale(metric, tribunale,criteria,years,callback){
  partial = []

  switch(metric) {
      case 'Average':
          funct = dp.getDurataPrognosticaAvg
          break;
      case 'Median':
          funct = dp.getDurataPrognosticaMedian
          break;
      case 'Mode':
          funct = dp.getDurataPrognosticaMode
          break;
      default:
          funct = dp.getDurataPrognosticaAvg
  }

  funct('$tribunale',years).toArray(function (err, data){
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
      funct('$'+criteria,years).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        res = dp.formatDP(partial," in Giorni " + metric)
        callback(res)
      })
      //getClearanceRates(res)
    })
  })
}


module.exports = router
