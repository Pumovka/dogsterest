type TRouteNames =
    | '/'
    | 'liked'

interface IRoute {
    route: string;
    name: string;
}

export const ROUTES: Record<TRouteNames, IRoute> = {
    '/': {
        name: 'Главная',
        route: '/',
    },
    liked: {
        name: 'Избранное',
        route: '/liked',
    },
};

