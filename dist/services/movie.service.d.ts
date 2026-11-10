import type { MovieResponse } from '../types/movie.types.js';
import type { MovieDetails } from '../types/movie.types.js';
export declare const getPopularMovies: () => Promise<MovieResponse>;
export declare const searchMovies: (query: string) => Promise<MovieResponse>;
export declare const getMovieDetails: (id: string | number) => Promise<MovieDetails>;
//# sourceMappingURL=movie.service.d.ts.map