var round =  require('mongo-round')


//TODO formatClearance debería estar en la vista, no en el controller
function formatClearance(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var clearanceArray = []

  // //TODO se ve bastaaante feo el randomcolor
  // var color = [];
  // var dynamicColors = function() {
  //   var r = Math.floor(Math.random() * 255);
  //   var g = Math.floor(Math.random() * 255);
  //   var b = Math.floor(Math.random() * 255);
  //   return "rgb(" + r + "," + g + "," + b + ")";
  // };

  for (index in data){
       var doc = data[index]
       var category = doc['_id'].aggregazione
       if (doc['_id'].aggregazione == null) category = 'Totale'
       category = category + ' -- ' + doc['_id'].anno

       var clearance = doc['clearance']
       categoryArray.push(category)
       clearanceArray.push(parseFloat(clearance.toPrecision(3)))
       // color.push(dynamicColors())
    }
  var datasets=[
    {
      'label':'Clearance ' + title,
      // backgroundColor: color,
      // borderColor: 'rgba(200, 200, 200, 0.75)',
      // hoverBorderColor: 'rgba(200, 200, 200, 1)',
      'data':clearanceArray
    }
  ]

  var response = {
    data:{
      "labels":categoryArray,
      "datasets":datasets
    },
    options:{
      title:{
        display:true,
        text: 'Clearance ' + title,
      },
      scales: {
        yAxes: [{
          ticks: {
            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
            //beginAtZero: true,
            suggestedMin: 0,
            // // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
            // suggestedMax: 1,
            stepSize: 0.1,
            // fixedStepSize:0.1,
            min: -0.1
          }
        }]
      }
    }
  }
  return response
//  console.log(JSON.stringify(response))
}

module.exports.formatClearance = formatClearance

function getClearanceMedian(criteria, years, res){
  var result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years},
      }
    },
    {
      $group:{
        _id:{
          'aggregazione':criteria,
          'anno':'$anno'
        },
        count:{
          $sum:1
        },
        simpleClearance:{
          $push:{$divide:["$definiti","$iscritti"]}
        }
      }
    },
    {
      "$unwind":"$simpleClearance"
    },
    {
      "$sort":{
        simpleClearance:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "simpleClearance":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "simpleClearance":1,
        "midpoint":1,
        "high":{
          $ceil:"$midpoint"
        },
        "low":{
          $floor: "$midpoint"
        }
      }
    },
    {
      $group:{
        _id:"$_id",
        simpleClearance:{
          $push:"$simpleClearance"
        },
        high: {
          $avg: "$high"
        },
        low: {
          $avg: "$low"
        }
      }
    },
    {
      $project:{
        _id:1,
        //simpleClearance:1,
        "beginValue":{
          "$arrayElemAt":["$simpleClearance","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$simpleClearance","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        "clearance":{
          "$avg":["$beginValue","$endValue"]
        }
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getClearanceMedian = getClearanceMedian

function getClearanceAvg(criteria, years, res){

  result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years}
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
            'anno':'$anno'
          },
          clearance:{$avg:{$divide:["$definiti","$iscritti"]}}
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getClearanceAvg = getClearanceAvg

function getClearanceMode(criteria, years, res){

  result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years}
      }
    },
    {
      $group:{
        _id:{
          'agg':criteria,
          'ann':'$anno',
          cle:round({$avg:{$divide:["$definiti","$iscritti"]}},2),
        },
        count:{
            $sum: 1
        }
      }
    },
    {
      $group:{
        _id:{
          aggregazione:'$_id.agg',
          'anno':'$_id.ann',
        },
        clearanceArray:{$push:{'clearance':'$_id.cle','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        clearanceAux:{
          $filter:{
            input: '$clearanceArray',
            as: 'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        clearance:{$arrayElemAt:['$clearanceAux.clearance',0]}
      }
    }
  ])
  return result
}

module.exports.getClearanceMode = getClearanceMode

