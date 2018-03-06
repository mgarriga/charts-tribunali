function joinResults(resultArray, callback){
  datasets    = []
  labels      = []
  tabDatasets = []

  for  (index in resultArray){
      datasets = datasets.concat(resultArray[index]['data']['datasets'])
      labels   = resultArray[0]['data']['labels']
      options  = resultArray[0]['options']
      tabDatasets = tabDatasets.concat(resultArray[index]['tabularData']['datasets'])

  }
  var result = {
    data:{
      'labels':labels,
      'datasets':datasets
    },
    'options':options,
    'tabularData':{
      'labels':labels,
      'datasets':tabDatasets
    }
  }
  callback(result)
}

module.exports.joinResults = joinResults

function formatTable(data,title){
  //category or "labels" array
  var categoryArray = []

  // values array
  var utArray = []
  var rawNums = []
  var tabData = []
  var labels  = []
  // //TODO se ve bastaaante feo el randomcolor
  // var color = [];
  // var dynamicColors = function() {
  //   var r = Math.floor(Math.random() * 255);
  //   var g = Math.floor(Math.random() * 255);
  //   var b = Math.floor(Math.random() * 255);
  //   return "rgb(" + r + "," + g + "," + b + ")";
  // };

  data.sort( function(a,b){return a['_id']['anno'] - b['_id']['anno']})
  for (index in data){
       var doc = data[index]
       var category = doc['_id'].aggregazione
       if (doc['_id'].aggregazione == null) category = 'Totale'
       category = category + ' -- ' + doc['_id'].anno

       categoryArray.push(category)

       for (index2 in doc['rawNumbers']){
         var metric = doc['rawNumbers'][index2]

         if (labels.includes(metric['label'])){
           for (index3 in tabData){
             if (tabData[index3]['label'] == metric['label']){
               tabData[index3]['data'].push(metric['data'])
             }
           }
         }
         else {
           tabData.push({
             'label':metric['label'],
             'data':[metric['data']]
           })
           labels.push(metric['label'])
         }
       }
  }

  var datasets = []
  var response = {
    data:{
      "labels":categoryArray,
      "datasets":datasets
    },
    tabularData:{
      'labels':categoryArray,
      'datasets':datasets.concat(tabData)
    }
  }
  return response
}

module.exports.formatTable = formatTable
