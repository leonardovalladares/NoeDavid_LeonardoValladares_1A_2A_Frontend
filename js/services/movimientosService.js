const API_URL = "http://localhost:8080/api/movimientos";

export const movimientosService = {

    async obtenerPorCuenta(idCuenta, filtros = {}) {
        const params = new URLSearchParams();

        if (filtros.tipo) {
            params.append('tipo', filtros.tipo);
        }
        if (filtros.categoria) {
            params.append('categoria', filtros.categoria);
        }
        if (filtros.fechaInicio) {
            params.append('fechaInicio', filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
            params.append('fechaFin', filtros.fechaFin);
        }

        const queryString = params.toString();
        const url = queryString
            ? `${API_URL}/cuenta/${idCuenta}?${queryString}`
            : `${API_URL}/cuenta/${idCuenta}`;

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener los movimientos');
        }

        return resultado;
    },

    async obtenerResumenCuenta(idCuenta) {
        const respuesta = await fetch(`${API_URL}/cuenta/${idCuenta}/resumen`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener el resumen de la cuenta');
        }

        return resultado;
    },

    async obtenerPorId(id) {
        const respuesta = await fetch(`${API_URL}/${id}`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener el movimiento');
        }

        return resultado;
    },

    async crearMovimiento(datos) {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al registrar el movimiento');
        }

        return resultado;
    },

    async actualizarMovimiento(id, datos) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al actualizar el movimiento');
        }

        return resultado;
    },

    async eliminarMovimiento(id) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al eliminar el movimiento');
        }

        return resultado;
    }
};
