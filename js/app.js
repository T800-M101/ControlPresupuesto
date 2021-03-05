//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos


eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto)
}



//Clases

////// CLASE PARA CALCULAR PRESUPUESTO
class Presupuesto {

     constructor(presupuesto){
         this.presupuesto = Number(presupuesto);
         this.restante = Number(presupuesto);
         this.gastos = [];
     }

     nuevoGasto(nuevoGasto){
         this.gastos = [...this.gastos, nuevoGasto]; // Siempre hacer una copia del arreglo
         this.calcularRestante();   
     }

  

     calcularRestante(){
         const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
         this.restante = this.presupuesto - gastado;
        // this.restante-= nuevoGasto.cantidad // Evito iterar sobre todo el arreglo con reduce
     }


     eliminarGasto(id){
         this.gastos = this.gastos.filter( gasto => gasto.id !== id);
         this.calcularRestante();
     }
}


////// CLASE PARA RENDERIZAR LA UI
class UI {

    //Insertando en el HTML el presupuesto y el restante
     insertarPresupuesto(cantidad){

        //Destructurar el objeto cantidad para extraer las variables presupuesto y restante
          const { presupuesto, restante} = cantidad;

        //Insertar los valores en el HTML
          document.querySelector('#total').textContent = presupuesto;
          document.querySelector('#restante').textContent = restante;
     }

   //Alerta que los campos del formulario estan pasando valores incorrectos
     imprimirAlerta(mensaje,tipo){
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success');
        }

        //Agregar mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //Quitar alerta de error

        setTimeout(()=>{
          divMensaje.remove();
        },3000);
     }


     mostrarGastos(gastos){
          
         this.limpiarHTML(); // Elimina HTML previo
       
        //Iterar sobre los gastos
        gastos.forEach( nuevoGasto => {

          
            const { cantidad, gasto, id } = nuevoGasto;
            //Crear li
            const gastoNuevo  = document.createElement('li');
            gastoNuevo.className = 'list-group-item d-flex justify-content-between align-items-center';
            // gastoNuevo.setAttribute('data-id',id); //forma mas antigua de agregar un id al li
            gastoNuevo.dataset.id = id; // forma mas nueva, se recomienda mas.
            
            
           



            //Crear el HTML del gasto
            gastoNuevo.innerHTML = `${gasto} <span class="badge badge-primary badge-pill">$${cantidad}</span>`;



            //Agregar un boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
 
            btnBorrar.textContent = 'Borrar';
            // btnBorrar.innerHTML = 'Borrar &times'; //Se usa esta forma si se quiere agregar la entidad HTML &times
            btnBorrar.onclick = () => {
               //Funcion de eliminar gasto
                  eliminarGasto(id);
              
            }
            
            gastoNuevo.appendChild(btnBorrar);
       

            //Agregar el gasto al HTML
            gastoListado.appendChild(gastoNuevo); 
            
        });
       

     }     
         // Funcion para limpiar HTML
            limpiarHTML(){
             while(gastoListado.firstChild){
               gastoListado.removeChild(gastoListado.firstChild);
            }
     }

        // Funcion para actualizar el presupuesto restante
        actualizarRestante(restante) {

        document.querySelector('#restante').textContent = restante;
     }


                comprobrarPresupuesto(presupuestoObj){

            const { presupuesto, restante} = presupuestoObj;
            const restanteDiv = document.querySelector('.restante'); 
          
            if (restante > (presupuesto * .50)){
                restanteDiv.classList.remove('alert-warning', 'alert-danger');
                restanteDiv.classList.add('alert-success');
            }

            if((restante <= presupuesto * .50)){

                restanteDiv.classList.remove('alert-success', 'alert-danger');
                restanteDiv.classList.add('alert-warning');
            
            }
            
            if (restante <= (presupuesto * .25)){
                restanteDiv.classList.remove('alert-success', 'alert-warning');
                restanteDiv.classList.add('alert-danger');
            
            }


         

            //Si el restante es 0 o menor
            
            if(restante <= 0){
                ui.imprimirAlerta('El presupuesto se ha agotado','error');
                formulario.querySelector('button[type="submit"]').disabled = true;
            }else {
                formulario.querySelector('button[type="submit"]').disabled = false;
            }
      
    }       
}


    


///////Instanciar User Interface//////
 const ui = new UI();

let presupuesto;







////// FUNCIONES GLOBALES////////




function preguntarPresupuesto() {
    const presupuestoUsuario = prompt(('Ingresa un presupuesto correcto:'));

    //Validando input del usuario
    if (presupuestoUsuario === '' || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 || presupuestoUsuario === null) {
        window.location.reload();
    }
    
    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
    
} 


//Anadir gastos. Como es un submit de un formulario se le pasa un evento a la funcion
function agregarGasto(e){
    e.preventDefault();

    //Leer los inputs
    const gasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    
    //Validar que los dos campos no esten vacios
    if(gasto === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
        
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }else if (!isNaN(gasto)){
        ui.imprimirAlerta('Nombre del gasto no valido', 'error');
        return;
        
    }

    //Crear un objet literal de tipo gasto
    const nuevoGasto = {gasto,cantidad, id:Date.now()};

    //Anade nuevo gasto al objeto presupuesto
    presupuesto.nuevoGasto(nuevoGasto);

    //Mensaje de gasto correcto
    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const { gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobrarPresupuesto(presupuesto);

    //Limpiar o reiniciar formulario
    formulario.reset();
    
}


function eliminarGasto(id){
    //Elimina los objetos del arreglo
    presupuesto.eliminarGasto(id)

    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobrarPresupuesto(presupuesto);
 
 }