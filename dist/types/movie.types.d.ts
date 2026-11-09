export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
}
export interface MovieResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}
//# sourceMappingURL=movie.types.d.ts.map