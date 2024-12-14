export const permissionsList = [
  {
    route: '/dashboard',
    can: 'dashboard.nav',
    description: 'Can view the dashboard page',
    parent: ['$'],
  },
  {
    route: '/manage-brands',
    can: 'manage-brands.nav',
    description: 'Can view the manage brands page',
    parent: ['$'],
  },
];
