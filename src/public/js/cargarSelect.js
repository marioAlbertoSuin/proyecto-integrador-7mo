function cambia(){
borrar("cantFall");
var provincia = document.getElementById("provFall");
var selectedProvincia = provincia.options[provincia.selectedIndex].text
$.ajax({
    url: '/defunciones/registro/llenar-canton',
    data: {datoCanton:selectedProvincia},
    type: 'POST',

    success: function(response) {
     var parroquias=response;
     var cantones =document.getElementById("cantFall");
     cantones.options[0]=new Option("--","--");   
    for (let i = 0;i < parroquias.length;i++) {
        cantones.options[i+1]=new Option(parroquias[i]._id,parroquias[i]._id)
        
    }


    }
});  

}


function cambia2(){
    borrar("parrFall");
    var cantones =document.getElementById("cantFall");
    
    var selectedCantones = cantones.options[cantones.selectedIndex].text
    $.ajax({
        url:"/defunciones/registro/llenar-parroquia",
        data:{datoParroquia:selectedCantones},
        type:'POST',
        success:function(response){
            
            var cantones=response;
            var canton =document.getElementById("parrFall");
            
           for (let i = 0;i < cantones.length;i++) {
               canton.options[i]=new Option(cantones[i]._id,cantones[i]._id)
               
           }

        }
    });
}
////////////////////////////////////////////////


function cambio(){
    borrar("cantRes");
    var provincia = document.getElementById("provRes");
    var selectedProvincia = provincia.options[provincia.selectedIndex].text
    $.ajax({
        url: '/defunciones/registro/llenar-canton',
        data: {datoCanton:selectedProvincia},
        type: 'POST',
    
        success: function(response) {
         var parroquias=response;
         var cantones =document.getElementById("cantRes");
         cantones.options[0]=new Option("--","--");
         for (let i = 0;i < parroquias.length;i++) {
            cantones.options[i+1]=new Option(parroquias[i]._id,parroquias[i]._id)
            
        }
    
    
        }
    });  
    
    }
    
    
    function cambio2(){
        borrar("parrRes");
        var cantones =document.getElementById("cantRes");
        
        var selectedCantones = cantones.options[cantones.selectedIndex].text
        $.ajax({
            url:"/defunciones/registro/llenar-parroquia",
            data:{datoParroquia:selectedCantones},
            type:'POST',
            success:function(response){
                
                var cantones=response;
                var canton =document.getElementById("parrRes");
               
               for (let i = 0;i < cantones.length;i++) {
                   canton.options[i]=new Option(cantones[i]._id,cantones[i]._id)
                   
               }
    
            }
        });
    }

function borrar(id){
 
    var com = document.getElementById(id);
   // com.remove(com.); 
  
   for (let i = com.options.length; i >= 0; i--) {
      com.remove(i);
    }
  
  }

