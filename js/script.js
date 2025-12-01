const API_KEY = "8ee58b07"; 
const buscador = document.getElementById("buscador");

const contenedorDestacadas = document.getElementById("contenedor-peliculas");
const contenedorEstrenos = document.getElementById("contenedor-estrenos");
const contenedorProximamente = document.getElementById("contenedor-proximamente");

// Variables del poster grande
const posterTitulo = document.getElementById("poster-titulo");
const posterSinopsis = document.getElementById("poster-sinopsis");
const imagenFondo = document.getElementById("imagen-fondo");
const btnDetalles = document.getElementById("btn-detalles");

// 🎬 Películas
const peliculasDestacadas = [
    "The Dark Knight",
    "Avengers: Endgame",
    "Iron Man",
    "Man of Steel",
    "Wonder Woman",
    "Spider-Man: No Way Home",
    "Logan",
    "Guardians of the Galaxy"
];

const ultimosEstrenos = [
    "The Marvels",
    "Aquaman and the Lost Kingdom",
    "Blue Beetle",
    "The Flash",
    "Kraven the Hunter",
    "Madame Web",
    "Deadpool & Wolverine",
    "Joker: Folie à Deux"
];

const proximamente = [
    "Superman: Legacy",
    "The Batman Part II",
    "Captain America: Brave New World",
    "Thunderbolts",
    "Avengers: Secret Wars"
];

// Inicialización
cargarListasIniciales();
cargarDestacada(peliculasDestacadas[0]);

function cargarListasIniciales() {
    cargarLista(peliculasDestacadas, contenedorDestacadas);
    cargarLista(ultimosEstrenos, contenedorEstrenos);
    cargarLista(proximamente, contenedorProximamente);
}

// Escuchar el buscador
buscador.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const titulo = buscador.value.trim();
        if (titulo) buscarPeliculas(titulo);
    }
});

// --- FUNCIÓN DE MANEJO DE CLICS PARA LOS BOTONES DE LA TARJETA ---
function handleCardAction(title, action) {
    if (action === 'lista') {
        let miLista = JSON.parse(localStorage.getItem("miLista")) || [];
        if (!miLista.includes(title)) {
            miLista.push(title);
            localStorage.setItem("miLista", JSON.stringify(miLista));
            alert(`¡"${title}" agregado a tu lista!`);
        } else {
            alert(`ℹ "${title}" ya está en tu lista.`);
        }
    } else if (action === 'megusta') {
        alert(`❤️ ¡Te gusta "${title}"!`);
        // Aquí podrías implementar la lógica real de guardar "Me gusta"
    }
}


// Cargar una lista de películas en un contenedor
function cargarLista(lista, contenedor) {
    contenedor.innerHTML = "";
    lista.forEach(titulo => {
        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                if (data.Response === "True") {
                    const card = document.createElement("article");
                    card.classList.add("tarjeta");
                    
                    // INYECCIÓN DEL HTML CON BOTONES Y BUENA INDENTACIÓN
                    card.innerHTML = `
                        <img src="${data.Poster !== "N/A" ? data.Poster : "images/no-poster.png"}" alt="${data.Title}">
                        
                        <div class="tarjeta-acciones">
                            <button class="btn-añadir" data-title="${data.Title}">+ Mi lista</button>
                            <button class="btn-megusta" data-title="${data.Title}">❤ Me gusta</button>
                        </div>

                        <div class="tarjeta-info">
                            <h3>${data.Title}</h3>
                            <p><strong>Año:</strong> ${data.Year}</p>
                        </div>
                    `;
                    contenedor.appendChild(card);

                    // MANEJADORES DE EVENTOS PARA LOS NUEVOS BOTONES
                    const btnAñadir = card.querySelector(".btn-añadir");
                    const btnMegusta = card.querySelector(".btn-megusta");
                    
                    // Al hacer clic en el botón de añadir, llama al handler y detiene la propagación
                    btnAñadir.addEventListener("click", (e) => {
                        e.stopPropagation(); 
                        handleCardAction(data.Title, 'lista');
                    });

                    // Al hacer clic en el botón de me gusta, llama al handler y detiene la propagación
                    btnMegusta.addEventListener("click", (e) => {
                        e.stopPropagation(); 
                        handleCardAction(data.Title, 'megusta');
                    });
                    
                    // Clic en la tarjeta (cualquier parte que no sea un botón) = poster grande
                    card.addEventListener("click", () => cargarDestacada(data.Title, data.imdbID));
                }
            })
            .catch(err => console.error(`Error cargando ${titulo}:`, err));
    });
}

// Cargar película destacada en el poster grande
function cargarDestacada(titulo, imdbID = null) {
    const url = imdbID ? `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}` : 
                         `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${API_KEY}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                posterTitulo.textContent = data.Title;
                posterSinopsis.textContent = data.Plot;
                imagenFondo.style.backgroundImage = `url(${data.Poster !== "N/A" ? data.Poster : "images/no-poster.png"})`;
                btnDetalles.href = `https://www.imdb.com/title/${data.imdbID}`;
            }
        })
        .catch(err => console.error("Error cargando destacada:", err));
}

// Buscar películas desde el input
function buscarPeliculas(titulo) {
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(titulo)}&apikey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                contenedorDestacadas.innerHTML = "";
                data.Search.forEach(pelicula => {
                    const card = document.createElement("article");
                    card.classList.add("tarjeta");
                    
                    // INYECCIÓN DEL HTML CON BOTONES Y BUENA INDENTACIÓN
                    card.innerHTML = `
                        <img src="${pelicula.Poster !== "N/A" ? pelicula.Poster : "images/no-poster.png"}" alt="${pelicula.Title}">
                        
                        <div class="tarjeta-acciones">
                            <button class="btn-añadir" data-title="${pelicula.Title}">+ Mi lista</button>
                            <button class="btn-megusta" data-title="${pelicula.Title}">❤ Me gusta</button>
                        </div>
                        
                        <div class="tarjeta-info">
                            <h3>${pelicula.Title}</h3>
                            <p><strong>Año:</strong> ${pelicula.Year}</p>
                        </div>
                    `;
                    contenedorDestacadas.appendChild(card);

                    // 🛠️ MANEJADORES DE EVENTOS PARA LOS NUEVOS BOTONES
                    const btnAñadir = card.querySelector(".btn-añadir");
                    const btnMegusta = card.querySelector(".btn-megusta");
                    
                    btnAñadir.addEventListener("click", (e) => {
                        e.stopPropagation(); 
                        handleCardAction(pelicula.Title, 'lista');
                    });

                    btnMegusta.addEventListener("click", (e) => {
                        e.stopPropagation(); 
                        handleCardAction(pelicula.Title, 'megusta');
                    });

                    // Clic en la tarjeta (cualquier parte que no sea un botón) = poster grande
                    card.addEventListener("click", () => cargarDestacada(pelicula.Title, pelicula.imdbID));
                });

                cargarDestacada(data.Search[0].Title, data.Search[0].imdbID);
            } else {
                contenedorDestacadas.innerHTML = `<p>No se encontraron resultados para "${titulo}".</p>`;
            }
        })
        .catch(err => console.error("Error en búsqueda:", err));
}

