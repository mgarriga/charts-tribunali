//const Chart = require('charts.js')

var templateString = $('#tabular-template').html()

function fetchData(metric){
  console.log(metric)
  console.log('Hello From fetchData()')
  var chartData;
  var yearsArray = $('.parent input:checked').map(function () {
    return this.name;
  }).get();
  var yearsParam = {years: yearsArray}
  var aggregate = document.getElementById("aggregate").value
  if (aggregate == 'null') aggregate = "totale"
  var title = "Simple Clearance Rate for year(s) " + yearsArray.toString() + " -- aggregated by " + aggregate
  var urlString = 'http://charts-tribunali.westeurope.cloudapp.azure.com:3000/clearanceRate'+ metric + '?criteria=' + aggregate +'&'+ $.param(yearsParam)
  console.log(urlString)
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
        $("#table-location").html(template(data))
        drawChart(data,title)
      },
      error: function(xhr,status){
        console.log(xhr)
        console.log(status)
      }
    })
  })
}


function destroyChart(){
  Chart.helpers.each(Chart.instances,function(instance){
    instance.destroy()
  })
}

function drawChart(rawData, title){
  var ctx = document.getElementById("ClearanceChart").getContext('2d')
  destroyChart()
  var fuelChart = new Chart(ctx,{
    type: 'bar',
    data: rawData,
    options:{
      title:{
        display:true,
        text: title
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
  original.call(this, e, legendlocalhostItem);
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
