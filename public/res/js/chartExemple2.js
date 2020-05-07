google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Pays', 'Répartition des posts'],
          ['Europe',     26],
          ['Amérique du nord',    29],
          ['Asie',      16],
          ['Amérique du sud', 15],
          ['Afrique',  14],   
          ['Océanie',    10],
          ['Antartique',    1]
        ]);

        var options = {
          title: 'Répartition des posts en fonction des continents'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }
