function joinResults(resultArray, callback){
  datasets = []
  labels = []
  for  (index in resultArray){
      datasets = datasets.concat(resultArray[index]['data']['datasets'])
      labels   = resultArray[index]['data']['labels']
      options  = resultArray[index]['options']
  }
  var result = {
    data:{
      'labels':labels,
      'datasets':datasets
    },
    'options':options
  }
  callback(result)
}
module.exports.joinResults = joinResults
