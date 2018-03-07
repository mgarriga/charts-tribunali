
var express = require('express');
var router = express.Router();

var cr = require('../controller/clearanceRates')
var tr = require('../controller/tribunali')
var utils = require('../utils/utils')

router.get("/clearanceRateAverage", (req,res)=>{

  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  cr.getClearanceAvg(criteria,years).toArray(function (err, data){
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
  cr.getClearanceMedian(criteria,years).toArray(function (err,data){
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
  cr.getClearanceMode(criteria,years).toArray(function (err, data){
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
            cr.getFullClearanceAvg('$'+criteria,year).toArray(function (err, data){
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
            cr.getFullClearanceMedian('$'+criteria,year).toArray(function (err, data){
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
            cr.getFullClearanceMode('$'+criteria,year).toArray(function (err, data){
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


// By Tribunale -----------------------------------------------------------

router.get("/clearanceRateByTribunaleAverage", (req,res)=>{
  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map((year)=>{
    return parseInt(year)
  })

  var results = []
  var result1,result2,result3 = null
  getClearanceByTribunale('Average',tribunale,criteria,years,(result1)=>{
    results.push(result1)
    getDefinitiByTribunale('Average',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getIscrittiByTribunale('Average',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/clearanceRateByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var results = []
  var result1, result2, result3 = null
  getClearanceByTribunale('Median',tribunale,criteria,years,(result1)=>{
    results.push(result1)
    getDefinitiByTribunale('Median',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getIscrittiByTribunale('Median',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  })
})

router.get("/clearanceRateByTribunaleMode", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria

  var years = req.query.years.map(function(year){
    return parseInt(year)
  })

  getClearanceByTribunale('Mode',tribunale,criteria,years,(result)=>{
    res.json(result)
  })
})

router.get("/clearanceRateFullByTribunaleAverage", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial = []
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
        getFullClearanceByTribunale('Average',tribunale,criteria,year,(err,result1)=>{
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
    // console.log('done')
    getDefinitiByTribunale('Average',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getIscrittiByTribunale('Average',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        var formatRes = cr.formatClearance(partial,"Rate Full Media")
        results.splice(0,0,formatRes)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
  },(error)=>{
    console.log(error)
  });
})


router.get("/clearanceRateFullByTribunaleMedian", (req,res)=>{

  var tribunale = req.query.tribunale
  var criteria  = req.query.criteria
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  var partial = []
  var results = []
  var result1 = null
  var result2 = null
  var result3 = null
  let requests = years.map((year) => {
      return new Promise((resolve,reject) => {
        getFullClearanceByTribunale('Median',tribunale,criteria,year,(err,result1)=>{
          if (err){
            console.log(err)
            reject(err)
          }
          partial = partial.concat(result1)
          resolve(true)
        })
      })
  })



  //       cr.getFullClearanceMedian('$tribunale',year).toArray(function (err, data){
  //         if (err) {
  //           console.log(err)
  //           reject(err)
  //         }
  //
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
  //
  //           cr.getFullClearanceMedian('$'+criteria,year).toArray(function (err, data){
  //             if (err) {
  //               console.log(err)
  //               reject(err)
  //             }
  //             // console.log(data)
  //
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
  //     });
  // })

  Promise.all(requests).then(() => {
    getDefinitiByTribunale('Median',tribunale,criteria,years,(result2)=>{
      results.push(result2)
      getIscrittiByTribunale('Median',tribunale,criteria,years,(result3)=>{
        results.push(result3)
        var formatRes = cr.formatClearance(partial,"Rate Full Mediana")
        results.splice(0,0,formatRes)
        utils.joinResults(results,(result)=>{
          res.json(result)
        })
      })
    })
    // console.log('done')
    // var result = cr.formatClearance(partial,"Median")
    // res.json(result)
  },(error)=>{
    console.log(error)
  });

})

function getFullClearanceByTribunale(metric,tribunale,criteria,year,callback){
  switch(metric) {
      case 'Average':
          funct = cr.getFullClearanceAvg
          break;
      case 'Median':
          funct = cr.getFullClearanceMedian
          break;
      case 'Mode':
          funct = cr.getFullClearanceMode
          break;
      default:
          funct = cr.getFullClearanceAvg
  }
  tr.getTribunaleDetail(tribunale).toArray((err,data)=>{
    if (err) {
      console.log(err)
      return
    }
    var filter
    for (index in data){
      filter = data[index]
    }
    var partial = []
    funct('$tribunale',year).toArray((err, data)=>{
      if (err) {
        console.log(err)
        return
      }
      for (index in data){
        var doc = data[index]
        if (doc['_id'].aggregazione == tribunale){
          doc['_id'].anno = year
          partial.push(doc)
        }
      }
      funct('$'+criteria,year).toArray((err, data) => {
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria]){
            data[index]['_id'].anno = year
            partial.push(data[index])
          }
        }
        // var result = cr.formatClearance(partial,title)
        callback(null,partial)
      })
    })
  })
}


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

        cr.getFullClearanceMode('$tribunale',year).toArray(function (err, data){
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

            cr.getFullClearanceMode('$'+criteria,year).toArray(function (err, data){
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



function getClearanceByTribunale(metric,tribunale,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = cr.getClearanceAvg
          title = "Media"
          break;
      case 'Median':
          funct = cr.getClearanceMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = cr.getClearanceMode
          title = "Moda"
          break;
      default:
          funct = cr.getClearanceAvg
          title = "Media"
  }
  tr.getTribunaleDetail(tribunale).toArray((err,data)=>{
    if (err) {
      console.log(err)
      return
    }
    var filter
    for (index in data){
      filter = data[index]
    }
    var partial = []
    funct('$tribunale',years).toArray((err, data)=>{
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
      funct('$'+criteria,years).toArray((err, data) => {
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria])
            partial.push(data[index])
        }
        var result = cr.formatClearance(partial,title)
        callback(result)
      })
    })
  })
}

function getDefinitiByTribunale(metric,tribunale,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = cr.getDefinitiAvg
          title = "Media"
          break;
      case 'Median':
          funct = cr.getDefinitiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = cr.getDefinitiMode
          title = "Moda"
          break;
      default:
          funct = cr.getDefinitiAvg
          title = "Media"
  }
  tr.getTribunaleDetail(tribunale).toArray((err,data)=>{
    if (err) {
      console.log(err)
      return
    }
    var filter
    for (index in data){
      filter = data[index]
    }
    var partial = []
    funct('$tribunale',years).toArray((err, data)=>{
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
      funct('$'+criteria,years).toArray((err, data) => {
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria])
            partial.push(data[index])
        }
        var result = utils.formatTable(partial,"Definiti " + title)
        callback(result)
      })
    })
  })
}

function getIscrittiByTribunale(metric,tribunale,criteria,years,callback){
  var partial = []
  var title   = ""
  switch(metric) {
      case 'Average':
          funct = cr.getIscrittiAvg
          title = "Media"
          break;
      case 'Median':
          funct = cr.getIscrittiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = cr.getIscrittiMode
          title = "Moda"
          break;
      default:
          funct = cr.getIscrittiAvg
          title = "Media"
  }
  tr.getTribunaleDetail(tribunale).toArray((err,data)=>{
    if (err) {
      console.log(err)
      return
    }
    var filter
    for (index in data){
      filter = data[index]
    }
    funct('$tribunale',years).toArray((err, data)=>{
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
      funct('$'+criteria,years).toArray((err, data) => {
        if (err) {
          console.log(err)
          return
        }
        for (index in data){
          if (data[index]['_id'].aggregazione == filter[criteria])
            partial.push(data[index])
        }
        var result = utils.formatTable(partial,"Iscritti " + title)
        callback(result)
      })
    })
  })
}


module.exports = router;
