// Variables globales
const API_URL = 'http://localhost:3000'; // URL base de la API backend
let personas = []; // Arreglo donde se almacenan las personas del servidor

// Elementos del DOM
const personaForm = document.getElementById('personaForm'); // Formulario principal
const tablaPersonasBody = document.getElementById('tablaPersonasBody'); // Cuerpo de la tabla donde se listan personas
const idPersona = document.getElementById('id_persona'); // ID oculto para edición
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const tipo_identificacion = document.getElementById('tipo_identificacion');
const nuip = document.getElementById('nuip');
const email = document.getElementById('email');
const clave = document.getElementById('clave');
const salario = document.getElementById('salario');
const activo = document.getElementById('activo');
const imagen = document.getElementById('imagen'); // Imagen para previsualizar la subida
const previewImagen = document.getElementById('previewImagen');

document.addEventListener('DOMContentLoaded', cargarPersonas); // Carga personas al iniciar la página
document.getElementById('btnCancelar').addEventListener('click', limpiarFormulario); // Botón cancelar limpia el formulario
imagen.addEventListener('change', mostrarImagenSeleccionada); // Cargar previsualización cuando se selecciona imagen

// Función para obtener personas (GET)
async function cargarPersonas() {
  try {
    const response = await fetch(`${API_URL}/personas`); // Solicitud GET a la API
    personas = await response.json(); // Almacena las personas en el arreglo
    tablaPersonasBody.innerHTML = ''; // Limpia las personas actuales en tabla
  } catch (error) {
    console.error('Error al cargar personas:', error);
  }

  // Función para mostrar todas las personas en la tabla
  const template = document.getElementById('template');
  personas.forEach(async (persona) => {
    const clone = template.content.cloneNode(true); // Clona la estructura de una fila ya definida
    const tds = clone.querySelectorAll('td');

    // Recorre la lista de personas y completa la fila con sus datos
    tds[0].textContent = persona.id_persona;
    tds[1].textContent = persona.nombre;
    tds[2].textContent = persona.apellido;
    tds[3].textContent = persona.email;

    // Imagen
    const imagenTag = document.createElement('img');
    imagenTag.src = persona.imagen || 'noimagen.jpg'; // 'noimagen.jpg' por defecto
    imagenTag.alt = persona.nombre;
    imagenTag.style = 'max-width: 100px; max-height: 100px;';
    tds[4].appendChild(imagenTag);

    // Acciones - botones
    const btnEditar = clone.querySelector('.btn-editar');
    btnEditar.addEventListener('click', () => editarPersona(persona.id_persona));

    const btnEliminar = clone.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => eliminarPersona(persona.id_persona));

    // Finalmente, agrega la fila clonada (con datos y botones configurados) al cuerpo de la tabla
    tablaPersonasBody.appendChild(clone);
  });
}

// Función que maneja el envío del formulario (crear o editar persona)
personaForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Previene el comportamiento por defecto del formulario

  // Obtiene los datos del formulario
  const nuevaPersona = {
    id_persona: idPersona.value ? parseInt(idPersona.value) : null,
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    tipo_identificacion: tipo_identificacion.value,
    nuip: nuip.value.trim(),
    email: email.value.trim(),
    clave: clave.value.trim(),
    salario: parseFloat(salario.value),
    activo: activo.checked
  };

  try {
    if (!nuevaPersona.id_persona) {
      // Crear persona
      const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaPersona)
      });
      const personaGuardada = await response.json();

      // Si se cargó imagen, la subimos
      if (imagen.files[0]) {
        const imagenBase64 = await convertirImagenABase64(imagen.files[0]);
        await fetch(`${API_URL}/imagenes/actualizar/persona/${personaGuardada.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imagen: imagenBase64 })
        });
      }
    } else {
      await actualizarPersona(nuevaPersona);
    }

    cargarPersonas(); // Recarga la lista
    limpiarFormulario(); // Limpia el formulario
  } catch (error) {
    console.error('Error al guardar la persona:', error);
  }
});

// Devuelve los datos de una persona por ID
async function obtenerPersona(id_persona) {
  const response = await fetch(`${API_URL}/personas/${id_persona}`);
  return await response.json(); // Devuelve el objeto persona recibido con id
}

// Actualiza una persona seleccionada
async function actualizarPersona(persona) {
  return await fetch(`${API_URL}/personas/${persona.id_persona}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(persona)
  });
}

// Elimina persona por id
async function eliminarPersona(id_persona) {
  try {
    await fetch(`${API_URL}/imagenes/eliminar/persona/${id_persona}`, { method: 'DELETE' }); // elimina imagen

    await fetch(`${API_URL}/personas/${id_persona}`, {
      method: 'DELETE'
    }); // elimina persona

    cargarPersonas();
  } catch (error) {
    console.error('Error al eliminar persona:', error);
  }
}

// Llena el formulario con los datos de una persona para editar
async function editarPersona(id) {
  const persona = await obtenerPersona(id);
  idPersona.value = persona.id_persona;
  nombre.value = persona.nombre;
  apellido.value = persona.apellido;
  tipo_identificacion.value = persona.tipo_identificacion;
  nuip.value = persona.nuip;
  email.value = persona.email;
  clave.value = persona.clave;
  salario.value = persona.salario;
  activo.checked = persona.activo;

  // Carga la imagen si existe
  try {
    const response = await fetch(`${API_URL}/imagenes/obtener/persona/id_persona/${id}`);
    const data = await response.json();
    const url_imagen = `${API_URL}/imagenes/${data.nombre}`;
    previewImagen.src = url_imagen;
    previewImagen.style.display = 'block';
  } catch (error) {
    console.error('Error al cargar imagen:', error);
    previewImagen.style.display = 'none';
  }
}

// Limpia todos los campos del formulario
function limpiarFormulario() {
  personaForm.reset();
  idPersona.value = '';
  previewImagen.src = '';
  previewImagen.style.display = 'none';
}

// Muestra una previsualización de la imagen seleccionada
function mostrarImagenSeleccionada() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImagen.src = e.target.result;
      previewImagen.style.display = 'block';
    };
    reader.readAsDataURL(this.files[0]);
  } else {
    previewImagen.src = '';
    previewImagen.style.display = 'none';
  }
}

// Convierte imagen a base64 para enviarla al backend
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Elimina el prefijo del data URI
    reader.onerror = error => reject(error);
  });
}
