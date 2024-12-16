import { Image } from 'antd';
import { NavLink } from 'react-router-dom';

import ErmisLogoWhite from '@/assets/images/ermislogo.svg';

interface Props {
  size?: number | string;
}
function Logo({ size = 50 }: Props) {
  return (
    <NavLink to="/">
      <Image src={ErmisLogoWhite} preview={false} width={size} height={size} />
    </NavLink>
  );
}

export default Logo;
