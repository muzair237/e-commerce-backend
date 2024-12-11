export const permissionsList = [
  {
    route: '/dashboard',
    can: 'dashboard.nav',
    description: 'Can view the dashboard page',
    parent: ['$'],
  },
  {
    route: '/manage-products',
    can: 'manage-products.nav',
    description: 'Can view the manage products page',
    parent: ['$'],
  },
];
