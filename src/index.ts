import { getPopularMovies } from "./services/movie.service.js";
import type { MovieResponse } from "./types/movie.types.js";

const initApp = async () => {
    const movieContainer = document.querySelector("#movies-container");
    if (!movieContainer) return;

    let movieList: string = "";
    const movies: MovieResponse = await getPopularMovies();
    movies.results.forEach((movie) => {
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

    movieContainer.innerHTML = movieList;
};

initApp();