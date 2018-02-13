var round =  require('mongo-round')


//TODO formatClearance debería estar en la vista, no en el controller
function formatUT(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var utArray = []

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

       var ut = doc['ultraTriennale']
       categoryArray.push(category)
       utArray.push(parseFloat(ut.toPrecision(3)))
       // color.push(dynamicColors())
    }
  var datasets=[
    {
      'label':'Ultra Triennale ' + title,
      // backgroundColor: color,
      // borderColor: 'rgba(200, 200, 200, 0.75)',
      // hoverBorderColor: 'rgba(200, 200, 200, 1)',
      'data':utArray
    }
  ]

  var response = {
    "labels":categoryArray,
    "datasets":datasets
  }
  return response
//  console.log(JSON.stringify(response))
}

module.exports.formatUT = formatUT


function getUTInterannualeAvg(criteria, year, res){
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
          pendUtAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti-ultra-triennali',false]}
          },
          pendTotAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti',false]}
          },
          pendUtPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti-ultra-triennali']}
          },
          pendTotPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$setDifference:['$pendUtAct', [false]]},
        pendTotAct:{$setDifference:['$pendTotAct',[false]]},
        pendUtPre: {$setDifference:['$pendUtPre', [false]]},
        pendTotPre:{$setDifference:['$pendTotPre',[false]]},
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$arrayElemAt:['$pendUtAct', 0]},
        pendTotAct:{$arrayElemAt:['$pendTotAct',0]},
        pendUtPre: {$arrayElemAt:['$pendUtPre', 0]},
        pendTotPre:{$arrayElemAt:['$pendTotPre',0]},
      }
    },
    // {
    //   $project:{
    //     _id:1,
    //     tpendUtAct: {$type:'$pendUtAct'},
    //     tpendTotAct:{$type:'$pendTotAct'},
    //     tpendUtPre: {$type:'$pendUtPre'},
    //     tpendTotPre:{$type:'$pendTotPre'},
    //     tsimpleClearance:{$type:'$simpleClearance'}
    //   }
    // }
    {
      $project:{
        _id:1,
        pendUtActPerc:{
          $divide:[{$multiply:["$pendUtAct",100]},"$pendTotAct"]
        },
        pendUtPrePerc:{
          $divide:[{$multiply:["$pendUtPre",100]},"$pendTotPre"]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        utInterannuale:{$divide:[{$subtract:['$pendUtActPerc',
                                             '$pendUtPrePerc']},
                                '$pendUtPrePerc']}
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
          },
          utInterannuale:{$avg:'$utInterannuale'}
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:round('$utInterannuale',2)
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

function getUTInterannualeMedian(criteria, year, res){
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
            'tribunale':'$tribunale',
            'dimensione':'$dimensione',
            'area':'$area'
          },
          pendUtAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti-ultra-triennali',false]}
          },
          pendTotAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti',false]}
          },
          pendUtPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti-ultra-triennali']}
          },
          pendTotPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$setDifference:['$pendUtAct', [false]]},
        pendTotAct:{$setDifference:['$pendTotAct',[false]]},
        pendUtPre: {$setDifference:['$pendUtPre', [false]]},
        pendTotPre:{$setDifference:['$pendTotPre',[false]]},
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$arrayElemAt:['$pendUtAct', 0]},
        pendTotAct:{$arrayElemAt:['$pendTotAct',0]},
        pendUtPre: {$arrayElemAt:['$pendUtPre', 0]},
        pendTotPre:{$arrayElemAt:['$pendTotPre',0]},
      }
    },
    // {
    //   $project:{
    //     _id:1,
    //     tpendUtAct: {$type:'$pendUtAct'},
    //     tpendTotAct:{$type:'$pendTotAct'},
    //     tpendUtPre: {$type:'$pendUtPre'},
    //     tpendTotPre:{$type:'$pendTotPre'},
    //     tsimpleClearance:{$type:'$simpleClearance'}
    //   }
    // }
    {
      $project:{
        _id:1,
        pendUtActPerc:{
          $divide:[{$multiply:["$pendUtAct",100]},"$pendTotAct"]
        },
        pendUtPrePerc:{
          $divide:[{$multiply:["$pendUtPre",100]},"$pendTotPre"]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        utInterannuale:{$divide:[{$subtract:['$pendUtActPerc',
                                             '$pendUtPrePerc']},
                                '$pendUtPrePerc']}
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
          utInterannuale:{$push:'$utInterannuale'}
      }
    },
    {
      $unwind:'$utInterannuale'
    },
    {
      $sort:{
        utInterannuale:1
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'utInterannuale':1,
        'midpoint':{
          $divide:['$count',2]
        }
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'utInterannuale':1,
        'midpoint':1,
        'high':{$ceil:'$midpoint'},
        'low':{$floor:'$midpoint'}
      }
    },
    {
      $group:{
        _id:'$_id',
        utInterannuale:{
          $push:'$utInterannuale'
        },
        high:{$avg:'$high'},
        low:{$avg:'$low'}
      }
    },
    {
      $project:{
        _id:1,
        beginValue:{$arrayElemAt:['$utInterannuale','$high']},
        endValue:  {$arrayElemAt:['$utInterannuale','$low']}
      }
    },
    {
      $project:{
        _id:1,
        utInterannuale:{$avg:['$beginValue','$endValue']}
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:round('$utInterannuale',2)
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

function getUTInterannualeMode(criteria, year, res){
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
          pendUtAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti-ultra-triennali',false]}
          },
          pendTotAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$pendenti',false]}
          },
          pendUtPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti-ultra-triennali']}
          },
          pendTotPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$pendenti']}
          }
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$setDifference:['$pendUtAct', [false]]},
        pendTotAct:{$setDifference:['$pendTotAct',[false]]},
        pendUtPre: {$setDifference:['$pendUtPre', [false]]},
        pendTotPre:{$setDifference:['$pendTotPre',[false]]},
      }
    },
    {
      $project:{
        _id:1,
        pendUtAct: {$arrayElemAt:['$pendUtAct', 0]},
        pendTotAct:{$arrayElemAt:['$pendTotAct',0]},
        pendUtPre: {$arrayElemAt:['$pendUtPre', 0]},
        pendTotPre:{$arrayElemAt:['$pendTotPre',0]},
      }
    },
    {
      $project:{
        _id:1,
        pendUtActPerc:{
          $divide:[{$multiply:["$pendUtAct",100]},"$pendTotAct"]
        },
        pendUtPrePerc:{
          $divide:[{$multiply:["$pendUtPre",100]},"$pendTotPre"]
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        utInterannuale:{
          $divide:[{$subtract:['$pendUtActPerc',
                               '$pendUtPrePerc']},
                  '$pendUtPrePerc']
        }
      }
    },
    {
      $group:{
        _id:{
          'aggregazione':criteria,
          utI:round('$utInterannuale',2)
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
        utArray:{$push:{'ut':'$_id.utI','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        utAux:{
          $filter:{
            input:'$utArray',
            as:'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:round({$arrayElemAt:['$utAux.ut',0]},2)
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

module.exports.getUTInterannualeAvg    =  getUTInterannualeAvg
module.exports.getUTInterannualeMedian =  getUTInterannualeMedian
module.exports.getUTInterannualeMode   =  getUTInterannualeMode

//-------------------------------------------------------------------------

function getUTSuPendentiAvg(criteria, years, res){

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
          ultraTriennale:{$avg:{$divide:["$pendenti-ultra-triennali","$pendenti"]}}
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:round('$ultraTriennale',2)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

function getUTSuPendentiMedian(criteria, years, res){
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
        ultraTriennale:{
          $push:{$divide:["$pendenti-ultra-triennali","$pendenti"]}
        }
      }
    },
    {
      "$unwind":"$ultraTriennale"
    },
    {
      "$sort":{
        ultraTriennale:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "ultraTriennale":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "ultraTriennale":1,
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
        ultraTriennale:{
          $push:"$ultraTriennale"
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
          "$arrayElemAt":["$ultraTriennale","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$ultraTriennale","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:{
          $avg:["$beginValue","$endValue"]
        }
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:round('$ultraTriennale',2)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

function getUTSuPendentiMode(criteria, years, res){

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
          ut:round({$avg:{$divide:["$pendenti-ultra-triennali","$pendenti"]}},2),
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
        utArray:{$push:{'ultraTriennale':'$_id.ut','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        utAux:{
          $filter:{
            input: '$utArray',
            as: 'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        ultraTriennale:{$arrayElemAt:['$utAux.ultraTriennale',0]}
      }
    }
  ])
  return result
}


module.exports.getUTSuPendentiAvg    = getUTSuPendentiAvg
module.exports.getUTSuPendentiMedian = getUTSuPendentiMedian
module.exports.getUTSuPendentiMode   = getUTSuPendentiMode
