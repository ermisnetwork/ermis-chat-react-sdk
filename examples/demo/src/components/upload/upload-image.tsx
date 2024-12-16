import { Upload, UploadProps, message } from 'antd';
import { useEffect, useState } from 'react';

import { Iconify } from '../icon';

import { getBlobUrl } from './utils';

import type { UploadFile } from 'antd/es/upload/interface';

interface Props extends UploadProps {
  defaultUrl?: string;
  onChange?: (fileList: any) => void;
  fileList?: UploadFile[];
}

export function UploadImage({ defaultUrl = '', onChange, fileList, ...props }: Props) {
  const [fileListState, setFileListState] = useState<UploadFile[]>(fileList || []);
  const [imageUrl, setImageUrl] = useState<string>(defaultUrl);
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    if (defaultUrl) {
      setImageUrl(defaultUrl);
    } else {
      setImageUrl('');
    }
  }, [defaultUrl]);

  const onChangeUpload = (info: any) => {
    const { file, fileList } = info;

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return;
    }

    if (onChange) {
      setFileListState(fileList);
      setImageUrl(getBlobUrl(file));
      onChange(fileList);
    }
  };

  const handelHover = (hover: boolean) => {
    setIsHover(hover);
  };

  const renderPreview = (
    <img src={imageUrl} alt="" className="absolute h-full rounded-full object-cover" />
  );

  const renderPlaceholder = (
    <div
      style={{
        backgroundColor: !imageUrl || isHover ? 'rgba(22, 28, 36, 0.64)' : 'transparent',
        color: '#fff',
      }}
      className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
    >
      <Iconify icon="solar:camera-add-bold" size={32} />
      <div className="mt-1 text-xs">Upload Photo</div>
    </div>
  );

  const renderContent = (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
      onMouseEnter={() => handelHover(true)}
      onMouseLeave={() => handelHover(false)}
    >
      {imageUrl ? renderPreview : null}
      {!imageUrl || isHover ? renderPlaceholder : null}
    </div>
  );

  return (
    <Upload
      {...props}
      showUploadList={false}
      listType="picture-circle"
      className="avatar-uploader !flex items-center justify-center"
      beforeUpload={() => false}
      onChange={onChangeUpload}
      fileList={fileListState}
    >
      {renderContent}
    </Upload>
  );
}
