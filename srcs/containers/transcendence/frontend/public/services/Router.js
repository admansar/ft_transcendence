export const Router = {
    findRoute: (route) => {
        for (let i = 0; i < routes.length; i++) {
            if (route === routes[i].path) {
                Router.goto(routes[i]);
                return;
            }
        }
        if (route !== '/')
            Router.goto(routes[0])
    },
    goto: async (route, addHistory = true) => {
        console.log(`Going to ${route.path}`);
        if (addHistory) {         
            history.pushState(null, null, route.path);
        }
        await route.component();
    }
}

export const routes = [
    // {
    //     path: '/',
    //     component: () => import('../pages/homepage.js').then(module => {
    //         module.attachDOM();
    //     })
    // },
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
        path: '/profile',
        component: () => import('../pages/profile.js').then(module => {
            module.attachDOM();
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
    console.log ('path', path);
    app.router.findRoute(path);
};

window.addEventListener('popstate', handleBackNavigation);