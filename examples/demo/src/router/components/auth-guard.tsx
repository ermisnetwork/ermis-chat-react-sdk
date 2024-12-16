import { useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import PageError from '@/pages/sys/error/PageError';
import { useUserToken } from '@/store/userStore';

import { useRouter } from '../hooks';

import { Paths } from '#/enum';

type Props = {
  children: React.ReactNode;
};
export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { accessToken } = useUserToken();

  const check = useCallback(() => {
    if (!accessToken) {
      router.replace(Paths.Login);
    }
  }, [router, accessToken]);

  useEffect(() => {
    check();
  }, [check]);

  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
}
