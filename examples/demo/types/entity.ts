import { BasicStatus, PermissionType } from './enum';

export interface UserToken {
  accessToken?: string;
  // refreshToken?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  role?: Role;
  // status?: BasicStatus;
  permissions?: Permission[];
  allowedPermissions?: string[];
}

export interface IClientInfo {
  id: string;
  email: string;
  name: string;
  phone: string;
  image: string;
}

export interface Organization {
  id: string;
  name: string;
  status: 'enable' | 'disable';
  desc?: string;
  order?: number;
  children?: Organization[];
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  role_name: string | any;
  role_id: number | any;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  chain_id: number;
  admin_id: string;
  admin_token?: string;
  client_id?: string;
  display: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  // children?: Project[];
}

export interface IChain {
  id: string;
  name: string;
  short_name: string;
  image?: string;
}

export interface IModalProps {
  show: boolean;
  title: string;
  record: Record<string, any> | null;
  type?: string;
}

export interface MutationArgs {
  type: string;
  data: any;
}

export interface IApp {
  id: string;
  app_name: string;
  app_status: string;
  chain_id: number;
  app_urls: string;
  client_id?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  apikey: string;
}

export interface IRole {
  role_id: number;
  role_name: string | any;
  permissions: string[];
  role_label?: string | any;
}