function getFullClearanceAvg(criteria, year, res){
  years = [year-1,year]
  // console.log(years)

  result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years}
      }
    },
    {
      $group:{
          _id:{
            // First step is to calculate FCR by tribunale.
            // we should keep dimension and area as well, to then group by any of them
            'tribunale':'$tribunale',
            'dimensione':'$dimensione',
            'area':'$area'
            //'aggregazione':criteria,
            //'anno':'$anno'
          },
          definitiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$definiti',false]}
          },
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          pendentiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        definitiAct:{
          '$setDifference':['$definitiAct',[false]]
        },
        iscrittiAct:{
          '$setDifference':['$iscrittiAct',[false]]
        },
        pendentiPre:{
          '$setDifference':['$pendentiPre',[false]]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        fullClearance:{
          $divide:[{$arrayElemAt:["$definitiAct",0]},
                   {$sum:[{$arrayElemAt:["$pendentiPre",0]},
                          {$arrayElemAt:["$iscrittiAct",0]}]}]
        }
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
          },
          clearance:{$avg:'$fullClearance'}
      }
    },
    {
      $project:{
        _id:1,
        clearance:round('$clearance',2)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  // .toArray(function(err,data){
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log(data)
  // })
  return result
}

module.exports.getFullClearanceAvg =  getFullClearanceAvg

function getFullClearanceMedian(criteria, year, res){
  years = [year-1,year]
  // console.log(years)

  result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years}
      }
    },
    {
      $group:{
          _id:{
            // First step is to calculate FCR by tribunale.
            // we should keep dimension and area as well, to then group by any of them
            'tribunale':'$tribunale',
            'dimensione':'$dimensione',
            'area':'$area'
            //'aggregazione':criteria,
            //'anno':'$anno'
          },
          definitiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$definiti',false]}
          },
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          pendentiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        definitiAct:{
          '$setDifference':['$definitiAct',[false]]
        },
        iscrittiAct:{
          '$setDifference':['$iscrittiAct',[false]]
        },
        pendentiPre:{
          '$setDifference':['$pendentiPre',[false]]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        fullClearance:{
          $divide:[{$arrayElemAt:["$definitiAct",0]},
                   {$sum:[{$arrayElemAt:["$pendentiPre",0]},
                          {$arrayElemAt:["$iscrittiAct",0]}]}]
        }
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
          },
          count:{
            $sum:1
          },
          simpleClearance:{$push:'$fullClearance'}
      }
    },
    {
      '$unwind':'$simpleClearance'
    },
    {
      $sort:{
        simpleClearance:1
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'simpleClearance':1,
        'midpoint':{
          $divide:['$count',2]
        }
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'simpleClearance':1,
        'midpoint':1,
        'high':{$ceil:'$midpoint'},
        'low':{$floor:'$midpoint'}
      }
    },
    {
      $group:{
        _id:'$_id',
        simpleClearance:{
          $push:'$simpleClearance'
        },
        high:{$avg:'$high'},
        low:{$avg:'$low'}
      }
    },
    {
      $project:{
        _id:1,
        beginValue:{$arrayElemAt:['$simpleClearance','$high']},
        endValue:  {$arrayElemAt:['$simpleClearance','$low']}
      }
    },
    {
      $project:{
        _id:1,
        'clearance':{$avg:['$beginValue','$endValue']}
      }
    },
    {
      $project:{
        _id:1,
        clearance:round('$clearance',2)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  // .toArray(function(err,data){
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log(data)
  // })
  return result
}


module.exports.getFullClearanceMedian =  getFullClearanceMedian

function getFullClearanceMode(criteria, year, res){
  years = [year-1,year]
  // console.log(years)

  result = db.collection("siecic").aggregate([
    {
      $match:{
        'anno':{$in:years}
      }
    },
    {
      $group:{
          _id:{
            // First step is to calculate FCR by tribunale.
            // we should keep dimension and area as well, to then group by any of them
            'tribunale':'$tribunale',
            'dimensione':'$dimensione',
            'area':'$area'
            //'aggregazione':criteria,
            //'anno':'$anno'
          },
          definitiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$definiti',false]}
          },
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          pendentiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        definitiAct:{
          '$setDifference':['$definitiAct',[false]]
        },
        iscrittiAct:{
          '$setDifference':['$iscrittiAct',[false]]
        },
        pendentiPre:{
          '$setDifference':['$pendentiPre',[false]]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        fullClearance:{
          $divide:[{$arrayElemAt:["$definitiAct",0]},
                   {$sum:[{$arrayElemAt:["$pendentiPre",0]},
                          {$arrayElemAt:["$iscrittiAct",0]}]}]
        }
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
            cle:round('$fullClearance',2),
          },
          count:{
            $sum:1
          }
      }
    },
    {
      $group:{
        _id:{
          aggregazione:'$_id.aggregazione'
        },
        clearanceArray:{$push:{'clearance':'$_id.cle','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        clearanceAux:{
          $filter:{
            input:'$clearanceArray',
            as:'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        clearance:round({$arrayElemAt:['$clearanceAux.clearance',0]},2)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  // .toArray(function(err,data){
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log(data)
  // })
  return result
}

module.exports.getFullClearanceMode =  getFullClearanceMode
