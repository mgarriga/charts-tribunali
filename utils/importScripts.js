const MongoClient = require('mongodb').MongoClient
const double = require('mongodb').Double

// function updateInts(fields, callback){
//
//   fields.forEach((field)=>{
//     console.log('searching field ' + field)
//     db.collection('siecic').find()
//     //db.collection('siecic').find( { field : { $type : 16 } } )
//
//       .forEach( function (item) {
//
//
//
//
//       });
//   })
//
// }
//


function updateInts(fields, callback){

  var bulk = db.collection('siecic').initializeUnorderedBulkOp(),
      count = 0;
  fields.forEach((field)=>{
    var query = {
      "$or": [
        { [field]: { "$type": 16 } },
        { [field]: { "$type": 18 } }
      ]
    }
    console.log(query)
    console.log(field)
    db.collection('siecic').find(
      query
    ).forEach(function(doc) {

       console.log(doc['tribunale'])
      // console.log(typeof(doc[field]))
      // firstUpdate = {
      //   "$set": { "b": doc[field].valueOf() },
      //   "$unset": { [field]: 1 }
      // }
      // console.log(firstUpdate)
      bulk.find({ "_id": doc._id })
      .updateOne({
        "$set": { "b": parseFloat(doc[field].valueOf()) },
        "$unset": { [field]: 1 }
      });
      // secondUpdate = { "$rename": { "b": [field] } }
      // console.log(secondUpdate)
      bulk.find({ "_id": doc._id })
      .updateOne({ "$rename": { "b": 'pendenti' } });
      count++;
      if ( count % 280 == 0 ) {
        bulk.execute()
        bulk = db.collection('siecic').initializeUnorderedBulkOp();
        // console.log('hola')
      }
    })
    if ( count % 280 != 0 ) bulk.execute();

  })
  callback(true)
}
module.exports.updateInts = updateInts
