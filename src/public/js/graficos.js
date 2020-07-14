

function cargarGrafica() {
    
    let parametroPrincipal = document.getElementById('parametros').value;
    let año = document.getElementById('año').value;
    let mes = document.getElementById('mes').value;
    let provFall = document.getElementById('provFall').value;
    let cantFall = document.getElementById('cantFall').value;
   
    $.ajax({
        url: '/defun/datos/graficas',
        data: {
            parametro:parametroPrincipal,
            año_fall:año,
            mes_fall:mes,
            provFall,
            cantFall
          
        },
        type: 'POST',

        success: function(response) {
          
                datosXaño=[];
                datosYaño=[];
                for (let i = 0; i < response.año.length; i++) {
                    datosXaño[i]=response.año[i]._id;
                    datosYaño[i]=response.año[i].total;
                }
                graficaBarras(datosXaño,datosYaño,"container","Por Año");
                datosXaño=[];
                datosYaño=[];
                for (let i = 0; i < response.provincia.length; i++) {
                    datosXaño[i]=response.provincia[i]._id;
                    datosYaño[i]=response.provincia[i].total;
                }
                
                graficaBarras(datosXaño,datosYaño,"container2","Por Provincia");
                var arreglo=response.mes; 
                // para cada elemento, se crea un nuevo objeto con las nuevas propiedades.
                var arreglo = arreglo.map( item => { 
                    return { name: item._id , y : item.total }; 
                });
                GraficaPie(arreglo,"container3","Por mes");
                var arreglo=response.canton; 
                // para cada elemento, se crea un nuevo objeto con las nuevas propiedades.
                var arreglo = arreglo.map( item => { 
                    return { name: item._id , y : item.total }; 
                });
                GraficaPie(arreglo,"container4","Por canton");
          
        }
    });  
};


function graficaBarras(datosX,datosY,container,title){
    Highcharts.chart(container, {
        chart: {
            type: 'bar'
        },
        title: {
            text: title
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

function GraficaPie(json,container,title){
    Highcharts.chart(container, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: json
        }]
    });
}