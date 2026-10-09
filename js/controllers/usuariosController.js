//importar service 
import { usuariosService } from "../services/usuariosServices.js";

//conectar js con html
const tablaBody = document.getElementById('tablaBodyUsuarios');
const formulario = document.getElementById('formUsuarios');
const modalElement = document.getElementById(modalElement);
const modalBootstrap = new bootstrap.Modal(document.getElementById('modalUsuarios'));

//evento de arranque
document.addEventListener('DOMContentLoaded', cargarTabla);

//4. GET: PINTAR TABLA
async function cargarTabla() {
    //traer datos de la base de datos a traves del service
    try {
      const datos = await usuariosService.obtenerTodos();  

      tablaBody.innerHTML='';

      //recorrer el arreglo con un bucle
      datos.forEach(item => {
        tablaBody.innerHTML +=
        `<tr>
        <td>${item.nombre || item.Nombre}</td>
        <td>${item.correo || item.Correo}</td>
        <td>${item.fechaRegistro || item.FechaRegistro}</td>
        <td> 
          <button class="btn btn-warning btn-editar" data-id="${item.id}">Editar</button>
          <button class="btn btn-danger btn-eliminar" data-id="${item.id}">Eliminar</button>
        </td>
      </tr>`
    });
}catch(error){
    console.error('Error al cargar la tabla: ', error)
}
}

function asignarEventosBotones(){
    document.querySelectorAll('.btn-eliminar').forEach(
        boton=>{boton.addEventListener('click', async(e)=>{const id = e.target.getAttribute('data-id')
            if(confirm('¿Estas seguro de querer eliminar al usuario?')){
                await usuariosService.eliminarUsuario
            }
        })}
    )
}

//Access to script at 'file:///C:/xampp/htdocs/NoeDavid_LeonardoValladares_1A_2A_Frontend/js/controllers/usuariosController.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, edge, http, https, isolated-app.


// file:///C:/xampp/htdocs/NoeDavid_LeonardoValladares_1A_2A_Frontend/js/controllers/usuariosController.js net::ERR_FAILED