const url = 'https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY&language=en-US&page=1';
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
//# sourceMappingURL=movie.service.js.map