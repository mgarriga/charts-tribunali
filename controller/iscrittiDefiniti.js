var round = require('mongo-round')
var utils = require('../utils/utils')
var tr = require('./tribunali')

function getDefinitiAvg(criteria, years){

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
          definiti:{$avg:"$definiti"}
      }
    },
    {
      $project:{
        _id:1,
        rawNumbers:[{'label':'Definiti','data':round('$definiti',0)}]
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getDefinitiAvg = getDefinitiAvg

function getDefinitiMedian(criteria, years){
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
        definiti:{
          $push:"$definiti"
        }
      }
    },
    {
      "$unwind":"$definiti"
    },
    {
      "$sort":{
        definiti:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "definiti":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "definiti":1,
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
        definiti:{
          $push:"$definiti"
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
          "$arrayElemAt":["$definiti","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$definiti","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        "definiti":{
          "$avg":["$beginValue","$endValue"]
        }
      }
    },
    {
      $project:{
        _id:1,
        rawNumbers:[{'label':'Definiti','data':round('$definiti',0)}]
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getDefinitiMedian = getDefinitiMedian


function getIscrittiAvg(criteria, years){

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
          iscritti:{$avg:"$iscritti"}
      }
    },
    {
      $project:{
        _id:1,
        rawNumbers:[{'label':'Iscritti','data':round('$iscritti',0)}]
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getIscrittiAvg = getIscrittiAvg

function getIscrittiMedian(criteria, years){
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
        iscritti:{
          $push:"$iscritti"
        }
      }
    },
    {
      "$unwind":"$iscritti"
    },
    {
      "$sort":{
        iscritti:1
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "iscritti":1,
        "midpoint":{
          $divide:["$count",2]
        }
      }
    },
    {
      $project:{
        "_id":1,
        "count":1,
        "iscritti":1,
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
        iscritti:{
          $push:"$iscritti"
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
          "$arrayElemAt":["$iscritti","$high"]
        },
        "endValue":{
          "$arrayElemAt":["$iscritti","$low"]
        },
      }
    },
    {
      $project:{
        _id:1,
        "iscritti":{
          "$avg":["$beginValue","$endValue"]
        }
      }
    },
    {
      $project:{
        _id:1,
        rawNumbers:[{'label':'Iscritti','data':round('$iscritti',0)}]
      }
    },
    {
      $sort:{_id:1}
    }
  ])
  return result
}

module.exports.getIscrittiMedian = getIscrittiMedian

function getDefinitiByTribunale(metric,tribunale,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = getDefinitiAvg
          title = "Media"
          break;
      case 'Median':
          funct = getDefinitiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = getDefinitiMode
          title = "Moda"
          break;
      default:
          funct = getDefinitiAvg
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

module.exports.getDefinitiByTribunale = getDefinitiByTribunale


function getIscrittiByTribunale(metric,tribunale,criteria,years,callback){
  var partial = []
  var title   = ""
  switch(metric) {
      case 'Average':
          funct = getIscrittiAvg
          title = "Media"
          break;
      case 'Median':
          funct = getIscrittiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = getIscrittiMode
          title = "Moda"
          break;
      default:
          funct = getIscrittiAvg
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

module.exports.getIscrittiByTribunale = getIscrittiByTribunale

function getDefiniti(metric,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = getDefinitiAvg
          title = "Media"
          break;
      case 'Median':
          funct = getDefinitiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = getDefinitiMode
          title = "Moda"
          break;
      default:
          funct = getDefinitiAvg
          title = "Media"
  }
  var partial = []
  funct('$'+criteria,years).toArray((err, data) => {
    if (err) {
      console.log(err)
      return
    }
    for (index in data){
        partial.push(data[index])
    }
    var result = utils.formatTable(partial,"Definiti " + title)
    callback(result)
  })
}

module.exports.getDefiniti = getDefiniti

function getIscritti(metric,criteria,years,callback){
  switch(metric) {
      case 'Average':
          funct = getIscrittiAvg
          title = "Media"
          break;
      case 'Median':
          funct = getIscrittiMedian
          title = "Mediana"
          break;
      case 'Mode':
          funct = getIscrittiMode
          title = "Moda"
          break;
      default:
          funct = getIscrittiAvg
          title = "Media"
  }
  var partial = []
  funct('$'+criteria,years).toArray((err, data) => {
    if (err) {
      console.log(err)
      return
    }
    for (index in data){
        partial.push(data[index])
    }
    var result = utils.formatTable(partial,"Iscritti " + title)
    callback(result)
  })
}
module.exports.getIscritti = getIscritti
