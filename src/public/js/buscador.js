const formulario =document.querySelector("#for-busqueda");
const boton =document.querySelector("#boton");
const busqueda = document.querySelector("#busqueda");
const filtro = busqueda.getElementsByClassName("col-md-3");
//console.log(filtro.length);
const h4 = busqueda.getElementsByTagName("h4");

//busqueda.getElementsByClassName("card-title d-flex justify-content-between align-items-center")[0].innerHTML = "Milk";



const  filtrar=()=>{
  
  const texto=formulario.value.toLowerCase();
  for (i=0;i<h4.length ;i++){
      nombre=h4[i].textContent.toLowerCase();
      if (nombre.indexOf(texto)!== -1) {
        filtro[i].style.display="block";
        console.log("no vale" )
      }else{

        filtro[i].style.display="none"

      }
  }if (formulario.innerHTML=="") {
    busqueda.style.display="block";

  }
  
}
boton.addEventListener("click",filtrar);
formulario.addEventListener('keyup',filtrar);