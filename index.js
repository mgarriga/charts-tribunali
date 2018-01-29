//index.js
const path        = require('path')
const express     = require('express')
const exphbs      = require('express-handlebars')
const bodyParser  = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const chartJs     = require('chart.js')
const app         = express()


//http://52.27.220.158:5001

// initializes the handlebars engine and sets the layouts
//directory to views/layouts
app.engine('.hbs', exphbs({
  defaultLayout: 'main-charts',
  extname: '.hbs',
  layoutsDir: path.join(__dirname,'views/layouts')
}))

app.set('view engine','.hbs')

app.set('views',path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(request,response) =>{
  //Render takes the name of the view (home) and the data to render (name)
  response.render('home',{
    name:'Martin'
  })
})

MongoClient.connect('mongodb://test:test@ds251737.mlab.com:51737/tribunali', (err, database) => {
  if (err) return console.log(err)
  db = database.db('tribunali')
  app.listen(3000, () =>{
    console.log('listening on 3000')
  })
})

app.get('/charts',(request,response) =>{
  //var cursor = db.collection('quotes').find().toArray(function(err, results){
  //  console.log(results)
    //getData(response)
    response.render('charts')
  //})
  //Render takes the name of the view (home) and the data to render (name)
  //response.render('home',{
  //  name:'Martin'
  //})
})

app.get("/clearanceRateAverage", (req,res)=>{


  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  console.log(years)
  getClearanceAvg(criteria,years,res)
  //getClearanceRates(res)
})

app.get("/clearanceRateMedian", (req,res)=>{
  var criteria = '$'+req.query.criteria
//  console.log(criteria)
  var years = req.query.years.map(function(year){
    return parseInt(year)
  })
  console.log(years)
  getClearanceMedian(criteria,years,res)
  //getClearanceRates(res)
})

function getClearanceMedian(criteria, years, res){
  db.collection("siecic").aggregate([
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
        "medianClearance":{
          "$avg":["$beginValue","$endValue"]
        }
      }
    },
    {
      $sort:{_id:1}
    }
  ]).toArray(function (err, data){
    if (err) {
      console.log(err)
      return
    }
    //category or "labels" array
    var categoryArray = []

    // values array
    var clearanceArray = []
    for (index in data){
         var doc = data[index]
         var category = doc['_id'].aggregazione
         if (doc['_id'].aggregazione == null) category = 'Totale'
         category = category + ' -- ' + doc['_id'].anno
         var clearance = doc['medianClearance']
         categoryArray.push(category)
         clearanceArray.push(parseFloat(clearance.toPrecision(3)))
      }
    var datasets=[
      {
        'label':'Clearance Median',
        'data':clearanceArray
      }
    ]

    var response = {
      "labels":categoryArray,
      "datasets":datasets
    }
  //  console.log(JSON.stringify(response))
    res.json(response)
  })
}

// TODO: Move function to a script folder with each function doing what it knows
function getClearanceAvg(criteria, years, res){

  db.collection("siecic").aggregate([
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
          avgClearance:{$avg:{$divide:["$definiti","$iscritti"]}}
      }
    },
    {
      $sort:{_id:1}
    }
  ]).toArray(function (err, data){
    if (err) {
      console.log(err)
      return
    }

    //category or "labels" array
    var categoryArray = []

    // values array
    var clearanceArray = []
    for (index in data){
         var doc = data[index]
         var category = doc['_id'].aggregazione
         if (doc['_id'].aggregazione == null) category = 'Totale'
         category = category + ' -- ' + doc['_id'].anno
         //category == null is to group all records in a total, single aggregation
         var clearance = doc['avgClearance']
         categoryArray.push(category)
         clearanceArray.push(parseFloat(clearance.toPrecision(3)))
      }
    var datasets=[
      {
        'label':'Clearance Average',
        'data':clearanceArray
      }
    ]

    var response = {
      "labels":categoryArray,
      "datasets":datasets
    }
  //  console.log(JSON.stringify(response))
    res.json(response)
  })
}
