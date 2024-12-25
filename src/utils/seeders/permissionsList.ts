export const permissionsList = [
  {
    route: '/dashboard',
    can: 'dashboard.nav',
    description: 'Can view the dashboard page',
    parents: ['$'],
  },
  {
    route: '/manage-brands',
    can: 'manage-brands.nav',
    description: 'Can view the manage brands page',
    parents: ['$'],
  },
  {
    route: '/manage-products',
    can: 'manage-products.nav',
    description: 'Can view the manage products page',
    parents: ['$'],
  },
  {
    route: '/permissions',
    can: 'permissions.nav',
    description: 'Can view the permissions page',
    parents: ['$'],
  },
];
