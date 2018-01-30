var express = require('express');
var router = express.Router();


router.get('/tribunali-detail',(request,response) =>{
  //var cursor = db.collection('quotes').find().toArray(function(err, results){
  //  console.log(results)
    //getData(response)
    response.render('tribunali-detail')
  //})
  //Render takes the name of the view (home) and the data to render (name)
  //response.render('home',{
  //  name:'Martin'
  //})
})

router.get('/tribunali', (req,res) =>{
  db.collection("siecic").aggregate([
    {
      $group:{
        _id:'$tribunale'
      }
    },
    {
      $sort:{
        _id:1
      }
    }
  ]).toArray(function(err,data){
    if (err) {
      console.log(err)
      return
    }
    var tribunaliArray = []
    for (index in data){
      tribunaliArray.push(data[index]._id)
    }
    var result = {
      'tribunali': tribunaliArray
    }
    res.json(result)
  })
})

module.exports = router;
