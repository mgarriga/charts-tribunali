var express        = require('express');
var router         = express.Router();

var clearanceRates    = require('./clearanceRates')
var tribunali         = require('./tribunali')
var ultraTriennale    = require('./ultraTriennale')
var durataPrognostica = require('./durataPrognostica')
var produttivita      = require('./produttivita')


router.use('/',clearanceRates)
router.use('/',tribunali)
router.use('/',ultraTriennale)
router.use('/',durataPrognostica)
router.use('/',produttivita)

module.exports = router
