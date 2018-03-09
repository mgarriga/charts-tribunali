var round =  require('mongo-round')


//TODO formatClearance debería estar en la vista, no en el controller
function formatDP(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var dpArray = []

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

       var dp = doc['durataPrognostica']
       categoryArray.push(category)
       dpArray.push(parseFloat(dp.toPrecision(3)))
       // color.push(dynamicColors())
    }
  var datasets=[
    {
      'label':'Durata Prognostica ' + title,
      // backgroundColor: color,
      // borderColor: 'rgba(200, 200, 200, 0.75)',
      // hoverBorderColor: 'rgba(200, 200, 200, 1)',
      'data':dpArray
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
        text: 'Durata Prognostica ' + title,
      },
      //TODO Move scales to formatMetric() to set the options according to the metric
      scales: {
        yAxes: [{
          ticks: {
            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
            //beginAtZero: true,
            suggestedMin: 180,
            // // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
            // suggestedMax: 1,
            stepSize: 20,
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


module.exports.formatDP = formatDP

function getDurataPrognosticaAvg(criteria, years){

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
          durataPrognostica:{$avg:{$multiply:[365,{$divide:["$pendenti","$definiti"]}]}}
      }
    },
    {
      $project:{
        _id:1,
        durataPrognostica:round('$durataPrognostica',0)
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

function getDurataPrognosticaMedian(criteria, years, res){
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
        durataPrognostica:{$push:{$multiply:[365,{$divide:["$pendenti","$definiti"]}]}}
      }
    },
    {
      "$unwind":"$durataPrognostica"
    },
    {
      "$sort":{
        durataPrognostica:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "durataPrognostica":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "durataPrognostica":1,
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
        durataPrognostica:{
          $push:"$durataPrognostica"
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
          "$arrayElemAt":["$durataPrognostica","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$durataPrognostica","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        durataPrognostica:{
          $avg:["$beginValue","$endValue"]
        }
      }
    },
    {
      $project:{
        _id:1,
        durataPrognostica:round('$durataPrognostica',0)
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

function getDurataPrognosticaMode(criteria, years, res){

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
          dp:round({$avg:{$multiply:[365,{$divide:["$pendenti","$definiti"]}]}},0),
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
        dpArray:{$push:{'durataPrognostica':'$_id.dp','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        dpAux:{
          $filter:{
            input: '$dpArray',
            as: 'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        durataPrognostica:{$arrayElemAt:['$dpAux.durataPrognostica',0]}
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}


module.exports.getDurataPrognosticaAvg    = getDurataPrognosticaAvg
module.exports.getDurataPrognosticaMedian = getDurataPrognosticaMedian
module.exports.getDurataPrognosticaMode   = getDurataPrognosticaMode
