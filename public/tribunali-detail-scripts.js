
var templateTribunali = $('#tribunali-fill').html()
$(function(){
  $.ajax({
  url: 'http://localhost:3000/tribunali',
  dataType: 'json',
  type: 'GET',
    success: function(data) {
      console.log(data);
      var template = Handlebars.compile(templateTribunali)
      $("#tribunali-location").html(template(data))
    },
    error: function(xhr,status){
      console.log(xhr)
      console.log(status)
    }
  });
})

function changeHeader(){
  var optionSelected = $('#indicator option:selected').val();
  console.log(optionSelected)
  var optionText     = $('#indicator option:selected').text();

// Deactivating year 2013 for metrics that need the year before
  switch (optionSelected) {
    case 'clearanceRateFull':
    case 'UTInterannuale':
    case 'DomandaGiustizia':
    case 'UTDomanda':
    {
      $('#2013').addClass('hidden').prop('checked',false).prop('label',"").prop('name',"")
      break;
    }
    default:{
      $('#2013').removeClass('hidden').prop('checked',false).prop('label',"2013").prop('name',"2013")
    }
  }
  $('#chartHeader').html(optionText)
}

function fetchAll(){
    destroyChart()
    fetchData('Average',function(success){
      if (success)
        fetchData('Median',function(success){
          if (success)
            fetchData('Mode',null)
          else return
        })
      else return
    })
}

var templateStringAvg = $('#tabular-templateAverage').html()
var templateStringMedian = $('#tabular-templateMedian').html()
var templateStringMode = $('#tabular-templateMode').html()

function fetchData(metric,callback){
  switch(metric) {
    case 'Average':
      var templateString = templateStringAvg
      break;
    case 'Median':
      var templateString = templateStringMedian
      break;
    case 'Mode':
      var templateString = templateStringMode
      break;
    default:
      var templateString = templateStringAvg
  }
  var chartData;
  var yearsArray = $('.parent input:checked').map(function () {
    return this.name;
  }).get();


  var yearsParam    = {years: yearsArray}
  var aggregate     = $("#aggregate option:selected").val()
  var tribunale     = $("#tribunali option:selected").val()
  var indicator     = $("#indicator option:selected").val()
  var indicatorText = $('#indicator option:selected').text();
  if (aggregate == 'null') aggregate = "totale"

  var title = indicatorText + " " + metric + " for year(s) " + yearsArray.toString() + " -- aggregated by " + aggregate
  var type  = 'bar' //TODO get the type of graphic from select in the page

  var host      = 'http://localhost:3000/'
  var urlAddr   = indicator + 'ByTribunale' + metric
  var params    = '?tribunale=' + tribunale + '&criteria=' + aggregate +'&'+ $.param(yearsParam)
  var urlString = host + urlAddr + params

  $(function(){
    $.ajax({
      url: urlString,
      type: 'GET',
      dataType:'json',
      success: function(data){
        chartData = data
        //console.log("hola" + JSON.stringify(data))
        //console.log($("#tabular-template").html())
        var template = Handlebars.compile(templateString)
        $("#table-location"+metric).html(template(data['data']))
        drawChart(data,title,metric,type)
        if (typeof callback === "function") callback(true)
      },
      error: function(xhr,status){
        console.log(xhr)
        console.log(status)
        if (typeof callback === "function") callback(false)
      }
    })
  })
}


function destroyChart(){
  Chart.helpers.each(Chart.instances,function(instance){
    instance.destroy()
  })
}

function drawChart(rawData, title, metric, typeChart){
  console.log(metric)
  $("clearance"+metric).remove();
  $("chart-location"+metric).append('<canvas id="clearance"'+metric+'></canvas>');
  var ctx = document.getElementById("clearance"+metric).getContext('2d')
  chart = new Chart(ctx,{
    type: typeChart,
    data: rawData['data'],
    options:rawData['options']

  })
}
