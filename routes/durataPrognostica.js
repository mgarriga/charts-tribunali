var express = require('express');
var router = express.Router();

var tr    = require('../controller/tribunali')
var dp    = require('../controller/durataPrognostica')
var utils = require('../utils/utils.js')
var ut    = require('../controller/ultraTriennale')
var id    = require('../controller/iscrittiDefiniti')


router.get("/DurataPrognosticaByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getDurataPrognosticaByTribunale('Average', tribunale,criteria,years,(result1)=>{
    results.push(result1)
    ut.getPendentiByTribunale('Average',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      id.getDefinitiByTribunale('Average',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/DurataPrognosticaByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getDurataPrognosticaByTribunale('Median', tribunale,criteria,years,(result1)=>{
    results.push(result1)
    ut.getPendentiByTribunale('Median',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      id.getDefinitiByTribunale('Median',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/DurataPrognosticaByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getDurataPrognosticaByTribunale('Mode', tribunale,criteria,years,function(result){
      res.json(result)
  })
})


router.get("/DurataPrognosticaAverage", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getDurataPrognostica('Average',criteria,years,function(result1){
    results.push(result1)
    ut.getPendenti('Average',criteria,years,(result2)=>{
      results.push(result2)
      id.getDefiniti('Average',criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/DurataPrognosticaMedian", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getDurataPrognostica('Median',criteria,years,function(result1){
    results.push(result1)
    ut.getPendenti('Median',criteria,years,(result2)=>{
      results.push(result2)
      id.getDefiniti('Median',criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/DurataPrognosticaMode", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getDurataPrognostica('Mode',criteria,years,function(result){
      res.json(result)
  })
})


function getDurataPrognosticaByTribunale(metric, tribunale,criteria,years,callback){
  var partial = []
  switch(metric) {
      case 'Average':
          funct = dp.getDurataPrognosticaAvg
          title = 'Media'
          break;
      case 'Median':
          funct = dp.getDurataPrognosticaMedian
          title = 'Mediana'
          break;
      case 'Mode':
          funct = dp.getDurataPrognosticaMode
          title = 'Moda'
          break;
      default:
          funct = dp.getDurataPrognosticaAvg
          title = 'Media'
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
        res = dp.formatDP(partial," in Giorni " + title)
        callback(res)
      })
      //getClearanceRates(res)
    })
  })
}


function getDurataPrognostica(metric,criteria,years,callback){
  var partial = []
  var title   = ""
  switch(metric) {
      case 'Average':
          funct = dp.getDurataPrognosticaAvg
          title = 'Media'
          break;
      case 'Median':
          funct = dp.getDurataPrognosticaMedian
          title = 'Mediana'
          break;
      case 'Mode':
          funct = dp.getDurataPrognosticaMode
          title = 'Moda'
          break;
      default:
          funct = dp.getDurataPrognosticaAvg
          title = 'Media'
  }
      funct('$'+criteria,years).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          // if (data[index]['_id'].aggregazione == filter[criteria])
          partial.push(data[index])
        }
        res = dp.formatDP(partial," in Giorni " + title)
        callback(res)
      })
}

module.exports = router
