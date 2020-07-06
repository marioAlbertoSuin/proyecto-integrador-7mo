

function cargarGrafica() {
    let activoFijo = $('input[name="graficaActual"]:checked').val();
    
    $.ajax({
        url: '/defun/datos/graficas',
        data: {datoGrafica:activoFijo},
        type: 'POST',

        success: function(response) {
            if (response == "falso") {
                alert("escoja una opcion porfavor")
            }else{
                datosX=[];
                datosY=[];
                for (let i = 0; i < response.length; i++) {
                    datosX[i]=response[i]._id;
                    datosY[i]=response[i].total;
                }

                Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Grafica para defunciones fetales'
    },

    xAxis: {
        categories:datosX,
        title: {
            text: datosX
        }
    },

    tooltip: {
        valueSuffix: ' defunciones'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#808080',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{data:datosY }]
});
            }
        }
    });  
};
