import { Avatar } from 'antd';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function colorAvatar(name: string) {
  return stringToColor(name);
}

export type Props = {
  name: string;
  url: string;
  size: number;
};

export function AvatarComponent({ name = '', url = '', size }: Props) {
  const getFontSize = () => {
    return `${size / 2.5}px`;
  };

  if (url) {
    return <Avatar src={url} size={size} />;
  }
  return (
    <Avatar
      size={size}
      style={{ backgroundColor: colorAvatar(name), color: '#fff', fontSize: getFontSize() }}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );
}
