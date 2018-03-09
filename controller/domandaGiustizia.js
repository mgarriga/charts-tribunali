var round =  require('mongo-round')
function formatDG(data,title){
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
  // data.sort( function(a,b){return a['_id']['anno'] - b['_id']['anno']})
  // data.sort( function(a,b){return a['_id']['aggregazione'] - b['_id']['aggregazione']})
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

       var ut = doc['domandaGiustizia']
       categoryArray.push(category)
       utArray.push(parseFloat(ut.toPrecision(3)))
       // color.push(dynamicColors())
    }
  var datasets=[
    {
      'label':'Domanda di Giustizia ' + title,
      // backgroundColor: color,
      // borderColor: 'rgba(200, 200, 200, 0.75)',
      // hoverBorderColor: 'rgba(200, 200, 200, 1)',
      'data':utArray
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
        text: 'Domanda di Giustizia ' + title,
      },
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

module.exports.formatDG = formatDG


function getDomandaGiustiziaAvg(criteria, year){
  years = [year-1,year]
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
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          iscrittiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$iscritti']}
          },
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct: {$setDifference:['$iscrittiAct', [false]]},
        iscrittiPre: {$setDifference:['$iscrittiPre', [false]]},
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct:{$arrayElemAt:['$iscrittiAct', 0]},
        iscrittiPre:{$arrayElemAt:['$iscrittiPre',0]},
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:{
          $divide:[{$subtract:['$iscrittiAct','$iscrittiPre']},'$iscrittiPre']
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        domandaGiustizia:round({$multiply:['$domandaGiustizia',100]},0)
      }
    },
    {
      $group:{
          _id:{
            'aggregazione':criteria,
          },
          domandaGiustizia:{$avg:'$domandaGiustizia'}
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:round('$domandaGiustizia',0)
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

function getDomandaGiustiziaMedian(criteria, year){
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
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          iscrittiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$iscritti']}
          },
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct: {$setDifference:['$iscrittiAct', [false]]},
        iscrittiPre: {$setDifference:['$iscrittiPre', [false]]},
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct:{$arrayElemAt:['$iscrittiAct', 0]},
        iscrittiPre:{$arrayElemAt:['$iscrittiPre', 0]},
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:{
          $divide:[{$subtract:['$iscrittiAct','$iscrittiPre']},'$iscrittiPre']
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        domandaGiustizia:1
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
          domandaGiustizia:{$push:'$domandaGiustizia'}
      }
    },
    {
      $unwind:'$domandaGiustizia'
    },
    {
      $sort:{
        domandaGiustizia:1
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'domandaGiustizia':1,
        'midpoint':{
          $divide:['$count',2]
        }
      }
    },
    {
      $project:{
        '_id':1,
        'count':1,
        'domandaGiustizia':1,
        'midpoint':1,
        'high':{$ceil:'$midpoint'},
        'low':{$floor:'$midpoint'}
      }
    },
    {
      $group:{
        _id:'$_id',
        domandaGiustizia:{
          $push:'$domandaGiustizia'
        },
        high:{$avg:'$high'},
        low:{$avg:'$low'}
      }
    },
    {
      $project:{
        _id:1,
        beginValue:{$arrayElemAt:['$domandaGiustizia','$high']},
        endValue:  {$arrayElemAt:['$domandaGiustizia','$low']}
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:{$avg:['$beginValue','$endValue']}
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:round({$multiply:['$domandaGiustizia',100]},0)
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


function getDomandaGiustiziaMode(criteria, year){
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
          iscrittiAct:{
            $push:{$cond:[{$eq:['$anno',year]},'$iscritti',false]}
          },
          iscrittiPre:{
            $push:{$cond:[{$eq:['$anno',year]},false,'$iscritti']}
          },
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct: {$setDifference:['$iscrittiAct', [false]]},
        iscrittiPre: {$setDifference:['$iscrittiPre', [false]]},
      }
    },
    {
      $project:{
        _id:1,
        iscrittiAct:{$arrayElemAt:['$iscrittiAct', 0]},
        iscrittiPre:{$arrayElemAt:['$iscrittiPre', 0]},
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:{
          $divide:[{$subtract:['$iscrittiAct','$iscrittiPre']},'$iscrittiPre']
        }
      }
    },
    {
      $project:{
        _id:1,
        'tribunale':'$_id.tribunale',
        'dimensione':'$_id.dimensione',
        'area':'$_id.area',
        domandaGiustizia:1
      }
    },
    {
      $group:{
        _id:{
          'aggregazione':criteria,
          domandaGiustizia:round({$multiply:['$domandaGiustizia',100]},0)
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
        dgArray:{$push:{'dg':'$_id.domandaGiustizia','count':'$count'}},
        maxCount:{$max:'$count'}
      }
    },
    {
      $project:{
        _id:1,
        dgAux:{
          $filter:{
            input:'$dgArray',
            as:'pair',
            cond:{$gte:['$$pair.count','$maxCount']}
          }
        }
      }
    },
    {
      $project:{
        _id:1,
        domandaGiustizia:{$arrayElemAt:['$dgAux.dg',0]}
      }
    },
    // {
    //   $project:{
    //     _id:1,
    //     ultraTriennale:round({$multiply:['$ultraTriennale',100]},0)
    //   }
    // },
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


module.exports.getDomandaGiustiziaAvg    = getDomandaGiustiziaAvg
module.exports.getDomandaGiustiziaMedian = getDomandaGiustiziaMedian
module.exports.getDomandaGiustiziaMode   = getDomandaGiustiziaMode
