//index.js
const path        = require('path')
const express     = require('express')
const exphbs      = require('express-handlebars')
const bodyParser  = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const chartJs     = require('chart.js')
const app         = express()
const routes      = require('./routes');
const utils       = require('./utils/importScripts')
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

app.use('/',routes);

app.get('/',(request,response) =>{
  //Render takes the name of the view (home) and the data to render (name)
  // utils.updateInts(['pendenti'],function(status){
  //   if (status) console.log('tutto benne')
  //   else console.log('tutto male')
  // })
  response.render('index.hbs',{
    name:'Demo'
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
