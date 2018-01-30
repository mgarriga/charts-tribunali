function formatClearance(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var clearanceArray = []
  for (index in data){
       var doc = data[index]
       var category = doc['_id'].aggregazione
       if (doc['_id'].aggregazione == null) category = 'Totale'
       category = category + ' -- ' + doc['_id'].anno

       var clearance = doc['clearance']
       categoryArray.push(category)
       clearanceArray.push(parseFloat(clearance.toPrecision(3)))
    }
  var datasets=[
    {
      'label':'Clearance ' + title,
      'data':clearanceArray
    }
  ]

  var response = {
    "labels":categoryArray,
    "datasets":datasets
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

// TODO: Move function to a script folder with each function doing what it knows
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

module.exports.getClearanceMode = getClearanceMode
