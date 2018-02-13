var express = require('express');
var router = express.Router();

var ut = require('../controller/ultraTriennale')
var tr = require('../controller/tribunali')

router.get("/UTInterannualeByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
//        asyncFunction(year, resolve);
      // console.log(year)
      ut.getUTInterannualeAvg('$tribunale',year,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          reject(err)
        }
        for (index in data){
          var doc = data[index]
          if (doc['_id'].aggregazione == tribunale){
            doc['_id'].anno = year
            partial.push(doc)
          }
        }
        //    var result = cr.formatClearance(data,"Average")

        var filter
        tr.getTribunaleDetail(tribunale).toArray(function(err,data){
          if (err) {
            console.log(err)
            reject(err)
          }
          for (index in data){
            filter = data[index]
          }
          ut.getUTInterannualeAvg('$'+criteria,year,res)
          .toArray(function (err, data){
            if (err) {
              console.log(err)
              reject(err)
            }
            for (index in data){
              if (data[index]['_id'].aggregazione == filter[criteria]){
                data[index]['_id'].anno = year
                partial.push(data[index])
              }
            }
            resolve(true)
          })
        })
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
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
//        asyncFunction(year, resolve);
      // console.log(year)
      ut.getUTInterannualeMedian('$tribunale',year,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          reject(err)
        }
        for (index in data){
          var doc = data[index]
          if (doc['_id'].aggregazione == tribunale){
            doc['_id'].anno = year
            partial.push(doc)
          }
        }
        //    var result = cr.formatClearance(data,"Average")

        var filter
        tr.getTribunaleDetail(tribunale).toArray(function(err,data){
          if (err) {
            console.log(err)
            reject(err)
          }
          for (index in data){
            filter = data[index]
          }
          ut.getUTInterannualeMedian('$'+criteria,year,res)
          .toArray(function (err, data){
            if (err) {
              console.log(err)
              reject(err)
            }
            for (index in data){
              if (data[index]['_id'].aggregazione == filter[criteria]){
                data[index]['_id'].anno = year
                partial.push(data[index])
              }
            }
            resolve(true)
          })
        })
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
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []

  let requests = years.map((year) => {
    return new Promise((resolve,reject) => {
//        asyncFunction(year, resolve);
      // console.log(year)
      ut.getUTInterannualeMode('$tribunale',year,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          reject(err)
        }
        for (index in data){
          var doc = data[index]
          if (doc['_id'].aggregazione == tribunale){
            doc['_id'].anno = year
            partial.push(doc)
          }
        }
        //    var result = cr.formatClearance(data,"Average")

        var filter
        tr.getTribunaleDetail(tribunale).toArray(function(err,data){
          if (err) {
            console.log(err)
            reject(err)
          }
          for (index in data){
            filter = data[index]
          }
          ut.getUTInterannualeMode('$'+criteria,year,res)
          .toArray(function (err, data){
            if (err) {
              console.log(err)
              reject(err)
            }
            for (index in data){
              if (data[index]['_id'].aggregazione == filter[criteria]){
                data[index]['_id'].anno = year
                partial.push(data[index])
              }
            }
            resolve(true)
          })
        })
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

router.get("/UTSuPendentiByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  ut.getUTSuPendentiAvg('$tribunale',years,res).toArray(function (err, data){
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
      ut.getUTSuPendentiAvg('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = ut.formatUT(partial,"Su Pendenti Average")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
})

router.get("/UTSuPendentiByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  ut.getUTSuPendentiMedian('$tribunale',years,res).toArray(function (err, data){
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
      ut.getUTSuPendentiMedian('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = ut.formatUT(partial,"Su Pendenti Median")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
})

router.get("/UTSuPendentiByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  ut.getUTSuPendentiMode('$tribunale',years,res).toArray(function (err, data){
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
      ut.getUTSuPendentiMode('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = ut.formatUT(partial,"Su Pendenti Mode")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
})

module.exports = router
