import type {MovieResponse} from '../types/movie.types.js';

const url = 'https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY&language=en-US&page=1';

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