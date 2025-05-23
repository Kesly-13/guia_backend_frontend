// Variables globales
const API_URL = 'http://localhost:3000/api'; // Constante que almacena la URL que se conecta al servidor
let personas = []; // Variable que almacenará el listado de personas obtenidas del backend

// Elementos del DOM
const personaForm = document.getElementById('personaForm'); // Formulario principal
const tablaPersonasBody = document.getElementById('tablaPersonasBody'); // Cuerpo de la tabla donde se insertan las filas
const btnCancelar = document.getElementById('btnCancelar'); // Este botón de cancelar limpia el formulario
const btnGuardar = document.getElementById('btnGuardar'); // Este botón sirve para subir o cargar la imagen
const imagenInput = document.getElementById('imagen'); // Input tipo file para subir o cargar la imagen
const previewImagen = document.getElementById('previewImagen'); // Elemento imagen de previsualización

// Eventos Listeners
document.addEventListener('DOMContentLoaded', cargarPersonas); // Cuando el DOM esté listo, se cargan las personas
personaForm.addEventListener('submit', manejarSubmit); // Al enviar el formulario, se ejecuta la función manejarSubmit
btnCancelar.addEventListener('click', limpiarFormulario); // Al hacer clic en Cancelar, se limpia el formulario
imagenInput.addEventListener('change', manejarImagen); // Al cambiar la imagen, se llama manejarImagen para previsualizar

// Funciones para el manejo de personas
async function cargarPersonas() {
  try {
    const response = await fetch(`${API_URL}/personas`); // Se hace petición GET al endpoint personas
    personas = await response.json(); // Se almacena la respuesta como lista de personas
    await mostrarPersonas(); // Se llama a función para mostrarlas en la tabla
  } catch (error) {
    console.error('Error al cargar personas:', error);
  }
}

async function mostrarPersonas() {
  tablaPersonasBody.innerHTML = ''; // Limpiar el contenido actual

  for (const persona of personas) {
    const tr = document.createElement('tr'); // Crear una fila HTML

    // Cargar la imagen si existe
    let imagenHTML = 'Sin imagen';
    try {
      const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`); // Petición al backend para obtener la imagen en base64
      const data = await response.json();
      if (data.imagen) {
        imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" style="max-width: 100px; max-height: 100px;">`;
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
    }

    // Construir la fila HTML con los datos de la persona y los botones de acción
    // Se utiliza template literals para facilitar la inserción de variables en el HTML
    tr.innerHTML = `
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">${persona.id_persona}</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">${persona.nombre}</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">${persona.apellido}</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">${persona.email}</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">${imagenHTML}</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">
        <button onclick="editarPersona(${persona.id_persona})">Editar</button>
        <button onclick="eliminarPersona(${persona.id_persona})">Eliminar</button>
      </td>
    `;
    tablaPersonasBody.appendChild(tr); // Se añade la fila a la tabla
  }
}

