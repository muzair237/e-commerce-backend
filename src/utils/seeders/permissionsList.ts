export const permissionsList: {
  route: string;
  can: string;
  description: string;
  parents: string[];
}[] = [
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
  {
    route: '/roles',
    can: 'roles.nav',
    description: 'Can view the roles page',
    parents: ['$'],
  },
  {
    route: '/admins',
    can: 'admins.nav',
    description: 'Can view the admins page',
    parents: ['$'],
  },
  {
    route: '/manage-brands/create-brand',
    can: 'manage-brands.create-brand',
    description: 'Can create a new brand',
    parents: ['manage-brands'],
  },
  {
    route: '/manage-brands/view-logo',
    can: 'manage-brands.view-logo',
    description: 'Can view the logo of brand',
    parents: ['manage-brands'],
  },
  {
    route: '/manage-brands/update-brand',
    can: 'manage-brands.update-brand',
    description: 'Can update the brand information',
    parents: ['manage-brands'],
  },
  {
    route: '/manage-brands/delete-brand',
    can: 'manage-brands.delete-brand',
    description: 'Can delete the brand',
    parents: ['manage-brands'],
  },
  {
    route: '/manage-products/apply-advanced-product',
    can: 'manage-products.apply-advanced-product',
    description: 'Can apply advanced filters on product',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/create-product',
    can: 'manage-products.create-product',
    description: 'Can create a new product',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/view-product-images',
    can: 'manage-products.view-product-images',
    description: 'Can view product images',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/create-product-variant',
    can: 'manage-products.create-product-variant',
    description: 'Can create a new variant for product',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/view-product-variants',
    can: 'manage-products.view-product-variants',
    description: 'Can view variants of product',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/update-product',
    can: 'manage-products.update-product',
    description: 'Can update product information',
    parents: ['manage-products'],
  },
  {
    route: '/manage-products/delete-product',
    can: 'manage-products.delete-product',
    description: 'Can delete a product',
    parents: ['manage-products'],
  },
  {
    route: '/permissions/create-permission',
    can: 'permissions.create-permission',
    description: 'Can create a new permission',
    parents: ['permissions'],
  },
  {
    route: '/permissions/update-permission',
    can: 'permissions.update-permission',
    description: 'Can update a permission',
    parents: ['permissions'],
  },
  {
    route: '/permissions/delete-permission',
    can: 'permissions.delete-permission',
    description: 'Can delete a permission',
    parents: ['permissions'],
  },
  {
    route: '/roles/create-role',
    can: 'roles.create-role',
    description: 'Can create a new role',
    parents: ['roles'],
  },
  {
    route: '/roles/update-role',
    can: 'roles.update-role',
    description: 'Can update a role',
    parents: ['roles'],
  },
  {
    route: '/roles/delete-role',
    can: 'roles.delete-role',
    description: 'Can delete role',
    parents: ['roles'],
  },
  {
    route: '/admins/create-admin',
    can: 'admins.create-admin',
    description: 'Can create a new admin',
    parents: ['admins'],
  },
  {
    route: '/admins/update-admin',
    can: 'admins.update-admin',
    description: 'Can update an admin information',
    parents: ['admins'],
  },
  {
    route: '/admins/update-password',
    can: 'admins.update-password',
    description: 'Can update an admin password',
    parents: ['admins'],
  },
  {
    route: '/admins/delete-admin',
    can: 'admins.delete-admin',
    description: 'Can delete an admin',
    parents: ['admins'],
  },
];
