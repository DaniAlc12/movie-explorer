const favoritesKey = "movie_explorer_favorites";
export const getFavoriteIds = () => {
    const response = localStorage.getItem(favoritesKey);
    if (!response)
        return [];
    const myFavorites = JSON.parse(response);
    return myFavorites;
};
export const isFavorite = (id) => {
    return getFavoriteIds().includes(id);
};
export const toggleFavorite = (id) => {
    let myFavorites = getFavoriteIds();
    let updateFavorites;
    if (isFavorite(id)) {
        updateFavorites = myFavorites.filter(favId => favId !== id);
    }
    else {
        updateFavorites = [...myFavorites, id];
    }
    localStorage.setItem(favoritesKey, JSON.stringify(updateFavorites));
};
//# sourceMappingURL=storage.service.js.map