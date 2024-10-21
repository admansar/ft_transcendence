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
        component: () => import('../pages/register.js').then(module => {
            module.attachDOM()
        })
    },
    {
        path: '/login',
        component: () => import('../pages/login.js').then(module => {
            module.attachDOM()
        })
    },
]