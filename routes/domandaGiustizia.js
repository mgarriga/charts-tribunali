var express = require('express');
var router = express.Router();

var ut    = require('../controller/ultraTriennale')
var tr    = require('../controller/tribunali')
var utils = require('../utils/utils.js')
var dg    = require('../controller/domandaGiustizia')

router.get("/DomandaGiustiziaByTribunaleAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Average',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    var result = dg.formatDG(partial,"Variazione (%) Media")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})


router.get("/DomandaGiustiziaByTribunaleMedian", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Median',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    var result = dg.formatDG(partial,"Variazione (%) Mediana")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/DomandaGiustiziaByTribunaleMode", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Mode',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    var result = dg.formatDG(partial,"Variazione (%) Moda")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/UTDomandaByTribunaleAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial  = []
  partial2 = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Average',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result)

          ut.getUTInterannualeByTribunale('Average',tribunale,criteria,year,function(err,result2){
            if (err){
              console.log(err)
              reject(err)
            }
            partial2 = partial2.concat(result2)
            resolve(true)
          })
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    // console.log('calling formatUT ' +  JSON.stringify(partial2))
    // console.log('calling formatDG ' + JSON.stringify(partial))
    var resultDG  = dg.formatDG(partial,"Variazione Media (%)")
    var resultUT = ut.formatUT(partial2," Interannuale Media (%)")
    var results = []
    results.push(resultDG)
    results.push(resultUT)
    utils.joinResults(results,function(resultAll){
      res.json(resultAll)
    })
  },(error)=>{
    console.log(error)
  });
})

router.get("/UTDomandaByTribunaleMedian", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial  = []
  partial2 = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Median',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result)

          ut.getUTInterannualeByTribunale('Median',tribunale,criteria,year,function(err,result2){
            if (err){
              console.log(err)
              reject(err)
            }
            partial2 = partial2.concat(result2)
            resolve(true)
          })
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    // console.log('calling formatUT ' +  JSON.stringify(partial2))

    // console.log('calling formatDG ' + JSON.stringify(partial))
    var resultDG  = dg.formatDG(partial,"Variazione Mediana (%)")
    var resultUT = ut.formatUT(partial2," Interannuale Mediana (%)")
    var results = []
    results.push(resultDG)
    results.push(resultUT)
    utils.joinResults(results,function(resultAll){
      res.json(resultAll)
    })
  },(error)=>{
    console.log(error)
  });
})


router.get("/UTDomandaByTribunaleMode", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial  = []
  partial2 = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Mode',tribunale,criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result)

          ut.getUTInterannualeByTribunale('Mode',tribunale,criteria,year,function(err,result2){
            if (err){
              console.log(err)
              reject(err)
            }
            partial2 = partial2.concat(result2)
            resolve(true)
          })
      })
    })
  })
  Promise.all(requests).then(() => {
    // console.log('done')
    // console.log('calling formatUT ' +  JSON.stringify(partial2))

    // console.log('calling formatDG ' + JSON.stringify(partial))
    var resultDG  = dg.formatDG(partial,"Variazione Moda (%)")
    var resultUT = ut.formatUT(partial2," Interannuale Moda (%)")
    var results = []
    results.push(resultDG)
    results.push(resultUT)
    utils.joinResults(results,function(resultAll){
      res.json(resultAll)
    })
  },(error)=>{
    console.log(error)
  });
})


function getDomandaGiustiziaByTribunale(metric,tribunale,criteria,year,callback){

  switch(metric) {
      case 'Average':
          funct = dg.getDomandaGiustiziaAvg
          break;
      case 'Median':
          funct = dg.getDomandaGiustiziaMedian
          break;
      case 'Mode':
          funct = dg.getDomandaGiustiziaMode
          break;
      default:
          funct = dg.getDomandaGiustiziaAvg
  }

  var partialRes = []
  funct('$tribunale',year).toArray(function (err, data){
    if (err) {
      console.log(err)
      callback(err,null)
    }
    for (index in data){
      var doc = data[index]
      if (doc['_id'].aggregazione == tribunale){
        doc['_id'].anno = year
        partialRes.push(doc)
      }
    }
    //    var result = cr.formatClearance(data,"Average")

    var filter
    tr.getTribunaleDetail(tribunale).toArray(function(err,data){
      if (err) {
        console.log(err)
        callback(err,null)
      }
      for (index in data){
        filter = data[index]
      }
      funct('$'+criteria,year)
      .toArray(function (err, data){
        if (err) {
          console.log(err)
          callback(err,null)
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]){
            data[index]['_id'].anno = year
            partialRes.push(data[index])
          }
        }
        callback(null,partialRes)
      })
    })
  })
}



module.exports = router
