var round =  require('mongo-round')


//TODO formatClearance debería estar en la vista, no en el controller
function formatP(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var pArray = []

  // //TODO se ve bastaaante feo el randomcolor
  // var color = [];
  // var dynamicColors = function() {
  //   var r = Math.floor(Math.random() * 255);
  //   var g = Math.floor(Math.random() * 255);
  //   var b = Math.floor(Math.random() * 255);
  //   return "rgb(" + r + "," + g + "," + b + ")";
  // };
  data.sort((a,b)=>{
    if (a['_id']['anno'] == b['_id']['anno']){
      if (a['_id']['aggregazione'] != null){
        return (a['_id']['aggregazione']>b['_id']['aggregazione']?1:-1);
      }
      else return a['_id']['anno'] - b['_id']['anno']
    }
    else return a['_id']['anno'] - b['_id']['anno']
  })
  for (index in data){
       var doc = data[index]
       var category = doc['_id'].aggregazione
       if (doc['_id'].aggregazione == null) category = 'Totale'
       category = category + ' -- ' + doc['_id'].anno

       var p = doc['produttivita']
       categoryArray.push(category)
       pArray.push(parseFloat(p.toPrecision(3)))
       // color.push(dynamicColors())
    }
  var datasets=[
    {
      'label':'Produttivita ' + title,
      // backgroundColor: color,
      // borderColor: 'rgba(200, 200, 200, 0.75)',
      // hoverBorderColor: 'rgba(200, 200, 200, 1)',
      'data':pArray
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
        text: 'Produttivita ' + title,
      },
      //TODO Move scales to formatMetric() to set the options according to the metric
      scales: {
        yAxes: [{
          ticks: {
            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
            //beginAtZero: true,
            suggestedMin: 0,
            // // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
            // suggestedMax: 1,
            stepSize: 10,
            // fixedStepSize:0.1,
            // min: -0.1
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


module.exports.formatP = formatP

function getProduttivitaMagistratoAvg(criteria, years){

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
          produttivita:{$avg:{$divide:["$definiti","$magistrati-presenti"]}},
      }
    },
    {
      $project:{
        _id:1,
        produttivita:round('$produttivita',0)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

function getProduttivitaMagistratoMedian(criteria, years, res){
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
        produttivita:{$push:{$divide:["$definiti","$magistrati-presenti"]}}
      }
    },
    {
      "$unwind":"$produttivita"
    },
    {
      "$sort":{
        produttivita:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "produttivita":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "produttivita":1,
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
        produttivita:{
          $push:"$produttivita"
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
        "beginValue":{
          "$arrayElemAt":["$produttivita","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$produttivita","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        produttivita:{
          $avg:["$beginValue","$endValue"]
        }
      }
    },
    {
      $project:{
        _id:1,
        produttivita:round('$produttivita',0)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

function getProduttivitaMagistratoMode(criteria, years, res){

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
          p:round({$avg:{$divide:["$definiti","$magistrati-presenti"]}},0),
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
        pArray:{$push:{'produttivita':'$_id.p','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        pAux:{
          $filter:{
            input: '$pArray',
            as: 'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        produttivita:{$arrayElemAt:['$pAux.produttivita',0]}
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getProduttivitaMagistratoAvg    = getProduttivitaMagistratoAvg
module.exports.getProduttivitaMagistratoMedian = getProduttivitaMagistratoMedian
module.exports.getProduttivitaMagistratoMode   = getProduttivitaMagistratoMode

function getProduttivitaControfattualeAvg(criteria, years){

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
           datiTrib:{$push:{'definiti':'$definiti',
                           'magistrati-presenti':'$magistrati-presenti',
                           'tribunale':'$tribunale'}},
          prodAvg:{$avg:{$divide:['$definiti','$magistrati-presenti']}}
      }
    },
    {
      $unwind:'$datiTrib'
    },
    {
      $project:{
        _id:1,
        prodAvg:round('$prodAvg',0),
        definiti:'$datiTrib.definiti',
        // prodControfattuale:{$divide:['$datiTrib.definiti','$prodAvg']},
        prodReal:round({$divide:['$datiTrib.definiti','$datiTrib.magistrati-presenti']},0),
        prodControfattuale:round({$multiply:['$prodAvg','$datiTrib.magistrati-presenti']},0),
        tribunale:'$datiTrib.tribunale',
        definitiControffatuale:round({$multiply:['$prodAvg','$datiTrib.magistrati-presenti']},0)
      }
    },
    {
      $project:{
        _id:1,
        tribunale:1,
        prodAvg:1,
        prodReal:1,
        definiti:1,
        definitiControffatuale:1,
        // prodControfattuale:1,
        produttivita:round(
          {$multiply:[100,
            {$divide:[{$subtract:['$definiti','$prodControfattuale']},
                                  '$prodControfattuale']}]})
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
    //   console.log(JSON.stringify(data))
    // })
  return result
}

function getProduttivitaControfattualeMedian(criteria, years, res){
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
        prodMedian:{$push:{$divide:["$definiti","$magistrati-presenti"]}},
        datiTrib:{$push:{'definiti':'$definiti',
                        'magistrati-presenti':'$magistrati-presenti',
                        'tribunale':'$tribunale'}},
      }
    },
    {
      "$unwind":"$prodMedian"
    },
    {
      "$sort":{
        prodMedian:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "prodMedian":1,
        'datiTrib':1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "prodMedian":1,
        'datiTrib':1,
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
        prodMedian:{
          $push:"$prodMedian"
        },
        datiTrib:{$first:'$datiTrib'},
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
        prodMedian:1,
        datiTrib:1,
        "beginValue":{
          "$arrayElemAt":["$prodMedian","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$prodMedian","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        datiTrib:1,
        prodMedian:{
          $avg:["$beginValue","$endValue"]
        }
      }
    },
    {
      $unwind:'$datiTrib'
    },
    {
      $project:{
        _id:1,
        datiTrib:1,
        prodControfattuale:round({$multiply:['$prodMedian','$datiTrib.magistrati-presenti']},0)
        // prodMedian:1
      }
    },
    {
      $project:{
        _id:1,
        tribunale:'$datiTrib.tribunale',
        produttivita:round(
          {$multiply:[100,
            {$divide:[{$subtract:['$datiTrib.definiti','$prodControfattuale']},
                                  '$prodControfattuale']}]},0)
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
  //   console.log(JSON.stringify(data))
  // })
  return result
}

function getProduttivitaControfattualeMode(criteria, years, res){

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
          p:round({$avg:{$divide:["$definiti","$magistrati-presenti"]}},0),
        },
        count:{
            $sum: 1
        },
        datiTrib:{$push:{'definiti':'$definiti',
                        'magistrati-presenti':'$magistrati-presenti',
                        'tribunale':'$tribunale'}}
      }
    },
    {
      $group:{
        _id:{
          aggregazione:'$_id.agg',
          'anno':'$_id.ann',
        },
        pArray:{$push:{'produttivita':'$_id.p','count':'$count'}},
        maxCount:{$max:'$count'},
        datiTrib:{$push:'$datiTrib'}
      }
    },
    {
      $unwind:'$datiTrib'
    },
    {
      $project:{
        _id:1,
        datiTrib:1,
        pAux:{
          $filter:{
            input: '$pArray',
            as: 'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        datiTrib:{$arrayElemAt:['$datiTrib',0]},
        prodMode:{$arrayElemAt:['$pAux.produttivita',0]}
      }
    },
    {
      $project:{
        _id:1,
        datiTrib:1,
        prodControfattuale:round({$multiply:['$prodMode','$datiTrib.magistrati-presenti']},0)
        // prodMedian:1
      }
    },
    {
      $project:{
        _id:1,
        tribunale:'$datiTrib.tribunale',
        produttivita:round(
          {$multiply:[100,
            {$divide:[{$subtract:['$datiTrib.definiti','$prodControfattuale']},
                                  '$prodControfattuale']}]},0)
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
  //   console.log(JSON.stringify(data))
  // })
  return result
}


module.exports.getProduttivitaControfattualeAvg    = getProduttivitaControfattualeAvg
module.exports.getProduttivitaControfattualeMedian = getProduttivitaControfattualeMedian
module.exports.getProduttivitaControfattualeMode   = getProduttivitaControfattualeMode
