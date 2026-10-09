const API_URL = "http://localhost:8080/api/cuentas";

export const cuentasService = {

    async obtenerPorUsuario(idUsuario) {
        const respuesta = await fetch(`${API_URL}/usuario/${idUsuario}`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener las cuentas del usuario');
        }

        return resultado;
    },

    async obtenerPorId(id) {
        const respuesta = await fetch(`${API_URL}/${id}`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener el detalle de la cuenta');
        }

        return resultado;
    },

    async crearCuenta(datos) {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al registrar la cuenta');
        }

        return resultado;
    },

    async actualizarCuenta(id, datos) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al actualizar la cuenta');
        }

        return resultado;
    },

    async desactivarCuenta(id) {
        const respuesta = await fetch(`${API_URL}/${id}/desactivar`, {
            method: 'PUT'
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al desactivar la cuenta');
        }

        return resultado;
    },

    async eliminarCuenta(id) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al eliminar la cuenta');
        }

        return resultado;
    }
};
