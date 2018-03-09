var express = require('express');
var router = express.Router();

var tr    = require('../controller/tribunali')
var p     = require('../controller/produttivita')
var utils = require('../utils/utils.js')
var id    = require('../controller/iscrittiDefiniti')


router.get("/ProduttivitaMagistratoByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getProduttivitaMagistratoByTribunale('Average', tribunale,criteria,years,function(result1){
    results.push(result1)
    id.getDefinitiByTribunale('Average',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getMagistratiPresentiByTribunale('Average',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/ProduttivitaMagistratoByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getProduttivitaMagistratoByTribunale('Median', tribunale,criteria,years,function(result1){
    results.push(result1)
    id.getDefinitiByTribunale('Median',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getMagistratiPresentiByTribunale('Median',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/ProduttivitaMagistratoByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaMagistratoByTribunale('Mode', tribunale,criteria,years,function(result){
      res.json(result)
  })
})


router.get("/ProduttivitaControfattualeByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getProduttivitaControfattualeByTribunale('Average', tribunale,criteria,years,function(result){
    // results.push(result1)
    // id.getDefinitiByTribunale('Average',tribunale,criteria,years,(result2)=>{
    //   results.push(result2)
    //   getMagistratiPresentiByTribunale('Average',tribunale,criteria,years,(result3)=>{
    //     results.push(result3)
    //     utils.joinResults(results,(result)=>{
          res.json(result)
    //     })
    //   })
    // })
  })
})

router.get("/ProduttivitaControfattualeByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  getProduttivitaControfattualeByTribunale('Median', tribunale,criteria,years,(result)=>{
    // results.push(result1)
    // id.getDefinitiByTribunale('Median',tribunale,criteria,years,(result2)=>{
    //   results.push(result2)
    //   getMagistratiPresentiByTribunale('Median',tribunale,criteria,years,(result3)=>{
    //     results.push(result3)
    //     utils.joinResults(results,(result)=>{
          res.json(result)
    //     })
    //   })
    // })
  })
})

router.get("/ProduttivitaControfattualeByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaControfattualeByTribunale('Mode', tribunale,criteria,years,function(result){
      res.json(result)
  })
})


router.get("/ProduttivitaMagistratoAverage", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaMagistrato('Average',criteria,years,function(result){
      res.json(result)
  })
})

router.get("/ProduttivitaMagistratoMedian", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaMagistrato('Median',criteria,years,function(result){
      res.json(result)
  })
})

router.get("/ProduttivitaMagistratoMode", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaMagistrato('Mode',criteria,years,function(result){
      res.json(result)
  })
})


router.get("/ProduttivitaControfattualeAverage", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaControfattuale('Average',criteria,years,function(result){
      res.json(result)
  })
})

router.get("/ProduttivitaControfattualeMedian", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaControfattuale('Median',criteria,years,function(result){
      res.json(result)
  })
})

router.get("/ProduttivitaControfattualeMode", (req,res)=>{

  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getProduttivitaControfattuale('Mode',criteria,years,function(result){
      res.json(result)
  })
})

function getProduttivitaMagistratoByTribunale(metric, tribunale,criteria,years,callback){
  var partial = []
  var title = ""
  switch(metric) {
      case 'Average':
          funct = p.getProduttivitaMagistratoAvg
          title = 'Media'
          break;
      case 'Median':
          funct = p.getProduttivitaMagistratoMedian
          title = 'Mediana'
          break;
      case 'Mode':
          funct = p.getProduttivitaMagistratoMode
          title = 'Moda'
          break;
      default:
          funct = p.getProduttivitaMagistratoAvg
          title = 'Moda'
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
        res = p.formatP(partial," per Magistrato (per ogni ufficio) " + title)
        callback(res)
      })
      //getClearanceRates(res)
    })
  })
}

function getProduttivitaMagistrato(metric,criteria,years,callback){
  var partial = []
  var title   = ""
  switch(metric) {
      case 'Average':
          funct = p.getProduttivitaMagistratoAvg
          title = "Media"
          break;
      case 'Median':
          funct = p.getProduttivitaMagistratoMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = p.getProduttivitaMagistratoMode
          title = "Moda"
          break;
      default:
          funct = p.getProduttivitaMagistratoAvg
          title = "Media"
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
    res = p.formatP(partial," per Magistrato (per ogni ufficio) " + title)
    callback(res)
  })
}


function getProduttivitaControfattualeByTribunale(metric, tribunale,criteria,years,callback){
  partial = []
  var title = ""
  switch(metric) {
      case 'Average':
          funct = p.getProduttivitaControfattualeAvg
          title = "Media"
          break;
      case 'Median':
          funct = p.getProduttivitaControfattualeMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = p.getProduttivitaControfattualeMode
          title = "Moda"
          break;
      default:getProduttivitaControfattuale
          funct = p.getProduttivitaControfattualeAvg
          title = "Media"
  }

  funct('$' + criteria,years).toArray(function (err, data){
    if (err) {
      console.log(err)
      return
    }
    for (index in data){
      var doc = data[index]
      if (doc['tribunale'] == tribunale){
        partial.push(doc)
      }
    }
    res = p.formatP(partial," Controfattuale (%) " + tribunale + ' ' + title)
    callback(res)
  })
}

function getProduttivitaControfattuale(metric,criteria,years,callback){
  var partial = []
  var title   = ""

  switch(metric) {
      case 'Average':
          funct = p.getProduttivitaControfattualeAvg
          title = "Media"
          break;
      case 'Median':
          funct = p.getProduttivitaControfattualeMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = p.getProduttivitaControfattualeMode
          title = "Moda"
          break;
      default:
          funct = p.getProduttivitaControfattualeAvg
          title = "Media"
  }

  funct('$' + criteria,years).toArray(function (err, data){
    if (err) {
      console.log(err)
      return
    }
    for (index in data){
      var doc = data[index]
        partial.push(doc)
    }
    res = p.formatP(partial," Controfattuale (%) " + ' ' + title)
    callback(res)
  })
}

function getMagistratiPresentiByTribunale(metric, tribunale,criteria,years,callback){
  var partial = []

  switch(metric) {
      case 'Average':
          funct = p.getMagistratiPresentiAvg
          title = 'Media'
          break;
      case 'Median':
          funct = p.getMagistratiPresentiMedian
          title = 'Mediana'
          break;
      case 'Mode':
          funct = p.getMagistratiPresentiMode
          title = 'Moda'
          break;
      default:
          funct = p.getMagistratiPresentiAvg
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
        res = utils.formatTable(partial,"Magistrati Presenti" + metric)
        callback(res)
      })
      //getClearanceRates(res)
    })
  })
}

function getMagistratiPresenti(metric,criteria,years,callback){
  var partial = []

  switch(metric) {
      case 'Average':
          funct = p.getMagistratiPresentiAvg
          title = 'Media'
          break;
      case 'Median':
          funct = p.getMagistratiPresentiMedian
          title = 'Mediana'
          break;
      case 'Mode':
          funct = p.getMagistratiPresentiMode
          title = 'Moda'
          break;
      default:
          funct = p.getMagistratiPresentiAvg
          title = 'Media'
  }

  funct('$tribunale',years).toArray(function (err, data){
    if (err) {
      console.log(err)
      return
    }
    for (index in data){
      var doc = data[index]
      partial.push(doc)
    }
    funct('$'+criteria,years).toArray(function (err, data){
      if (err) {
        console.log(err)
        return
      }
      for (index in data){
        partial.push(data[index])
      }
      res = utils.formatTable(partial,"Magistrati Presenti" + metric)
      callback(res)
    })
  })
}

module.exports = router
