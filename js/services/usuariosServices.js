//aca va la url de la api usuarios
const API_URL = ''

export const usuariosService = {

    //1. GET - OBTENER LOS REGISTROS
    async obtenerTodos(){
        const respuesta = await fetch(API_URL);

        if(!respuesta.ok){
            throw new Error('Error al obtener datos del servidor')
        }

        return await respuesta.json();
    },

    //2. POST - CREAR NUEVO REGISTRO
    async crearUsuario(datos){
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos) //CONVIERTE EL OBJETO A TEXTO JSON
        });

        if(!respuesta.ok){
            throw new Error('Error al crear un usuario')
        }
        return await respuesta.json();
    },

    //3. PUT - ACTUALIZAR REGISTRO EXISTENTE

    async actualizarUsuario(id, datos){
        const respuesta = await fetch (`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(datos)
        });
        if(!respuesta.ok){
            throw new Error('Error al actualizar el usuario');
        }
        return await respuesta.json();
    },

    //4. DELETE - Eliminar Usuarios

    async eliminarUsuario(id){
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if(!respuesta.ok){
            throw new Error('Error al eliminar el usuario');
        }
        //el delete no devuelve json
        return true;
    }
};