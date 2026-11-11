import { getPopularMovies, searchMovies, getMovieDetails } from "./services/movie.service.js";
import { getFavoriteIds, isFavorite, toggleFavorite } from "./services/storage.service.js";
const catalogView = document.querySelector("#catalog-view");
const movieContainer = document.querySelector("#movies-container");
const movieDetails = document.querySelector("#detail-view");
//INICIAR LA APP Y MOSTRAR LAS PELICULAS
const renderMovies = (movies) => {
    let movieList = "";
    if (movies.length === 0) {
        movieList = `<h2>No se encontraron peliculas</h2>`;
    }
    else {
        movies.forEach((movie) => {
            const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image';
            movieList += `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card movie-card h-100 bg-secondary text-white border-0 shadow" data-id="${movie.id}">
                <img src="${posterUrl}" class="card-img-top"/> 
                    <div class="card-body d-flex flex-column justify-content-between>   
                        <h5 class="card-title">Movie title : ${movie.title}</h5>
                        <p class="card-text mb-1">Release Date : ${movie.release_date}</p>
                        <div>
                            <span class="badge bg-warning text-dark">Vote Average : ${movie.vote_average}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }
    movieContainer.innerHTML = movieList;
};
const renderMovieDetails = (movie) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';
    movieDetails.innerHTML = `
        <div class="row g-4 align-items-start">
            <div class="col-md-4">
                <img src="${posterUrl}" class="img-fluid rounded shadow"/>
            </div>
            <div class="col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Title: ${movie.title}</h2> 
                    <button id="back-btn">Volver</button>
                </div>
                <h3>Rating: ${movie.vote_average} || Time: ${movie.runtime} || Genres: ${movie.genres.map(g => g.name).join(",")}</h3>
                <button id="fav-btn" data-id="${movie.id}">${isFavorite(movie.id) ? "❤️ Quitar de favoritos" : "🤍 Añadir a favoritos"}</button>
                <h4>Overview</h4>
                <hr></hr>
                <p>${movie.overview}</p>
            </div>
        </div>
    `;
    catalogView.classList.add("hidden");
    movieDetails.classList.remove("hidden");
};
const initApp = async () => {
    try {
        renderLoading(movieContainer);
        const movies = await getPopularMovies();
        renderMovies(movies.results);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);
    }
};
//BARRA DE BUSQUEDA
let timeOutId;
const searchInput = document.querySelector("#search-input");
searchInput?.addEventListener("input", (e) => {
    const value = e.target.value;
    clearTimeout(timeOutId);
    timeOutId = window.setTimeout(async () => {
        try {
            if (value.trim() === "") {
                renderLoading(movieContainer);
                let response = await getPopularMovies();
                renderMovies(response.results);
            }
            else {
                renderLoading(movieContainer);
                let response = await searchMovies(value);
                renderMovies(response.results);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
            renderError(movieContainer, message);
        }
    }, 500);
});
//CLICK EN PELICULA
movieContainer?.addEventListener("click", async (e) => {
    try {
        const target = e.target;
        const card = target.closest(".movie-card");
        if (!card)
            return;
        const movieId = card.dataset.id;
        if (!movieId)
            throw new Error(`Peticion invalida}`);
        console.log("ID capturado en el evento:", movieId);
        let response = await getMovieDetails(movieId);
        renderMovieDetails(response);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);
    }
});
//MOVIE DETAILS BUTTON VOLVER Y FAVORITOS
movieDetails?.addEventListener("click", (e) => {
    const target = e.target;
    if (target.closest("#back-btn")) {
        movieDetails.classList.add("hidden");
        catalogView.classList.remove("hidden");
    }
    const favBtn = target.closest("#fav-btn");
    if (!favBtn)
        return;
    const movieId = Number(favBtn.dataset.id);
    toggleFavorite(movieId);
    if (isFavorite(movieId)) {
        favBtn.textContent = "❤️ Quitar de favoritos";
    }
    else {
        favBtn.textContent = "🤍 Añadir a favoritos";
    }
});
//BOTON VER FAVORITOS / VER TODAS
catalogView.addEventListener("click", async (e) => {
    try {
        const target = e.target;
        if (target.closest("#filter-favs-btn")) {
            let ids = getFavoriteIds();
            if (!ids || ids.length === 0) {
                renderMovies([]);
            }
            else {
                renderLoading(movieContainer);
                const favoritesDetails = await Promise.all(ids.map(id => getMovieDetails(id)));
                renderMovies(favoritesDetails);
            }
        }
        if (target.closest("#show-all-btn")) {
            initApp();
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);
    }
});
const renderLoading = (container) => {
    container.innerHTML = `<div class="spinner">Cargando...</div>`;
};
const renderError = (container, message) => {
    container.innerHTML = `<h2>Error en el sistema : ${message}</h2>`;
};
initApp();
//# sourceMappingURL=index.js.map