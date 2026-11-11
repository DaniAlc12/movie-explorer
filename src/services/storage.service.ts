const favoritesKey = "movie_explorer_favorites";

export const getFavoriteIds = (): number[] => {
    const response = localStorage.getItem(favoritesKey);
    if(!response) return [];
    const myFavorites:number[] = JSON.parse(response);
    return myFavorites;
};

export const isFavorite = (id:number): boolean => {
    return getFavoriteIds().includes(id);
};

export const toggleFavorite = (id:number): void =>{
    let myFavorites: number[] = getFavoriteIds();
    let updateFavorites: number[];
    if(isFavorite(id)){
        updateFavorites = myFavorites.filter(favId =>favId !== id);
    }else{
        updateFavorites = [...myFavorites,id];
    }
    localStorage.setItem(favoritesKey,JSON.stringify(updateFavorites));
};