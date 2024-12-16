import { faker } from '@faker-js/faker';

import { BasicStatus, OrderPaths, PermissionType } from '#/enum';

/**
 * User permission mock
 */

const CLIENTS_ROUTE = {
  id: OrderPaths.Clients,
  parentId: '',
  label: 'sys.menu.client',
  name: 'Clients',
  icon: '',
  type: PermissionType.MENU,
  route: 'clients',
  order: OrderPaths.Clients,
  component: '/clients/index.tsx',
};