async function manejarSubmit(e) {
    e.preventDefault(); // Evita que el formulario recargue la página
  
    // Obtener o recopilar los valores del formulario y crear un objeto persona
    // Se utiliza getElementById para obtener los valores de cada campo del formulario
    // Se utiliza parseInt y parseFloat para convertir los valores a números
    // Se utiliza el operador || para asignar null si el campo está vacío
    const persona = {
      id_persona: document.getElementById('id_persona').value || null,
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      tipo_identificacion: document.getElementById('tipo_identificacion').value,
      nuip: parseInt(document.getElementById('nuip').value),
      email: document.getElementById('email').value,
      clave: document.getElementById('clave').value,
      salario: parseFloat(document.getElementById('salario').value),
      activo: document.getElementById('activo').checked
    };
  
    try {
      if (persona.id_persona) {
        // Si hay una persona seleccionada, se actualiza primero la imagen
        if (imagenInput.files[0]) {
          const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
          await fetch(`${API_URL}/imagenes/subir/personas/id_persona/${persona.id_persona}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagen: imagenBase64 })
          });
        }
        // Luego se actualizan los datos de la persona
        await actualizarPersona(persona);
      } else {
        // Si es una persona nueva se procede a crearla
        const nuevaPersona = await crearPersona(persona);
        // Si hay una imagen seleccionada, se sube
        if (imagenInput.files[0]) {
          const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
          await fetch(`${API_URL}/imagenes/insertar/personas/id_persona/${nuevaPersona.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagen: imagenBase64 })
          });
        }
      }
      limpiarFormulario(); // Limpiar formulario
      cargarPersonas(); // Recargar la tabla y mostrar las personas
    } catch (error) {
      console.error('Error al guardar persona:', error);
      alert('Error al guardar los datos: ' + error.message);
    }
  }
  
  async function crearPersona(persona)
    // Se utiliza el método POST para crear una nueva persona en el backend
    // Se envía el objeto persona como cuerpo de la petición en formato JSON
    // Se espera la respuesta y se convierte a JSON
    {
         const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
      });
      return await response.json();
    }
  
  
  async function actualizarPersona(persona)
    // Se utiliza el método PUT para actualizar los datos de una persona existente
    // Se envía el objeto persona como cuerpo de la petición en formato JSON
    // Se espera la respuesta y se convierte a JSON
    // Se utiliza el ID de la persona para identificarla en el backend
  {
    const response = await fetch(`${API_URL}/personas/${persona.id_persona}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona)
    });
    return await response.json();
  }

  async function eliminarPersona(id)
    // Se utiliza el método DELETE para eliminar una persona existente
    // Se utiliza el ID de la persona para identificarla en el backend
    // Se espera la respuesta y se convierte a JSON
    // Se tiliza el método DELETE para eliminar la imagen asocioda a la persona 
  {
    if (confirm('¿Está seguro de eliminar esta persona?')) {
        try {
            // Primero se intenta eliminar la imagen si existe
            await fetch(`${API_URL}/imagenes/eliminar/personas/id_persona/${id}`,{
                method: `DELETE`
            })
            // Luego se eelimina la parsona
            await fetch(`${API_URL}/personas/${id}`, {method: 'DELETE'});
            cargarPersonas();
        } catch (error) {
            console.error('Error al eliminar persona:', error)
            alert('Error al eliminar la prsona: ' + error.message)
        }
    }
  }


  async function editarPersona(id) 
    // Se utiliza el método GE para obtener los datos de una persona existente
    // Se utiliza el ID de la persona para identificarla en el backend
    // Se espera la respuesta y se convierte a JSON
{
    const persona = personas.find(p => p.id_persona === id);

    if (persona) {
        document.getElementById('id_persona').value = persona.id_persona;
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('tipo_identificacion').value = persona.tipo_identificacion;
        document.getElementById('nuip').value = persona.nuip;
        document.getElementById('email').value = persona.email;
        document.getElementById('clave').value =''; // No mostramos la contraseña
        document.getElementById('salario').value = persona.salario;
        document.getElementById('activo').checked = persona.activo;

        // Cargar imagen si existe
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${id}`);
            const data = await response.json();
            if (data.imagen) {
                previewImagen.src = `data:image/jpeg;base64,${data.imagen}`;
                previewImagen.style.display = 'block';
            } else {
                previewImagen.style.display ='none';
                previewImagen.src = '';
            }
        } catch (error) {
            console.error('Error a cargar imagen:', error);
            previewImagen.style.display ='none';
            previewImagen.src = '';
        }
    }
}
  
function limpiarFormulario()
// Se utlza el método reset para limpair todos os campos del formulario
// Se utilizael método getElementById para el ID de la persona y se establece en vacío
// Se utiliza l métdo getElementById para obtener el elmento de previsualización de la imaen y se establece en vació
{
    personaForm.reset();
    document.getElementById('id_persona').value = '';
    previewImagen.style.display ='none';
    previewImagen.src = '';
}

// Funcioes para el manejo de imágenes
function manejarImagen(e) {
    const file = e.target.files[0];
    if (file) {
        const reader =new FileReader();
        reader.onload = function(e){
            previewImagen.src = e.target.result;
            previewImagen.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        previewImagen.style.display ='none';
        previewImagen.src = '';
    }
    // Se utiliza el método readAsDataURL para leer el archivo com una URL de datos
}

// Funcion para convertir imagen a base64
function convertirImagenABase64 (file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Eliminar el prefijo "data:image/jpeg;base64," del resulotado
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}