var round =  require('mongo-round')

function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
//TODO formatClearance debería estar en la vista, no en el controller
function formatClearance(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var clearanceArray = []
  // var rawNums =
  // //TODO se ve bastaaante feo el randomcolor
  var color = []
  var dynamicColors = function(num) {
    // var colors = [
    //   "(114, 147, 203)",
    //   "(225, 151, 76)",
    //   "(132, 186, 91)",
    //   "(211, 94, 96)",
    //   "(128, 133, 133)",
    //   "(144, 103, 167)",
    //   "(171, 104, 87)",
    //   "(204, 194, 16)",
    //   "(230, 25, 75)",
    //   "(60, 180, 75)",
    //   "(255, 225, 25)",
    //   "(0, 130, 200)",
    //   "(245, 130, 48)",
    //   "(145, 30, 180)",
    //   "(210, 245, 60)",
    //   "(250, 190, 190)",
    //   "(0, 128, 128)",
    //   "(230, 190, 255)",
    //   "(170, 110, 40)",
    //   "(255, 250, 200)",
    //   "(170, 255, 195)",
    //   "(128, 128, 0)",
    //   "(255, 215, 180)",
    //   "(0, 0, 128)",
    //   "(128, 128, 128)"
    // ]
    //
    // var index = num % 23
    // return "rgb"+colors[index]


    var r = Math.abs(num) % 255;
    var g = Math.abs(num) % 254;
    var b = Math.abs(num) % 253;
    // console.log("r: " + r + " g: " + g + " b: " + b)
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  data.sort((a,b)=>{
    if (a['_id']['anno'] == b['_id']['anno']){
      if (a['_id']['aggregazione'] != null){
        return (a['_id']['aggregazione']>b['_id']['aggregazione']?1:-1);
      }
      else return a['_id']['anno'] - b['_id']['anno']
    }
    else return a['_id']['anno'] - b['_id']['anno']
  })
  var hash = 0
  for (index in data){
       var doc = data[index]
       var category = doc['_id'].aggregazione
       if (doc['_id'].aggregazione == null) category = 'Totale'
       category = category + ' -- ' + doc['_id'].anno

       var clearance = doc['clearance']
       categoryArray.push(category)
       clearanceArray.push(parseFloat(clearance.toPrecision(3)))
       // console.log(category)
       hash = hashCode(category)
       // console.log(hash)
       // color.push(dynamicColors(hash+parseInt(doc['_id'].anno)))

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
            suggestedMax: 1,
            stepSize: 0.1,
            // fixedStepSize:0.1,
          }
        }]
      }
    },
    tabularData:{
      'labels':categoryArray,
      'datasets':datasets
    }
  }
  return response
//  console.log(JSON.stringify(response))
}

module.exports.formatClearance = formatClearance

function getClearanceMedian(criteria, years){
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

function getClearanceAvg(criteria, years){

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

function getClearanceMode(criteria, years){

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
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getClearanceMode = getClearanceMode

function getFullClearanceAvg(criteria, year){
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
            //'anno':'$anno'
            //'aggregazione':criteria,
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

function getFullClearanceMedian(criteria, year){
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

function getFullClearanceMode(criteria, year){
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
