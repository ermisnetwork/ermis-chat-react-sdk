import { Layout, Select } from 'antd';
import Color from 'color';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import DashboardImg from '@/assets/images/background/dashboard.png';
import Overlay2 from '@/assets/images/background/overlay_2.jpg';
import LocalePicker from '@/components/locale-picker';
import { useUserToken } from '@/store/userStore';
import { useThemeToken } from '@/theme/hooks';
import { getItem, setItem } from '@/utils/storage';

import LoginForm from './LoginForm';
import { LoginStateProvider } from './providers/LoginStateProvider';
import RegisterForm from './RegisterForm';
import ResetForm from './ResetForm';

import { StorageEnum } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const ENVIRONMENTS = [
  {
    label: 'DEV',
    value: 'https://api-dev.ermis.network/uss/v1',
  },
  {
    label: 'STAGING',
    value: 'https://api-staging.ermis.network/uss/v1',
  },
  {
    label: 'INTERNAL',
    value: 'https://api-internal.ermis.network/uss/v1',
  },
];

function Login() {
  const urlApi = getItem(StorageEnum.UrlApi);
  const token = useUserToken();
  const { colorBgElevated } = useThemeToken();
  const [envi, setEnvi] = useState(urlApi || import.meta.env.VITE_APP_BASE_API);

  if (token.accessToken) {
    return <Navigate to={HOMEPAGE} replace />;
  }

  const gradientBg = Color(colorBgElevated).alpha(0.9).toString();
  const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${Overlay2})`;

  const onChangeEnvironment = (value: string) => {
    setItem(StorageEnum.UrlApi, value);
    setEnvi(value);
    window.location.reload();
  };

  return (
    <Layout className="relative flex !min-h-screen !w-full !flex-row">
      <div
        className="hidden grow flex-col items-center justify-center gap-[80px] bg-center  bg-no-repeat md:flex"
        style={{
          background: bg,
        }}
      >
        <div className="text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl">
          Ermis dashboard
        </div>
        <img className="max-w-[480px] xl:max-w-[560px]" src={DashboardImg} alt="" />
      </div>

      <div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]">
        <LoginStateProvider>
          <LoginForm />
          <RegisterForm />
          <ResetForm />
        </LoginStateProvider>
      </div>

      <div className="absolute right-2 top-0 flex items-center">
        <Select style={{ width: '120px' }} onChange={onChangeEnvironment} value={envi}>
          {ENVIRONMENTS.map((item: any) => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>

        <LocalePicker />
      </div>
    </Layout>
  );
}
export default Login;
