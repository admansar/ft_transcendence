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
        component: () => import('../pages/auth.js').then(module => {
            module.attachDOM('register')
        })
    },
    {
        path: '/login',
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
        path: '/offline_game',
        component: () => import('../pages/game_offline.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/online_game',
        component: () => import('../pages/game_online.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/game_3d',
        component: () => import('../pages/3d_ping_pong.js').then(module => {
            module.attachDOM();
        })
    },
    {
        path: '/tournament',
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

window.addEventListener('popstate', handleBackNavigation);