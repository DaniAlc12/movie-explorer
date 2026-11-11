import { getPopularMovies,searchMovies,getMovieDetails } from "./services/movie.service.js";
import { getFavoriteIds, isFavorite,toggleFavorite } from "./services/storage.service.js";
import type { Movie, MovieResponse,MovieDetails } from "./types/movie.types.js";

const catalogView = document.querySelector<HTMLElement>("#catalog-view")!;
const movieContainer = document.querySelector<HTMLElement>("#movies-container")!;
const movieDetails = document.querySelector<HTMLElement>("#detail-view")!;
//INICIAR LA APP Y MOSTRAR LAS PELICULAS

const renderMovies = (movies : Movie[]): void => {
    let movieList: string = "";

    if(movies.length === 0){
        movieList = `<h2>No se encontraron peliculas</h2>`;
    }else{
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
            </div>`
        });
    }
    movieContainer.innerHTML = movieList;

}

const renderMovieDetails = (movie : MovieDetails):void => {
    const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';

    movieDetails.innerHTML = `<div class="movie-card" data-id="${movie.id}">
            <h1>Title: ${movie.title}</h1> 
            <button id="back-btn">Volver</button>
            <img src="${posterUrl}"/>
            <h3>Rating: ${movie.vote_average} || Time: ${movie.runtime} || Genres: ${movie.genres.map(g => g.name).join(",")}</h3>
            <button id="fav-btn">${isFavorite(movie.id) ? "❤️ Quitar de favoritos" : "🤍 Añadir a favoritos"}</button>
            <h4>Overview</h4>
            <hr></hr>
            <p>${movie.overview}</p>
        </div>
    `;
    catalogView.classList.add("hidden");
    movieDetails.classList.remove("hidden");
    
}

const initApp = async () => {
    try{
        renderLoading(movieContainer);
        const movies: MovieResponse = await getPopularMovies();
        renderMovies(movies.results);
    }catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);   
    }
};

//BARRA DE BUSQUEDA
let timeOutId: number;
const searchInput = document.querySelector("#search-input");
searchInput?.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value;

    clearTimeout(timeOutId);

    timeOutId = window.setTimeout(async () => {
        try{
            if(value.trim() === ""){
                renderLoading(movieContainer);
                let response = await getPopularMovies();
                renderMovies(response.results);
            }else{
                renderLoading(movieContainer);
                let response = await searchMovies(value);
                renderMovies(response.results);
            }
        }catch (error) {
            const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
            renderError(movieContainer, message);  
        }
    }, 500); 
});

//CLICK EN PELICULA
movieContainer?.addEventListener("click",async (e) => {
    try{
        const target = e.target as HTMLElement;
        const card = target.closest(".movie-card") as HTMLElement | null;
        if(!card) return
        const movieId = card.dataset.id;
        if(!movieId) throw new Error(`Peticion invalida}`);
        console.log("ID capturado en el evento:", movieId);
        let response =await getMovieDetails(movieId);
        renderMovieDetails(response);
    }catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);   
    }
});

//MOVIE DETAILS BUTTON VOLVER Y FAVORIOS
movieDetails?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("#back-btn")) {
    movieDetails.classList.add("hidden");
    catalogView.classList.remove("hidden");
  }

  const favBtn = target.closest("#fav-btn") as HTMLButtonElement | null;
  if(favBtn){
    const card = target.closest(".movie-card") as HTMLElement | null;
    if(!card) return
    const movieId = Number(card.dataset.id);
    toggleFavorite(movieId);
    if(isFavorite(movieId)){
        favBtn.textContent = "❤️ Quitar de favoritos"
    }else{
        favBtn.textContent = "🤍 Añadir a favoritos"
    }
  }
});

//BOTON VER FAVORITOS / VER TODAS
catalogView.addEventListener("click",async (e) => {
    try{
        const target = e.target as HTMLElement;
        if(target.closest("#filter-favs-btn")){
            let ids:number[] = getFavoriteIds();
            if(!ids || ids.length === 0){
                renderMovies([]);
            }else{
                renderLoading(movieContainer);
                const favoritesDetails:MovieDetails[] = await Promise.all(ids.map(id => getMovieDetails(id)))
                renderMovies(favoritesDetails);
            }
        }
        if(target.closest("#show-all-btn")){
            initApp();
        }
    }catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
        renderError(movieContainer, message);   
    }
});

const renderLoading = (container:HTMLElement):void => {
    container.innerHTML = `<div class="spinner">Cargando...</div>`
}

const renderError = (container:HTMLElement , message:string):void => {
    container.innerHTML = `<h2>Error en el sistema : ${message}</h2>`;
}
initApp();