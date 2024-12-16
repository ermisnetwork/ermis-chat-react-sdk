import { ConditionType, Environment } from '#/enum';

export const LIST_ENVIRONMENT = [
  { value: Environment.Product, label: 'Product' },
  { value: Environment.Staging, label: 'Staging' },
  { value: Environment.Development, label: 'Development' },
];

export const DATE_FORMAT = 'YYYY/MM/DD';

export const LIST_CONDITION_TYPE = [
  { value: ConditionType.Token, label: 'Token' },
  { value: ConditionType.NFT, label: 'NFT' },
];

export const PURCHASE_LINK = 'https://app.uniswap.org/buy';
export const ERMIS_EMAIL = 'ermis@ermis.network';
