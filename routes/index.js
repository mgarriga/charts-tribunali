var express = require('express');
var router = express.Router();
var clearanceRates = require('./clearanceRates')
var tribunali = require('./tribunali')

router.use('/',clearanceRates)
router.use('/',tribunali)

module.exports = router
