import clsx from 'clsx';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { FocusScope } from '@react-aria/focus';

import { CloseIconRound } from './icons';

import { useChatContext, useTranslationContext } from '../../context';

export type ModalProps = {
  /** If true, modal is opened or visible. */
  open: boolean;
  /** Custom class to be applied to the modal root div */
  className?: string;
  /** Callback handler for closing of modal. */
  onClose?: (
    event: React.KeyboardEvent | React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => void;
};

export const Modal = ({ children, className, onClose, open }: PropsWithChildren<ModalProps>) => {
  const { t } = useTranslationContext('Modal');
  const { themeVersion } = useChatContext('Modal');

  const innerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    const target = event.target as HTMLButtonElement | HTMLDivElement;
    if (!innerRef.current || !closeRef.current) return;

    if (!innerRef.current.contains(target) || closeRef.current.contains(target)) onClose?.(event);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.((event as unknown) as React.KeyboardEvent);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className={clsx('str-chat__modal str-chat__modal--open', className)} onClick={handleClick}>
      <FocusScope autoFocus contain>
        <button className='str-chat__modal__close-button' ref={closeRef} title={t<string>('Close')}>
          {themeVersion === '2' && <CloseIconRound />}

          {themeVersion === '1' && (
            <>
              {t<string>('Close')}
              <svg height='10' width='10' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.916 1.027L8.973.084 5 4.058 1.027.084l-.943.943L4.058 5 .084 8.973l.943.943L5 5.942l3.973 3.974.943-.943L5.942 5z'
                  fillRule='evenodd'
                />
              </svg>
            </>
          )}
        </button>
        <div className='str-chat__modal__inner str-chat-react__modal__inner' ref={innerRef}>
          {children}
        </div>
      </FocusScope>
    </div>
  );
};
