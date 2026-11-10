import { getPopularMovies } from "./services/movie.service.js";
import { searchMovies } from "./services/movie.service.js";
import { getMovieDetails } from "./services/movie.service.js";
import type { Movie, MovieResponse,MovieDetails } from "./types/movie.types.js";

const movieContainer = document.querySelector("#catalog-view");
const movieDetails = document.querySelector("#detail-view");
//INICIAR LA APP Y MOSTRAR LAS PELICULAS

const renderMovies = (movies : Movie[]): void => {
    if (!movieContainer) return;

    let movieList: string = "";

    if(movies.length === 0){
        movieList = `<h2>No se encontraron peliculas</h2>`;
    }else{
        movies.forEach((movie) => {
            const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';
            
            movieList += `<div class="movie-card" data-id="${movie.id}">
                <h1>Movie title : ${movie.title}</h1>
                <h2>Vote Average : ${movie.vote_average}</h2>
                <h2>Release Date : ${movie.release_date}</h2>
                <img src="${posterUrl}"/>
            </div>`
        });
    }
    movieContainer.innerHTML = movieList;

}

const renderMovieDetails = (movie : MovieDetails):void => {
    if(!movieDetails) return;
    const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';

    movieDetails.innerHTML = `<h1>Title: ${movie.title}</h1> 
        <button id="back-btn">Volver</button>
        <img src="${posterUrl}"/>
        <h3>Rating: ${movie.vote_average} || Time: ${movie.runtime} || Genres: ${movie.genres.map(g => g.name).join(",")}</h3>
        <h4>Overview</h4>
        <hr></hr>
        <p>${movie.overview}</p>
    `;
    movieContainer?.classList.add("hidden");
    movieDetails.classList.remove("hidden");
    
}

const initApp = async () => {
    const movies: MovieResponse = await getPopularMovies();
    renderMovies(movies.results);
};

//BARRA DE BUSQUEDA
let timeOutId: number;
const searchInput = document.querySelector("#search-input");
searchInput?.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement).value;

    clearTimeout(timeOutId);

    timeOutId = window.setTimeout(async () => {
        if(value.trim() === ""){
            let response = await getPopularMovies();
            renderMovies(response.results);
        }else{
            let response = await searchMovies(value);
            renderMovies(response.results);
        }
    }, 500);
});

//CLICK EN PELICULA
movieContainer?.addEventListener("click",async (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest(".movie-card") as HTMLElement | null;
    if(!card) return
    const movieId = card.dataset.id;
    if(!movieId) throw new Error(`Peticion invalida}`);
    let response =await getMovieDetails(movieId);
    renderMovieDetails(response);
});

//MOVIE DETAILS BUTTON VOLVER
movieDetails?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("#back-btn")) {
    movieDetails.classList.add("hidden");
    movieContainer?.classList.remove("hidden");
  }
});

initApp();