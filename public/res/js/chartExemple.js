google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawMultSeries);

function drawMultSeries() {
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Heure');
      data.addColumn('number', 'Moyenne de post');

      data.addRows([
        [{v: [8, 0, 0], f: '8 H'}, 0.5],
        [{v: [9, 0, 0], f: '9 H'}, 0.5],
        [{v: [10, 0, 0], f:'10 H'}, 0.6],
        [{v: [11, 0, 0], f: '11 H'}, 1.3],
        [{v: [12, 0, 0], f: '12 H'}, 2.1],
        [{v: [13, 0, 0], f: '13 H'}, 2.9],
        [{v: [14, 0, 0], f: '14 H'}, 3.7],
        [{v: [15, 0, 0], f: '15 H'}, 4.9],
        [{v: [16, 0, 0], f: '16 H'}, 6.2],
        [{v: [17, 0, 0], f: '17 H'}, 7.3],
        [{v: [18, 0, 0], f: '18 H'}, 8],
        [{v: [19, 0, 0], f: '19 H'}, 8.6],
        [{v: [20, 0, 0], f: '20 H'}, 8.9],
        [{v: [21, 0, 0], f: '21 H'}, 9.1],
        [{v: [22, 0, 0], f: '22 H'}, 8.6],
        [{v: [23, 0, 0], f: '23 H'}, 7.5],
        [{v: [0, 0, 0], f: '0 H'}, 6.1],
        [{v: [1, 0, 0], f: '1 H'}, 5.3],
        [{v: [2, 0, 0], f: '2 H'}, 4.4],
        [{v: [3, 0, 0], f: '3 H'}, 3.4],
        [{v: [4, 0, 0], f: '4 H'}, 2.1],
        [{v: [5, 0, 0], f: '5 H'}, 1.2],
        [{v: [6, 0, 0], f: '6 H'}, 0.8],
        [{v: [7, 0, 0], f: '7 H'}, 0.6],
      ]);

      var options = {
        title: "Répartition des post en fonction de l'heure",
        hAxis: {
          title: 'Heures',
          format: "HH:mm 'H'",
          viewWindow: {
            min: [-1, 30, 0],
            max: [23, 30, 0]
          }
        },
        vAxis: {
          title: ''
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));

      chart.draw(data, options);
    }