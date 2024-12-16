import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/dashboard';
import AuthGuard from '@/router/components/auth-guard';
import { usePermissionRoutes } from '@/router/hooks';
import { ErrorRoutes } from '@/router/routes/error-routes';

import { Paths } from '#/enum';
import { AppRouteObject } from '#/router';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
const LoginRoute: AppRouteObject = {
  path: Paths.Login,
  Component: lazy(() => import('@/pages/sys/login/Login')),
};

const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to={Paths.NotFound404} replace />,
};

const ClientsPage = lazy(() => import('@/pages/clients'));

export default function Router() {
  const permissionRoutes = usePermissionRoutes();
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
  };

  const ClientsRoute: AppRouteObject = {
    path: Paths.Clients,
    element: (
      <AuthGuard>
        <ClientsPage />
      </AuthGuard>
    ),
  };

  const routes = [
    LoginRoute,
    ClientsRoute,
    asyncRoutes,
    ErrorRoutes,
    PAGE_NOT_FOUND_ROUTE,
  ];

  const router = createBrowserRouter(routes as unknown as RouteObject[]);

  return <RouterProvider router={router} />;
}
