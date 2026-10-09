import { cuentasService } from "../services/cuentasService.js";
import { movimientosService } from "../services/movimientosService.js";
import { usuariosService } from "../services/usuariosServices.js";

const tablaBody = document.getElementById('tablaBodyMovimientos');
const formulario = document.getElementById('formMovimientos');
const modalBootstrap = new bootstrap.Modal(document.getElementById('modalMovimientos'));
const alerta = document.getElementById('alerta');
const selectUsuarioMovimientos = document.getElementById('selectUsuarioMovimientos');
const selectCuentaMovimientos = document.getElementById('selectCuentaMovimientos');
const textoResumen = document.getElementById('textoResumen');
const filtroTipo = document.getElementById('filtroTipo');
const btnNuevoMovimiento = document.getElementById('btnNuevoMovimiento');

const idMovimiento = document.getElementById('idMovimiento');
const selectTipoMovimiento = document.getElementById('selectTipoMovimiento');
const inputCategoriaMovimiento = document.getElementById('inputCategoriaMovimiento');
const inputDescripcionMovimiento = document.getElementById('inputDescripcionMovimiento');
const inputMontoMovimiento = document.getElementById('inputMontoMovimiento');
const inputFechaMovimiento = document.getElementById('inputFechaMovimiento');

document.addEventListener('DOMContentLoaded', cargarUsuarios);

selectUsuarioMovimientos.addEventListener('change', () => {
    cargarCuentas();
});

selectCuentaMovimientos.addEventListener('change', () => {
    cargarTabla();
});

filtroTipo.addEventListener('change', () => {
    cargarTabla();
});

btnNuevoMovimiento.addEventListener('click', () => {
    formulario.reset();
    idMovimiento.value = '';
});

function mostrarAlerta(mensaje, tipo) {
    alerta.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

async function cargarUsuarios() {
    try {
        const respuesta = await usuariosService.obtenerTodos();
        const usuarios = respuesta.data;

        selectUsuarioMovimientos.innerHTML = '';
        usuarios.forEach(item => {
            selectUsuarioMovimientos.innerHTML += `<option value="${item.idUsuario}">${item.nombre}</option>`;
        });

        if (selectUsuarioMovimientos.value) {
            cargarCuentas();
        }
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

async function cargarCuentas() {
    try {
        const idUsuario = selectUsuarioMovimientos.value;
        const respuesta = await cuentasService.obtenerPorUsuario(idUsuario);
        const cuentas = respuesta.data;

        selectCuentaMovimientos.innerHTML = '';
        cuentas.forEach(item => {
            selectCuentaMovimientos.innerHTML += `<option value="${item.idCuenta}">${item.nombre}</option>`;
        });

        if (selectCuentaMovimientos.value) {
            cargarTabla();
        } else {
            tablaBody.innerHTML = '';
            textoResumen.textContent = 'Ingresos: $0.00 | Gastos: $0.00 | Saldo Actual: $0.00';
        }
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

async function cargarTabla() {
    const idCuenta = selectCuentaMovimientos.value;
    if (!idCuenta) return;

    try {
        const resCuenta = await movimientosService.obtenerResumenCuenta(idCuenta);
        const cuenta = resCuenta.data;
        textoResumen.textContent = `Ingresos: $${cuenta.totalIngresos} | Gastos: $${cuenta.totalGastos} | Saldo Actual: $${cuenta.saldoActual}`;

        const respuesta = await movimientosService.obtenerPorCuenta(idCuenta, {
            tipo: filtroTipo.value
        });
        const datos = respuesta.data;

        tablaBody.innerHTML = '';

        datos.forEach(item => {
            tablaBody.innerHTML += `
                <tr>
                    <td>${item.fecha}</td>
                    <td>${item.tipo}</td>
                    <td>${item.categoria}</td>
                    <td>${item.descripcion || ''}</td>
                    <td>$${item.monto}</td>
                    <td>
                        <button class="btn btn-warning btn-editar" data-id="${item.idMovimiento}">Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${item.idMovimiento}">Eliminar</button>
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

    const id = idMovimiento.value;
    const datos = {
        idCuenta: Number(selectCuentaMovimientos.value),
        tipo: selectTipoMovimiento.value,
        categoria: inputCategoriaMovimiento.value,
        descripcion: inputDescripcionMovimiento.value,
        monto: Number(inputMontoMovimiento.value),
        fecha: inputFechaMovimiento.value
    };

    try {
        let respuesta;
        if (id) {
            respuesta = await movimientosService.actualizarMovimiento(id, datos);
        } else {
            respuesta = await movimientosService.crearMovimiento(datos);
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
                const respuesta = await movimientosService.obtenerPorId(id);
                const mov = respuesta.data;

                idMovimiento.value = mov.idMovimiento;
                selectTipoMovimiento.value = mov.tipo;
                inputCategoriaMovimiento.value = mov.categoria;
                inputDescripcionMovimiento.value = mov.descripcion || '';
                inputMontoMovimiento.value = mov.monto;
                inputFechaMovimiento.value = mov.fecha;

                modalBootstrap.show();
            } catch (error) {
                mostrarAlerta(error.message, 'danger');
            }
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estas seguro de querer eliminar el movimiento?')) {
                try {
                    const respuesta = await movimientosService.eliminarMovimiento(id);
                    mostrarAlerta(respuesta.message, 'success');
                    cargarTabla();
                } catch (error) {
                    mostrarAlerta(error.message, 'danger');
                }
            }
        });
    });
}
