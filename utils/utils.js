function joinResults(resultArray, callback){
  datasets = []
  labels = []
  for  (index in resultArray){
      datasets = datasets.concat(resultArray[index]['datasets'])
      labels   = resultArray[index]['labels']
  }
  var result = {
    'labels':labels,
    'datasets':datasets
  }
  callback(result)
}
module.exports.joinResults = joinResults
