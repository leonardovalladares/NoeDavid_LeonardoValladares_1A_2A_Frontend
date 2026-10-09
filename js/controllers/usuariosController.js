//importar service 
import { usuariosService } from "../services/usuariosServices";

//conectar js con html
const tablaBody = document.getElementById('tablaBodyUsuarios');

const formulario = document.getElementById('formUsuarios')
const modalBootstrap = new bootstrap.Modal(document.getElementById('modalUsuarios'));

//evento de arranque
document.addEventListener('DOMContentLoaded', cargarTabla);

//4. GET: PINTAR TABLA
async function cargarTabla() {
    //traer datos de la base de datos a traves del service

    const datos = await usuariosService.obtenerTodos();
    tablaBody.innerHTML += `
    <tr>
        <td>${item.Nombre}</td>
        <td>${item.Correo}</td>
        <td>${item.FechaRegistro}</td>
        <td> 
          <button class="btn btn-warning btn-editar" data-id="${item.id}">Editar</button>
          <button class="btn btn-danger btn-eliminar" data-id="${item.id}">Eliminar</button>
        </td>
    </tr>
    `;
    //como acabamos de crear botones en el html, hay que activarles asignarEventosBotones();
};