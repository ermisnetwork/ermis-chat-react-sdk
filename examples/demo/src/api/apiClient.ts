import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';
import { getItem } from '@/utils/storage';

import { Result } from '#/api';
import { UserToken } from '#/entity';
import { StorageEnum } from '#/enum';

const urlApi = getItem(StorageEnum.UrlApi);
const baseUrl = urlApi || import.meta.env.VITE_APP_BASE_API;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getItem<UserToken>(StorageEnum.Token) || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res: AxiosResponse): any => {
    const { status, data } = res;

    if (status === 200) {
      return { status, data: data || null };
    }

    throw new Error(t('sys.api.apiRequestFailed'));
  },
  (error: any) => {
    const { response, message } = error || {};

    const errMsg = response?.data?.description || message || t('sys.api.errorMessage');
    Message.error(errMsg);

    const status = response?.status;
    if (status === 401) {
      userStore.getState().actions.clearUserInfoAndToken();
    }
    return { status, data: null, message: errMsg };
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'patch' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }

  setBaseUrl(baseUrl: string) {
    axiosInstance.defaults.baseURL = baseUrl;
  }
}
export default new APIClient();
