const apiKey = 'bf83fd724b1b4e6b14b244bdd2527992';
const url = `https://api.themoviedb.or/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;
export const getPopularMovies = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const movieList = await response.json();
        return movieList;
    }
    catch (error) {
        console.error('Fallos en la peticion: ', error);
        throw error;
    }
};
export const searchMovies = async (query) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}&language=es-ES&page=1`);
        if (!query || query === "")
            throw new Error(`Peticion invalida}`);
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const movieList = await response.json();
        return movieList;
    }
    catch (error) {
        console.error('Fallos en la peticion: ', error);
        throw error;
    }
};
export const getMovieDetails = async (id) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES`);
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const movieDetails = await response.json();
        return movieDetails;
    }
    catch (error) {
        console.error('Fallos en la peticion: ', error);
        throw error;
    }
};
//# sourceMappingURL=movie.service.js.map