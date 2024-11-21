import { isAuth } from '../services/utils.js';

    let chatSocket = ""
    export const Router = {
        normalizeRoute(route) {
            if (route.endsWith('/') && route.length > 1) {
                route = route.slice(0, -1);
                return this.normalizeRoute(route);
            }
            return route;
        },
        matchRoute(route, routePattern) {
            let routeSegments = route.split('/').filter(el => el !== '');
            let patternSegments = routePattern.split('/').filter(el => el !== '');
            
            if (routeSegments.length !== patternSegments.length) {
                return null;
            }
            
            const params = {};
            for (let i = 0; i < patternSegments.length; i++) {
                // params['path'] = routeSegments[0];
                if (patternSegments[i].startsWith(':')) {
                    const paramName = patternSegments[i].slice(1);
                    params[paramName] = routeSegments[i];
                } else if (patternSegments[i] !== routeSegments[i]) {
                    return null;
                }
            }
            console.log('params', params);
            return params;
        },
        findRoute: (route) => {
        chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/');
        chatSocket.onopen = function(e) {
            console.log('WebSocket connection established!');
        }
        route = Router.normalizeRoute(route);
        for (let i = 0; i < routes.length; i++) {
            const params = Router.matchRoute(route, routes[i].path);
            if (params) {
                Router.goto(routes[i], true, params);
                return;
            }
        }
        if (route !== '/')
            Router.goto(routes.find((el => el.path === '404')))
    },
    goto: async (route, addHistory = true, params = {}) => {
        let path = route.path;
        if (Object.keys(params).length > 0) {
            for (let key in params) {
                path = path.replace(`:${key}`, params[key]);
            }
        }

        if (path === '404') {
            path = '/404';
        }

        if (route.isAuth !== undefined && route.isAuth === false) {
            const isUserAuth = await isAuth();
            console.log('isUserAuth', isUserAuth);
            if (isUserAuth && (path === '/login' || path === '/register')) {
                route = routes.find((el => el.path === '/'));
                path = '/';
            } else if (!isUserAuth && path !== '/login' && path !== '/register') {
                route = routes.find((el => el.path === '/login'));
                path = '/login';
            }
        }

        console.log(`Navigating to ${path}`, params);
        if (addHistory) {
            history.pushState(null, null, path);
        }
        await route.component(params);
    }
}

export const routes = [
    {
        path: '/',
        isAuth: false,
        component: () => import('../pages/homepage.js').then(module => module.attachDOM())
    },
    {
        path: '404',
        component: () => import('../pages/404.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/register',
        isAuth: false,
        component: () => import('../pages/auth.js').then(module => {
            module.attachDOM('register')
        })
    },
    {
        path: '/login',
        isAuth: false,
        component: () => import('../pages/auth.js').then(module => {
            module.attachDOM('login')
        })
    },
    {
        path: '/profile/:username',
        // path: '/profile',
        component: async ({username}) => import('../pages/profile.js').then(module => {
            module.attachDOM({ username });
        })
    },
    {
        path: '/game/offline',
        isAuth: false,
        component: () => import('../pages/game_offline.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/game/online',
        isAuth: false,
        component: () => import('../pages/game_online.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/game/3d',
        isAuth: false,
        component: () => import('../pages/3d_ping_pong.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/game/tournament',
        isAuth: false,
        component: () => import('../pages/tournament_component.js').then(module => {
            module.attachDOM();
        })
    },
]




function handleBackNavigation() {
    let path = window.location.pathname;
    console.log('path', path);
    app.router.findRoute(path);
};

export function getwebsocket () {
    return chatSocket
}
window.addEventListener('popstate', handleBackNavigation);