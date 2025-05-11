// index.js

// Variables globales
const API_URL = 'http://localhost:3000/api'; // Cambiar según tu backend
let personas = []; // Lista de personas obtenidas del backend

// Elementos del DOM
const tablaPersonasBody = document.getElementById('tablaPersonasBody'); // Cuerpo de la tabla donde se muestran las personas
const formPersona = document.getElementById('personaForm'); // Formulario principal
const btnCancelar = document.getElementById('btnCancelar'); // Botón cancelar
const previewImagen = document.getElementById('previewImagen'); // Imagen de vista previa
const inputImagen = document.getElementById('imagen'); // Campo de imagen

// Eventos
document.addEventListener('DOMContentLoaded', cargarPersonas); // Cuando se carga la página, se cargan las personas
formPersona.addEventListener('submit', manejarSubmit); // Al enviar el formulario
btnCancelar.addEventListener('click', limpiarFormulario); // Al cancelar, se limpia el formulario
inputImagen.addEventListener('change', manejarImagen); // Al cambiar la imagen, se llama manejarImagen para previsualizar

// Funciones para cargar personas
async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`); // Se hace petición GET al endpoint personas
        const data = await response.json(); // Se convierte la respuesta en JSON
        personas = data; // Se asigna la lista de personas
        tablaPersonasBody.innerHTML = ''; // Limpiamos el contenido previo de la tabla
        personas.forEach(mostrarPersona); // Mostramos cada persona en la tabla
    } catch (error) {
        console.error('Error al cargar personas:', error);
    }
}

// Función que muestra una persona en fila en la tabla
function mostrarPersona(persona) {
    const tr = document.createElement('tr'); // Crear una fila HTML
    tr.innerHTML = `
        <td>${persona.id_persona}</td>
        <td>${persona.nombre}</td>
        <td>${persona.apellido}</td>
        <td>${persona.email}</td>
        <td>
            <img src="${API_URL}/imagenes/mostrar/${persona.id_persona}/${persona.imagen}" 
                 alt="Imagen" width="50" height="50">
        </td>
        <td>
            <button onclick="editarPersona(${persona.id_persona})">Editar</button>
            <button onclick="eliminarPersona(${persona.id_persona})">Eliminar</button>
        </td>
    `;
    tablaPersonasBody.appendChild(tr); // Se añade la fila a la tabla
}

// Manejar envío del formulario
async function manejarSubmit(e) {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores del formulario y crear un objeto persona
    const formData = new FormData(formPersona);
    const id_persona = document.getElementById('id_persona').value || null;
    const persona = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        tipo_identificacion: document.getElementById('tipo_identificacion').value,
        nuip: document.getElementById('nuip').value,
        email: document.getElementById('email').value,
        clave: document.getElementById('clave').value,
        salario: parseFloat(document.getElementById('salario').value),
        activo: document.getElementById('activo').checked
    };

    if (id_persona) {
        // Si hay un ID, se está editando, no actualices primero la imagen
        await actualizarPersona(id_persona, persona);
        if (inputImagen.files.length > 0) {
            await subirImagen(id_persona);
        }
    } else {
        // Si no hay ID, se está creando una nueva persona
        const respuesta = await crearPersona(persona);
        if (inputImagen.files.length > 0) {
            await subirImagen(respuesta.id_persona);
        }
    }

    limpiarFormulario(); // Limpiar formulario
    cargarPersonas(); // Volver a cargar la lista de personas
}

// Crear persona
async function crearPersona(persona) {
    console.log('Enviando persona al backend (POST):', persona);
    const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });

    return await response.json();
}

// Actualizar persona
async function actualizarPersona(id_persona, persona) {
    const response = await fetch(`${API_URL}/personas/${id_persona}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    return await response.json();
}

// Eliminar persona
async function eliminarPersona(id) {
    try {
        // Primero se intenta eliminar la imagen si existe
        await fetch(`${API_URL}/imagenes/eliminar/${id}`, {
            method: 'DELETE'
        });

        // Luego se elimina la persona
        await fetch(`${API_URL}/personas/${id}`, { method: 'DELETE' });
        cargarPersonas(); // Recargar lista
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        alert('Error al eliminar a la persona: ' + error.message);
    }
}

// Editar persona
async function editarPersona(id) {
    const persona = personas.find(p => p.id_persona === id);
    if (!persona) return;

    document.getElementById('id_persona').value = persona.id_persona;
    document.getElementById('nombre').value = persona.nombre;
    document.getElementById('apellido').value = persona.apellido;
    document.getElementById('tipo_identificacion').value = persona.tipo_identificacion;
    document.getElementById('nuip').value = persona.nuip;
    document.getElementById('email').value = persona.email;
    document.getElementById('clave').value = persona.clave;
    document.getElementById('salario').value = persona.salario;
    document.getElementById('activo').checked = persona.activo;

    try {
        const res = await fetch(`${API_URL}/imagenes/mostrar/${persona.id_persona}/${persona.imagen}`);
        const data = await res.blob();
        const imageUrl = URL.createObjectURL(data);
        previewImagen.src = imageUrl;
        previewImagen.style.display = 'block';
    } catch (error) {
        console.error('Error al cargar imagen:', error);
        previewImagen.src = '';
        previewImagen.style.display = 'none';
    }
}

// Limpiar formulario
function limpiarFormulario() {
    formPersona.reset(); // Esto limpia todos los campos del formulario
    document.getElementById('id_persona').value = ''; // Quita el id de la persona y lo establece en vacío
    previewImagen.src = ''; // Limpia la imagen del preview
    previewImagen.style.display = 'none'; // Oculta el preview
}

// Funciones para el manejo de imágenes
function manejarImagen(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        previewImagen.src = e.target.result;
        previewImagen.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

async function subirImagen(id_persona) {
    const file = inputImagen.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagen', file);

    try {
        await fetch(`${API_URL}/imagenes/subir/${id_persona}`, {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        console.error('Error al subir imagen:', error);
    }
}
