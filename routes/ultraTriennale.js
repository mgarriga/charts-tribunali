var express = require('express');
var router = express.Router();

var ut = require('../controller/ultraTriennale')
var tr = require('../controller/tribunali')
var utils = require('../utils/utils.js')

router.get("/UTSuPendentiByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getUTSuPendentiByTribunale('Average', tribunale,criteria,years,function(result){
      res.json(result)
  })
})

router.get("/UTSuPendentiByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getUTSuPendentiByTribunale('Median', tribunale,criteria,years,function(result){
      res.json(result)
  })
})

router.get("/UTSuPendentiByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  getUTSuPendentiByTribunale('Mode', tribunale,criteria,years,function(result){
      res.json(result)
  })
})


router.get("/UTObiettiviByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  getUTSuPendentiByTribunale('Average', tribunale,criteria,years,function(result1){
      results.push(result1)
    getUTObiettiviByTribunale('Average',tribunale, criteria,years,function(result2){
      results.push(result2)
      utils.joinResults(results,function(result){
        res.json(result)
      })
    })
  })
})

router.get("/UTObiettiviByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  results = []
  getUTSuPendentiByTribunale('Median', tribunale,criteria,years,function(result1){
      results.push(result1)
    getUTObiettiviByTribunale('Median',tribunale, criteria,years,function(result2){
      results.push(result2)
      utils.joinResults(results, function(result){
        res.json(result)
      })
    })
  })
})

router.get("/UTObiettiviByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  results = []
  getUTSuPendentiByTribunale('Mode', tribunale,criteria,years,function(result1){
      results.push(result1)
    getUTObiettiviByTribunale('Mode',tribunale, criteria,years,function(result2){
      results.push(result2)
      utils.joinResults(results, function(result){
        res.json(result)
      })
    })
  })
})

router.get("/UTInterannualeByTribunaleAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      ut.getUTInterannualeByTribunale('Average',tribunale,criteria,year,function(err, result){
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
    var result = ut.formatUT(partial,"Interannuale Avg")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/UTInterannualeByTribunaleMedian", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      ut.getUTInterannualeByTribunale('Median',tribunale,criteria,year,function(err, result){
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
    var result = ut.formatUT(partial,"Interannuale Median")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/UTInterannualeByTribunaleMode", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years     = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
      // console.log(year)
      ut.getUTInterannualeByTribunale('Mode',tribunale,criteria,year,function(err, result){
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
    var result = ut.formatUT(partial,"Interannuale Mode")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

function getUTSuPendentiByTribunale(metric, tribunale,criteria,years,callback){
  partial = []

  switch(metric) {
      case 'Average':
          funct = ut.getUTSuPendentiAvg
          break;
      case 'Median':
          funct = ut.getUTSuPendentiMedian
          break;
      case 'Mode':
          funct = ut.getUTSuPendentiMode
          break;
      default:
          funct = ut.getUTSuPendentiAvg
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
        res = ut.formatUT(partial,"Su Pendenti " + metric)
        callback(res)
      })
      //getClearanceRates(res)
    })
  })
}

function getUTObiettiviByTribunale(metric, tribunale,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = ut.getUTObiettiviAvg
          break;
      case 'Median':
          funct = ut.getUTObiettiviMedian
          break;
      case 'Mode':
          funct = ut.getUTObiettiviMode
          break;
      default:
          funct = ut.getUTObiettiviAvg
  }

  tr.getTribunaleDetail(tribunale).toArray(function(err,data){
    if (err) {
      console.log(err)
      return
    }
    var filter
    for (index in data){
      filter = data[index]
    }
    partial = []
    funct('$tribunale',years,res).toArray(function (err,data){
      if (err){
        console.log(err)
        return
      }
      for (index in data){
        var doc = data[index]
        if (doc['_id'].aggregazione == tribunale){
          partial.push(doc)
        }
      }
      funct('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria])
          partial.push(data[index])
        }
        var res = ut.formatUT(partial," Obiettivi " + metric)
        callback(res)
      })
    })
  })
}


module.exports = router

// router.get("/UTInterannualeByTribunaleAverage", (req,res)=>{
//
//   var tribunale = req.query.tribunale
//   var criteria  = req.query.criteria
//   var years = req.query.years.map(function(year){
//     return parseInt(year)
//   })
//   partial = []
//
//   let requests = years.map((year) => {
//     return new Promise((resolve,reject) => {
// //        asyncFunction(year, resolve);
//       // console.log(year)
//       ut.getUTInterannualeAvg('$tribunale',year).toArray(function (err, data){
//         if (err) {
//           console.log(err)
//           reject(err)
//         }
//         for (index in data){
//           var doc = data[index]
//           if (doc['_id'].aggregazione == tribunale){
//             doc['_id'].anno = year
//             partial.push(doc)
//           }
//         }
//         //    var result = cr.formatClearance(data,"Average")
//
//         var filter
//         tr.getTribunaleDetail(tribunale).toArray(function(err,data){
//           if (err) {
//             console.log(err)
//             reject(err)
//           }
//           for (index in data){
//             filter = data[index]
//           }
//           ut.getUTInterannualeAvg('$'+criteria,year)
//           .toArray(function (err, data){
//             if (err) {
//               console.log(err)
//               reject(err)
//             }
//             for (index in data){
//               if (data[index]['_id'].aggregazione == filter[criteria]){
//                 data[index]['_id'].anno = year
//                 partial.push(data[index])
//               }
//             }
//             resolve(true)
//           })
//         })
//       })
//     })
//   })
//   Promise.all(requests).then(() => {
//     // console.log('done')
//     var result = ut.formatUT(partial,"Interannuale Avg")
//     res.json(result)
//   },(error)=>{
//     console.log(error)
//   });
// })
