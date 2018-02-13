
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
  var optionSelected = $('#indicator option:selected').text();
  $('#chartHeader').html(optionSelected)

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
        $("#table-location"+metric).html(template(data))
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
    data: rawData,
    options:{
      title:{
        display:true,
        text: title,

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
            stepSize: 0.1,
            // fixedStepSize:0.1,
            min: -0.1
          }
        }]
      }
    }
  })
}

/*
// Example -- Dynamic change of chart legends (metadata)
var ctx = document.getElementById("myChart").getContext('2d');
var original = Chart.defaults.global.legend.onClick;
Chart.defaults.global.legend.onClick = function(e, legendItem) {
  // Insert your custom functionality here
  update_caption(legendItem)
  original.call(this, e, legendItem);
};
*/



// Example -- Dynamic change of chart legends (metadata)
//var labels = {
//  "apples": true,
//  "oranges": true
//};

//var caption = document.getElementById("caption");

/*
var update_caption = function(legend) {
  labels[legend.text] = legend.hidden;
console.log(caption)
  var selected = Object.keys(labels).filter(function(key) {
    return labels[key];
  });

  var text = selected.length ? selected.join(" & ") : "nothing";

  caption.innerHTML = "The above chart displays " + text;
};
*/

/*
// Sample chart
var myChart = new Chart(ctx, {
type: 'bar',
data: {
labels: ["M", "T", "W", "R", "F", "S", "S"],
datasets: [{
label: 'apples',
data: [12, 19, 3, 17, 28, 24, 7]
}, {
label: 'oranges',
data: [30, 29, 5, 5, 20, 3, 10]
}]
}
});
*/

/*
var ctx = document.getElementById("myChart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
*/
