import type {MovieResponse} from '../types/movie.types.js';
import type { MovieDetails } from '../types/movie.types.js';

const apiKey = 'bf83fd724b1b4e6b14b244bdd2527992';
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;

export const getPopularMovies = async(): Promise<MovieResponse> => {
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const movieList : MovieResponse = await response.json();
        return movieList;
    }catch(error){ 
        console.error('Fallos en la peticion: ' , error);
        throw error;
    }  
};              

export const searchMovies = async(query : string): Promise <MovieResponse> => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}&language=es-ES&page=1`);
        if(!query ||query === "") throw new Error(`Peticion invalida}`);
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const movieList : MovieResponse = await response.json();
        return movieList;
        
    }catch(error){
        console.error('Fallos en la peticion: ' , error);
        throw error;
    }   
};

export const getMovieDetails = async(id:string|number):Promise<MovieDetails> => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES`);
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
        const movieDetails : MovieDetails = await response.json();
        return movieDetails;
    
    }catch(error){
        console.error('Fallos en la peticion: ' , error);
        throw error;
    }

};