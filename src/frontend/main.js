// const API_URL = 'http://localhost:3000/api/personas'; // Cambia si tu servidor usa otro puerto

// // Crear una nueva persona
// document.getElementById('formularioPersona').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('nombre', document.getElementById('nombre').value);
//   formData.append('apellido', document.getElementById('apellido').value);
//   formData.append('tipo_identificacion', document.getElementById('tipo_identificacion').value);
//   formData.append('nuip', document.getElementById('nuip').value);
//   formData.append('email', document.getElementById('email').value);
//   formData.append('clave', document.getElementById('clave').value);
//   formData.append('salario', document.getElementById('salario').value);
//   formData.append('activo', document.getElementById('activo').value);

//   const imagen = document.getElementById('imagen').files[0];
//   if (imagen) {
//     formData.append('imagen', imagen);
//   }

//   try {
//     const respuesta = await fetch(API_URL, {
//       method: 'POST',
//       body: formData
//     });

//     const datos = await respuesta.json();
//     document.getElementById('resultado').innerText = datos.mensaje || 'Persona creada exitosamente';
//   } catch (error) {
//     document.getElementById('resultado').innerText = 'Error al crear persona.';
//   }
// });

// // Listar todas las personas
// document.getElementById('listarPersonas').addEventListener('click', async () => {
//   try {
//     const respuesta = await fetch(API_URL);
//     const personas = await respuesta.json();

//     let html = '<h2>Personas Registradas:</h2><ul>';
//     personas.forEach(p => {
//       html += `<li>
//         ${p.nombre} ${p.apellido} - ${p.tipo_identificacion} ${p.nuip} - ${p.email} - Salario: $${p.salario} - Activo: ${p.activo ? 'Sí' : 'No'}
//       </li>`;
//     });
//     html += '</ul>';

//     document.getElementById('resultado').innerHTML = html;
//   } catch (error) {
//     document.getElementById('resultado').innerText = 'Error al listar personas.';
//   }
// });
