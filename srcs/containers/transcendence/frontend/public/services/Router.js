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
    goto: async (route) => {
        console.log(`Going to ${route.path}`);
        await route.component();
    }
}

export const routes = [
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
]