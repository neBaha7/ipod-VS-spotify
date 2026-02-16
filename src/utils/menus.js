export const menus = {
    main: {
        title: 'iPod',
        items: [
            { label: 'Cover Flow', id: 'coverflow', type: 'link' },
            { label: 'Music', id: 'music', type: 'menu' },
            { label: 'Settings', id: 'settings', type: 'menu' },
            { label: 'Now Playing', id: 'nowplaying', type: 'link' }
        ]
    },
    music: {
        title: 'Music',
        items: [
            { label: 'Queue', id: 'queue', type: 'app' },
            { label: 'Favorites', id: 'favorites', type: 'app' },
            { label: 'Playlists', id: 'playlists', type: 'app' },
            { label: 'Artists', id: 'artists', type: 'menu' },
            { label: 'Songs', id: 'songs', type: 'menu' },
            { label: 'Search', id: 'search', type: 'app' }
        ]
    },
    settings: {
        title: 'Settings',
        items: [
            { label: 'About', id: 'about', type: 'link' },
            { label: 'Color Theme', id: 'color_theme', type: 'menu' },
            { label: 'Sign In / Out', id: 'auth', type: 'action' }
        ]
    },
    color_theme: {
        title: 'Color',
        items: [
            { label: 'Silver', id: 'silver', type: 'action', action: 'setColor' },
            { label: 'Black', id: 'black', type: 'action', action: 'setColor' },
            { label: 'Red', id: 'red', type: 'action', action: 'setColor' },
            { label: 'Blue', id: 'blue', type: 'action', action: 'setColor' },
            { label: 'Purple', id: 'purple', type: 'action', action: 'setColor' }
        ]
    },
    nowplaying: {
        title: 'Now Playing',
        items: []
    },
    favorites: {
        title: 'Favorites',
        items: []
    },
    queue: {
        title: 'Queue',
        items: []
    },
    search: {
        title: 'Search',
        items: []
    },
    trackActions: {
        title: 'Track Options',
        items: [
            { label: 'Play Now', id: 'playNow', type: 'action', action: 'playNow' },
            { label: 'Add to Playlist', id: 'addToPlaylist', type: 'action', action: 'addToPlaylist' }
        ]
    },
    addToPlaylist: {
        title: 'Add to Playlist',
        items: []
    }
};
