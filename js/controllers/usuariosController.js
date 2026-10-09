import { usuariosService } from "../services/usuariosServices.js";

const tablaBody = document.getElementById('tablaBodyUsuarios');
const formulario = document.getElementById('formUsuarios');
const modalBootstrap = new bootstrap.Modal(document.getElementById('modalUsuarios'));
const alerta = document.getElementById('alerta');
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const idUsuarios = document.getElementById('idUsuarios');
const inputUsuarios = document.getElementById('inputUsuarios');
const inputCorreoUsuarios = document.getElementById('inputCorreoUsuarios');
const inputFechaRegistroUsuarios = document.getElementById('inputFechaRegistroUsuarios');

document.addEventListener('DOMContentLoaded', cargarTabla);

btnNuevoUsuario.addEventListener('click', () => {
    formulario.reset();
    idUsuarios.value = '';
});

function mostrarAlerta(mensaje, tipo) {
    alerta.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

async function cargarTabla() {
    try {
        const respuesta = await usuariosService.obtenerTodos();
        const datos = respuesta.data;

        tablaBody.innerHTML = '';

        datos.forEach(item => {
            tablaBody.innerHTML += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.correo}</td>
                    <td>${item.fechaRegistro}</td>
                    <td>
                        <button class="btn btn-warning btn-editar" data-id="${item.idUsuario}">Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${item.idUsuario}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        asignarEventosBotones();
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = idUsuarios.value;
    const datos = {
        nombre: inputUsuarios.value,
        correo: inputCorreoUsuarios.value,
        fechaRegistro: inputFechaRegistroUsuarios.value
    };

    try {
        let respuesta;
        if (id) {
            respuesta = await usuariosService.actualizarUsuario(id, datos);
        } else {
            respuesta = await usuariosService.crearUsuario(datos);
        }

        modalBootstrap.hide();
        formulario.reset();
        mostrarAlerta(respuesta.message, 'success');
        cargarTabla();
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
});

function asignarEventosBotones() {
    document.querySelectorAll('.btn-editar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            try {
                const respuesta = await usuariosService.obtenerPorId(id);
                const usuario = respuesta.data;

                idUsuarios.value = usuario.idUsuario;
                inputUsuarios.value = usuario.nombre;
                inputCorreoUsuarios.value = usuario.correo;
                inputFechaRegistroUsuarios.value = usuario.fechaRegistro;

                modalBootstrap.show();
            } catch (error) {
                mostrarAlerta(error.message, 'danger');
            }
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estas seguro de querer eliminar al usuario?')) {
                try {
                    const respuesta = await usuariosService.eliminarUsuario(id);
                    mostrarAlerta(respuesta.message, 'success');
                    cargarTabla();
                } catch (error) {
                    mostrarAlerta(error.message, 'danger');
                }
            }
        });
    });
}