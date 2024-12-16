import { App as AntdApp } from 'antd';
import { Helmet } from 'react-helmet-async';

import ErmisLogo from '@/assets/images/ermislogo.svg';
import Router from '@/router/index';
import AntdConfig from '@/theme/antd';

import { MotionLazy } from './components/animate/motion-lazy';

function App() {
  return (
    <AntdConfig>
      <AntdApp>
        <MotionLazy>
          <Helmet>
            <title>ErmisChat</title>
            <link rel="icon" href={ErmisLogo} />
          </Helmet>

          <Router />
        </MotionLazy>
      </AntdApp>
    </AntdConfig>
  );
}

export default App;
