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
            suggestedMin: 0,
            // // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
            // suggestedMax: 1,
            stepSize: 20,
            // fixedStepSize:0.1,
            // min: -0.1
          }
        }]
      }
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

module.exports.getDurataPrognosticaAvg = getDurataPrognosticaAvg
