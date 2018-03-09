var express = require('express');
var router = express.Router();

var ut    = require('../controller/ultraTriennale')
var tr    = require('../controller/tribunali')
var utils = require('../utils/utils.js')
var dg    = require('../controller/domandaGiustizia')
var id    = require('../controller/iscrittiDefiniti')

router.get("/DomandaGiustiziaByTribunaleAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial = []
  var results = []
  var result1 = null
  var result2 = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Average',tribunale,criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    id.getIscrittiByTribunale('Average',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      var formatRes = dg.formatDG(partial,"Variazione (%) Media")
      results.splice(0,0,formatRes)
      utils.joinResults(results,(result)=>{
        res.json(result)
      })
    })
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
  var partial = []
  var results = []
  var result1 = null
  var result2 = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustiziaByTribunale('Median',tribunale,criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    id.getIscrittiByTribunale('Median',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      var formatRes = dg.formatDG(partial,"Variazione (%) Mediana")
      results.splice(0,0,formatRes)
      utils.joinResults(results,(result)=>{
        res.json(result)
      })
    })
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
  var results   = []
  var partial   = []
  var partial2  = []
  var result    = null
  var result1   = null
  var result2   = null
  var result3   = null
  var result4   = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      getDomandaGiustiziaByTribunale('Average',tribunale,criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
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
    var resultDG  = dg.formatDG(partial,"Variazione Media (%)")
    var resultUT  = ut.formatUT(partial2," Interannuale Media (%)")
    results.push(resultDG)
    results.push(resultUT)
    ut.getPendentiUTByTribunale('Average',tribunale,criteria,years,(result3)=>{
      results.push(result3)
      id.getIscrittiByTribunale('Average',tribunale,criteria,years,(result4)=>{
        results.push(result4)
        utils.joinResults(results,function(resultAll){
          res.json(resultAll)
        })
      })
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
  var results   = []
  var partial   = []
  var partial2  = []
  var result    = null
  var result1   = null
  var result2   = null
  var result3   = null
  var result4   = null
  var result5   = null

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      getDomandaGiustiziaByTribunale('Median',tribunale,criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
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
    var resultDG  = dg.formatDG(partial,"Variazione Mediana (%)")
    var resultUT = ut.formatUT(partial2," Interannuale Mediana (%)")
    results.push(resultDG)
    results.push(resultUT)
    ut.getPendentiUTByTribunale('Median',tribunale,criteria,years,(result3)=>{
      results.push(result3)
      ut.getPendentiByTribunale('Median',tribunale,criteria,years,(result4)=>{
        results.push(result4)
        id.getIscrittiByTribunale('Median',tribunale,criteria,years,(result5)=>{
          results.push(result5)
          utils.joinResults(results,function(resultAll){
            res.json(resultAll)
          })
        })
      })
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

router.get("/DomandaGiustiziaAverage", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial = []
  var results = []
  var result1 = null
  var result2 = null

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Average',criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
          // console.log(JSON.stringify(partial))
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    var formatRes = dg.formatDG(partial,"Variazione (%) Media")
    results.push(formatRes)
    id.getIscritti('Average',criteria,years,(result2)=>{
      results.push(result2)
      utils.joinResults(results,(result)=>{
        res.json(result)
      })
    })
  },(error)=>{
    console.log(error)
  });
})

router.get("/DomandaGiustiziaMedian", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial = []
  var results = []
  var result1 = null
  var result2 = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Median',criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
          resolve(true)
      })
    })
  })
  Promise.all(requests).then(() => {
    var formatRes = dg.formatDG(partial,"Variazione (%) Mediana")
    results.push(formatRes)
    id.getIscritti('Median',criteria,years,(result2)=>{
      results.push(result2)
      utils.joinResults(results,(result)=>{
        res.json(result)
      })
    })
  },(error)=>{
    console.log(error)
  });
})

router.get("/DomandaGiustiziaMode", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Mode',criteria,year,function(err, result){
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
    var result = dg.formatDG(partial,"Variazione (%) Moda")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})


router.get("/UTDomandaAverage", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial   = []
  var partial2  = []
  var results   = []
  var result1   = null
  var result2   = null
  var result3   = null
  var result4   = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Average',criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result1)

          ut.getUTInterannuale('Average',criteria,year,function(err,result2){
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
    var resultDG  = dg.formatDG(partial,"Variazione Media (%)")
    var resultUT  = ut.formatUT(partial2," Interannuale Media (%)")
    results.push(resultDG)
    results.push(resultUT)
    ut.getPendentiUT('Average',criteria,years,(result3)=>{
      results.push(result3)
      id.getIscritti('Average',criteria,years,(result4)=>{
        results.push(result4)
        utils.joinResults(results,function(resultAll){
          res.json(resultAll)
        })
      })
    })
  },(error)=>{
    console.log(error)
  });
})


router.get("/UTDomandaMedian", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial   = []
  var partial2  = []
  var results   = []
  var result1   = null
  var result2   = null
  var result3   = null
  var result4   = null
  var result5   = null
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Median',criteria,year,function(err, result1){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result1)

          ut.getUTInterannuale('Median',criteria,year,function(err,result2){
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
    var resultDG  = dg.formatDG(partial,"Variazione Mediana (%)")
    var resultUT = ut.formatUT(partial2," Interannuale Mediana (%)")
    var results = []
    results.push(resultDG)
    results.push(resultUT)
    ut.getPendentiUT('Median',criteria,years,(result3)=>{
      results.push(result3)
      ut.getPendenti('Median',criteria,years,(result5)=>{
        results.push(result5)
        id.getIscritti('Median',criteria,years,(result4)=>{
          results.push(result4)
          utils.joinResults(results,function(resultAll){
            res.json(resultAll)
          })
        })
      })
    })
  },(error)=>{
    console.log(error)
  });
})

router.get("/UTDomandaMode", (req,res)=>{
  // var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial  = []
  partial2 = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      getDomandaGiustizia('Mode',criteria,year,function(err, result){
          if (err){
            console.log(err)
            reject(err)
          }

          // console.log("RESULT FROM getDG " + JSON.stringify(result))
          partial = partial.concat(result)

          ut.getUTInterannuale('Mode',criteria,year,function(err,result2){
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

function getDomandaGiustizia(metric,criteria,year,callback){

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

      funct('$'+criteria,year)
      .toArray(function (err, data){
        if (err) {
          console.log(err)
          callback(err,null)
        }
        for (index in data){
          // if (data[index]['_id'].aggregazione == filter[criteria]){
            data[index]['_id'].anno = year
            partialRes.push(data[index])
          // }
        }
        callback(null,partialRes)
      })
  //   })
  // })
}

module.exports = router
