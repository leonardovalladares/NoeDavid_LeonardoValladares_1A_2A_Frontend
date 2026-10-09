const API_URL = "http://localhost:8080/api/usuarios";

export const usuariosService = {

    async obtenerTodos() {
        const respuesta = await fetch(API_URL);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener los usuarios');
        }

        return resultado;
    },

    async obtenerPorId(id) {
        const respuesta = await fetch(`${API_URL}/${id}`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al obtener el usuario');
        }

        return resultado;
    },

    async crearUsuario(datos) {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al crear el usuario');
        }

        return resultado;
    },

    async actualizarUsuario(id, datos) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al actualizar el usuario');
        }

        return resultado;
    },

    async eliminarUsuario(id) {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al eliminar el usuario');
        }

        return resultado;
    }
};