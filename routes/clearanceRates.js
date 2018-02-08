
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

module.exports = router;
