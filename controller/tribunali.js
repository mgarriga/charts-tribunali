function getTribunaliList(){
  var result = db.collection("siecic").aggregate([
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
  ])
  return result
}

module.exports.getTribunaliList = getTribunaliList

function getTribunaleDetail(tribunale){
  var result = db.collection("siecic").aggregate([
    {
      $match:{
          'tribunale':tribunale
      }
    },
    {
      $group:{
        _id:{
          'tribunale':'$tribunale'
        },
        'area':{$first:'$area'},
        'dimensione':{$first:'$dimensione'}
      }
    }
  ])
  return result
}

module.exports.getTribunaleDetail = getTribunaleDetail

function getAllTribunaliDetail(){
  var result = db.collection("siecic").aggregate([
    {
      $group:{
        _id:{
          'tribunale':'$tribunale'
        },
        'area':{$first:'$area'},
        'dimensione':{$first:'$dimensione'}
      }
    }
  ])
  return result
}

module.exports.getAllTribunaliDetail = getAllTribunaliDetail
