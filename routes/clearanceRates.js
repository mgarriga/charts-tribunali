
var express = require('express');
var router = express.Router();

var cr = require('../controller/clearanceRates')

router.get("/clearanceRateAverage", (req,res)=>{

  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  cr.getClearanceAvg(criteria,years,res).toArray(function (err, data){
      if (err) {
        console.log(err)
        return
      }
      var result = cr.formatClearance(data,"Average")
      res.json(result)
    })
  //getClearanceRates(res)
})

router.get("/clearanceRateMedian", (req,res)=>{
  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  cr.getClearanceMedian(criteria,years,res).toArray(function (err,data){
    if (err) {
      console.log(err)
      return
    }
    var result = cr.formatClearance(data,"Median")
    res.json(result)
  })
  //getClearanceRates(res)
})

router.get("/clearanceRateMode", (req,res)=>{

  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  cr.getClearanceMode(criteria,years,res).toArray(function (err, data){
      if (err) {
        console.log(err)
        return
      }
      //console.log(JSON.stringify(data))
      var result = cr.formatClearance(data,"Mode")
      res.json(result)
    })
  //getClearanceRates(res)
})



router.get("/clearanceRateFullAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
            cr.getFullClearanceAvg('$'+criteria,year,res).toArray(function (err, data){
              if (err) {
                console.log(err)
                reject(err)
              }
              for (index in data){
                  data[index]['_id'].anno = year
                  partial.push(data[index])
              }
              resolve(true)
            })
      });
  })

  Promise.all(requests).then(() => {
    var result = cr.formatClearance(partial,"Full Media")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/clearanceRateFullMedian", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []

  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
            cr.getFullClearanceMedian('$'+criteria,year,res).toArray(function (err, data){
              if (err) {
                console.log(err)
                reject(err)
              }
              for (index in data){
                  data[index]['_id'].anno = year
                  partial.push(data[index])
              }
              resolve(true)
            })
      });
  })

  Promise.all(requests).then(() => {
    var result = cr.formatClearance(partial,"Full Mediana")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})

router.get("/clearanceRateFullMode", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
            cr.getFullClearanceMode('$'+criteria,year,res).toArray(function (err, data){
              if (err) {
                console.log(err)
                reject(err)
              }
              for (index in data){
                  data[index]['_id'].anno = year
                  partial.push(data[index])
              }
              resolve(true)
            })
      });
  })

  Promise.all(requests).then(() => {
    var result = cr.formatClearance(partial,"Full Moda")
    res.json(result)
  },(error)=>{
    console.log(error)
  });
})


module.exports = router;
