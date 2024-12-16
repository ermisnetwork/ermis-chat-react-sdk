import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';

export interface SignInReq {
  email: string;
  password: string;
}

export interface SignUpReq {
  name: string;
  email: string;
  password: string;
}

export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  SignIn = '/auth/login',
  SignUp = '/auth/register',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const signin = async (data: SignInReq) => {
  const response: any = await apiClient.post<SignInRes>({ url: UserApi.SignIn, data });

  if (response.status === 200) {
    return response.data;
  }
  return null;
};
const signup = async (data: SignUpReq) => {
  const response: any = await apiClient.post<SignInRes>({ url: UserApi.SignUp, data });

  if (response.status === 200) {
    return response.data;
  }
  return null;
};
const logout = () => apiClient.get({ url: UserApi.Logout });

export default {
  signin,
  signup,
  logout,
};
