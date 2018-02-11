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
})

//TODO maybe would be better to have a parameter indicating the metric and then
// calling the specific function within the method (median/mean/mode)

router.get("/clearanceRateByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  cr.getClearanceMedian('$tribunale',years,res).toArray(function (err, data){
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
      cr.getClearanceMedian('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = cr.formatClearance(partial,"Median")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
})

router.get("/clearanceRateByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []
  cr.getClearanceMode('$tribunale',years,res).toArray(function (err, data){
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
      cr.getClearanceMode('$'+criteria,years,res).toArray(function (err, data){
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]) partial.push(data[index])
        }
        var result = cr.formatClearance(partial,"Mode")
        res.json(result)
      })
      //getClearanceRates(res)
    })
  })
})

router.get("/clearanceRateFullByTribunaleAverage", (req,res)=>{

  // console.log("puto el que lee")

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  partial = []


  // for (index in years){
  //   year = years[index]
  // }

  //TODO llamar dentro del for para cada año
  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
//        asyncFunction(year, resolve);
        // console.log(year)
        cr.getFullClearanceAvg('$tribunale',year,res).toArray(function (err, data){
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
            cr.getFullClearanceAvg('$'+criteria,year,res).toArray(function (err, data){
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
      });
  })

  Promise.all(requests).then(() => {
    // console.log('done')
    var result = cr.formatClearance(partial,"Average")
    res.json(result)
  },(error)=>{
    console.log(error)
  });

})

router.get("/clearanceRateFullByTribunaleMedian", (req,res)=>{

  // console.log("puto el que lee")

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

        cr.getFullClearanceMedian('$tribunale',year,res).toArray(function (err, data){
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

            cr.getFullClearanceMedian('$'+criteria,year,res).toArray(function (err, data){
              if (err) {
                console.log(err)
                reject(err)
              }
              // console.log(data)

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
      });
  })

  Promise.all(requests).then(() => {
    // console.log('done')
    var result = cr.formatClearance(partial,"Median")
    res.json(result)
  },(error)=>{
    console.log(error)
  });

})

router.get("/clearanceRateFullByTribunaleMode", (req,res)=>{

  // console.log("puto el que lee")

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

        cr.getFullClearanceMode('$tribunale',year,res).toArray(function (err, data){
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

            cr.getFullClearanceMode('$'+criteria,year,res).toArray(function (err, data){
              if (err) {
                console.log(err)
                reject(err)
              }
              // console.log(data)

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
      });
  })

  Promise.all(requests).then(() => {
    // console.log('done')
    var result = cr.formatClearance(partial,"Mode")
    res.json(result)
  },(error)=>{
    console.log(error)
  });

})

module.exports = router;
