import { useMutation } from '@tanstack/react-query';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import userService from '@/api/services/userService';
import { REGEX_USERNAME } from '@/constants/regex';

import { ReturnButton } from './components/ReturnButton';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';

function RegisterForm() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: userService.signup,
  });

  const { loginState, backToLogin } = useLoginStateContext();
  if (loginState !== LoginStateEnum.REGISTER) return null;

  const onFinish = async (values: any) => {
    try {
      delete values.confirmPassword;
      setLoading(true);
      const response = await signUpMutation.mutateAsync(values);
      if (response) {
        setLoading(false);
        message.success({
          content: t('sys.login.registerSuccessfully'),
          duration: 3,
        });
        backToLogin();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signUpFormTitle')}</div>
      <Form name="normal_login" size="large" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: t('sys.login.accountPlaceholder') },
            {
              pattern: REGEX_USERNAME,
              message: t('sys.login.userNameInvalid'),
            },
          ]}
        >
          <Input autoFocus placeholder={t('sys.login.userName')} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('sys.login.emaildPlaceholder') },
            {
              type: 'email',
              message: t('sys.login.emailInvalid'),
            },
          ]}
        >
          <Input placeholder={t('sys.login.email')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('sys.login.passwordPlaceholder') },
            {
              min: 8,
              message: t('sys.login.passwordValidMinLength'),
            },
          ]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: t('sys.login.confirmPasswordPlaceholder') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('sys.login.diffPwd')));
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder={t('sys.login.confirmPassword')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t('sys.login.registerButton')}
          </Button>
        </Form.Item>

        <div className="mb-2 text-xs text-gray">
          <span>{t('sys.login.registerAndAgree')}</span>
          <a href="./" className="text-sm !underline">
            {t('sys.login.termsOfService')}
          </a>
          {' & '}
          <a href="./" className="text-sm !underline">
            {t('sys.login.privacyPolicy')}
          </a>
        </div>

        <ReturnButton onClick={backToLogin} />
      </Form>
    </>
  );
}

export default RegisterForm;
