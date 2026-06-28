const API_URL = "https://thronesapi.com/api/v2/Characters";

const personajesGrid = document.getElementById("personajesGrid");
const estado = document.getElementById("estado");
const buscador = document.getElementById("buscador");
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrarModal");
const quizForm = document.getElementById("quizForm");

let personajes = [];

// aquí se cargan los personajes desde la API
async function cargarPersonajes() {
  try {
    const res = await fetch(API_URL);
    personajes = await res.json();

    if (personajesGrid) {
      renderizarPersonajes(personajes.slice(0, 24));
    }

    if (estado) {
      estado.classList.add("hidden");
    }
  } catch (error) {
    if (estado) {
      estado.textContent = "No se pudieron cargar los personajes. Revisa tu conexión a internet.";
    }
  }
}

// muestra las tarjetas en la página
function renderizarPersonajes(lista) {
  personajesGrid.innerHTML = "";

  lista.forEach(personaje => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "character-card";

    tarjeta.innerHTML = `
      <img src="${personaje.imageUrl}" alt="${personaje.fullName}">
      <div class="character-info">
        <h3>${personaje.fullName || "Sin nombre"}</h3>
        <p><b>Familia:</b> ${personaje.family || "No registrada"}</p>
        <p><b>Título:</b> ${personaje.title || "No registrado"}</p>
        <button class="card-btn" data-id="${personaje.id}">Ver detalles</button>
      </div>
    `;

    personajesGrid.appendChild(tarjeta);
  });

  document.querySelectorAll(".card-btn").forEach(boton => {
    boton.addEventListener("click", () => {
      const personaje = personajes.find(p => p.id == boton.dataset.id);
      abrirModal(personaje);
    });
  });
}

// abre la ventana con la información del personaje
function abrirModal(personaje) {
  if (!modal || !personaje) return;

  document.getElementById("modalImagen").src = personaje.imageUrl;
  document.getElementById("modalImagen").alt = personaje.fullName;
  document.getElementById("modalNombre").textContent = personaje.fullName || "Sin nombre";
  document.getElementById("modalTitulo").textContent = personaje.title || "Título no registrado";
  document.getElementById("modalFamilia").textContent = personaje.family || "No registrada";
  document.getElementById("modalCompleto").textContent = personaje.fullName || "No registrado";
  document.getElementById("modalId").textContent = personaje.id;

  modal.classList.remove("hidden");
}

if (cerrarModal) {
  cerrarModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

// buscador sencillo por nombre, familia o título
if (buscador) {
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();

    const filtrados = personajes.filter(personaje => {
      return (
        (personaje.fullName || "").toLowerCase().includes(texto) ||
        (personaje.family || "").toLowerCase().includes(texto) ||
        (personaje.title || "").toLowerCase().includes(texto)
      );
    });

    renderizarPersonajes(filtrados);
  });
}

// test para relacionar respuestas con un personaje
if (quizForm) {
  quizForm.addEventListener("submit", e => {
    e.preventDefault();

    if (personajes.length === 0) {
      mostrarMensajeQuiz("Espera unos segundos hasta que carguen los personajes.");
      return;
    }

    const valor = document.getElementById("valor").value;
    const decision = document.getElementById("decision").value;
    const tipo = document.getElementById("tipo").value;

    const opciones = {
      liderazgo: ["Daenerys Targaryen", "Jon Snow", "Robert Baratheon"],
      lealtad: ["Jon Snow", "Samwell Tarly", "Sansa Stark"],
      estrategia: ["Tyrion Lannister", "Sansa Stark", "Cersei Lannister"],
      valentia: ["Arya Stark", "Jaime Lannister", "Jon Snow"],
      ambicion: ["Cersei Lannister", "Daenerys Targaryen", "Robert Baratheon"],
      proteger: ["Jon Snow", "Sansa Stark", "Samwell Tarly"],
      analizar: ["Tyrion Lannister", "Brandon Stark", "Samwell Tarly"],
      enfrentar: ["Arya Stark", "Jaime Lannister", "Robert Baratheon"],
      adaptarse: ["Sansa Stark", "Tyrion Lannister", "Brandon Stark"],
      mandar: ["Daenerys Targaryen", "Cersei Lannister", "Robert Baratheon"],
      heroe: ["Jon Snow", "Samwell Tarly"],
      guerrera: ["Arya Stark", "Sansa Stark"],
      reina: ["Cersei Lannister", "Daenerys Targaryen"],
      inteligente: ["Tyrion Lannister", "Brandon Stark", "Samwell Tarly"],
      familiar: ["Sansa Stark", "Jaime Lannister", "Jon Snow"]
    };

    const nombres = [
      ...opciones[valor],
      ...opciones[decision],
      ...opciones[tipo]
    ];

    const conteo = {};

    nombres.forEach(nombre => {
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    const mayor = Math.max(...Object.values(conteo));
    const ganadores = Object.keys(conteo).filter(nombre => conteo[nombre] === mayor);
    const nombreGanador = ganadores[Math.floor(Math.random() * ganadores.length)];
    const personaje = buscarPersonaje(nombreGanador);

    mostrarResultadoQuiz(personaje);
  });
}

function buscarPersonaje(nombre) {
  let personaje = personajes.find(p => {
    return (p.fullName || "").toLowerCase() === nombre.toLowerCase();
  });

  if (personaje) {
    return personaje;
  }

  personaje = personajes.find(p => {
    return (p.fullName || "").toLowerCase().includes(nombre.split(" ")[0].toLowerCase());
  });

  return personaje || personajes[Math.floor(Math.random() * personajes.length)];
}

function mostrarResultadoQuiz(personaje) {
  const resultado = document.getElementById("resultadoQuiz");

  if (!resultado || !personaje) return;

  resultado.innerHTML = `
    <img src="${personaje.imageUrl}" alt="${personaje.fullName}">
    <div>
      <h3>Tu personaje es: ${personaje.fullName}</h3>
      <p><b>Familia:</b> ${personaje.family || "No registrada"}</p>
      <p><b>Título:</b> ${personaje.title || "No registrado"}</p>
      <p>Este resultado se genera según tus respuestas.</p>
    </div>
  `;

  resultado.classList.remove("hidden");
}

function mostrarMensajeQuiz(mensaje) {
  const resultado = document.getElementById("resultadoQuiz");

  if (!resultado) return;

  resultado.innerHTML = `
    <div>
      <h3>${mensaje}</h3>
    </div>
  `;

  resultado.classList.remove("hidden");
}

cargarPersonajes();
