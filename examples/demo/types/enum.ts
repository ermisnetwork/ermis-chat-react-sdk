export enum BasicStatus {
  DISABLE,
  ENABLE,
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
  TIMEOUT = 401,
}

export enum StorageEnum {
  User = 'user',
  Client = 'client',
  Token = 'token',
  Settings = 'settings',
  I18N = 'i18nextLng',
  UrlApi = 'urlApi',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Default = 'default',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
}

export enum LocalEnum {
  en_US = 'en_US',
  vi_VN = 'vi_VN',
}

export enum MultiTabOperation {
  FULLSCREEN = 'fullscreen',
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHERS = 'closeOthers',
  CLOSEALL = 'closeAll',
  CLOSELEFT = 'closeLeft',
  CLOSERIGHT = 'closeRight',
}

export enum PermissionType {
  CATALOGUE,
  MENU,
  BUTTON,
}

export enum ActionEnum {
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
}

export enum AppStatus {
  Open = 'open',
  Closed = 'closed',
}

export enum ProjectAccessType {
  Public = 'public',
  Private = 'private',
}

export enum QueryKey {
  Clients = 'clients',
  Projects = 'projects',
  Chains = 'chains',
  Apps = 'apps',
  Project = 'project',
  ClientOverview = 'clientOverview',
  ProjectOverview = 'projectOverview',
  ProjectUsers = 'projectUsers',
  Channels = 'channels',
  TokenGate = 'tokenGate',
  Roles = 'roles',
  PendingUsers = 'pendingUsers',
  ActiveUsers = 'activeUsers',
}

export enum ChannelType {
  General = 'general',
  Private = 'team',
}

export enum Paths {
  Login = '/login',
  Clients = '/clients',
  Projects = '/projects',
  Team = '/team',
  Security = '/security',
  NotFound404 = '/404',
  NotFound403 = '/403',
  NotFound500 = '/500',
  Invite = '/invite',
  Billing = '/billing',
}

export enum OrderPaths {
  Clients = 1,
  Projects = 2,
  ProjectDetail = 3,
  Team = 4,
  Security = 5,
  Chains = 6,
  Billing = 7,
}

export enum Environment {
  Product = 'product',
  Staging = 'staging',
  Development = 'development',
}

export enum ChannelRole {
  Owner = 'owner',
  Mod = 'moder',
  Member = 'member',
  Pending = 'pending',
}

export enum ConditionType {
  Token = 'token',
  NFT = 'nft',
}

export enum MemberRole {
  SuperAdmin = 'super_admin',
  ClientAdmin = 'client_admin',
  User = 'user',
  ProjectManager = 'project_manager',
  Developer = 'developer',
  Finance = 'finance',
}

export enum InviteStatus {
  Accepted = 'accepted',
  Pending = 'pending',
}

export enum TeamTableType {
  ActiveTable = 'active',
  PendingTable = 'pending',
}
