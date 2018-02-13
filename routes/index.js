var express        = require('express');
var router         = express.Router();

var clearanceRates = require('./clearanceRates')
var tribunali      = require('./tribunali')
var ultraTriennale = require('./ultraTriennale')


router.use('/',clearanceRates)
router.use('/',tribunali)
router.use('/',ultraTriennale)


module.exports = router
