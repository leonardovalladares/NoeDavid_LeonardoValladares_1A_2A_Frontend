import { cuentasService } from "../services/cuentasService.js";
import { usuariosService } from "../services/usuariosServices.js";

const tablaBody = document.getElementById('tablaBodyCuentas');
const formulario = document.getElementById('formCuentas');
const modalBootstrap = new bootstrap.Modal(document.getElementById('modalCuentas'));
const alerta = document.getElementById('alerta');
const selectUsuarioCuentas = document.getElementById('selectUsuarioCuentas');
const btnNuevaCuenta = document.getElementById('btnNuevaCuenta');
const idCuenta = document.getElementById('idCuenta');
const inputNombreCuenta = document.getElementById('inputNombreCuenta');
const selectTipoCuenta = document.getElementById('selectTipoCuenta');
const inputSaldoInicialCuenta = document.getElementById('inputSaldoInicialCuenta');
const selectActivaCuenta = document.getElementById('selectActivaCuenta');

document.addEventListener('DOMContentLoaded', cargarUsuarios);

selectUsuarioCuentas.addEventListener('change', () => {
    cargarTabla();
});

btnNuevaCuenta.addEventListener('click', () => {
    formulario.reset();
    idCuenta.value = '';
});

function mostrarAlerta(mensaje, tipo) {
    alerta.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

async function cargarUsuarios() {
    try {
        const respuesta = await usuariosService.obtenerTodos();
        const usuarios = respuesta.data;

        selectUsuarioCuentas.innerHTML = '';
        usuarios.forEach(item => {
            selectUsuarioCuentas.innerHTML += `<option value="${item.idUsuario}">${item.nombre}</option>`;
        });

        if (selectUsuarioCuentas.value) {
            cargarTabla();
        }
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

async function cargarTabla() {
    try {
        const idUsuario = selectUsuarioCuentas.value;
        const respuesta = await cuentasService.obtenerPorUsuario(idUsuario);
        const datos = respuesta.data;

        tablaBody.innerHTML = '';

        datos.forEach(item => {
            tablaBody.innerHTML += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.tipo}</td>
                    <td>$${item.saldoInicial}</td>
                    <td>$${item.saldoActual}</td>
                    <td>${item.activa}</td>
                    <td>
                        <button class="btn btn-warning btn-editar" data-id="${item.idCuenta}">Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${item.idCuenta}">Eliminar</button>
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

    const id = idCuenta.value;
    const datos = {
        idUsuario: Number(selectUsuarioCuentas.value),
        nombre: inputNombreCuenta.value,
        tipo: selectTipoCuenta.value,
        saldoInicial: Number(inputSaldoInicialCuenta.value),
        activa: selectActivaCuenta.value
    };

    try {
        let respuesta;
        if (id) {
            respuesta = await cuentasService.actualizarCuenta(id, datos);
        } else {
            respuesta = await cuentasService.crearCuenta(datos);
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
                const respuesta = await cuentasService.obtenerPorId(id);
                const cuenta = respuesta.data;

                idCuenta.value = cuenta.idCuenta;
                inputNombreCuenta.value = cuenta.nombre;
                selectTipoCuenta.value = cuenta.tipo;
                inputSaldoInicialCuenta.value = cuenta.saldoInicial;
                selectActivaCuenta.value = cuenta.activa;

                modalBootstrap.show();
            } catch (error) {
                mostrarAlerta(error.message, 'danger');
            }
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estas seguro de querer eliminar la cuenta?')) {
                try {
                    const respuesta = await cuentasService.eliminarCuenta(id);
                    mostrarAlerta(respuesta.message, 'success');
                    cargarTabla();
                } catch (error) {
                    mostrarAlerta(error.message, 'danger');
                }
            }
        });
    });
}
