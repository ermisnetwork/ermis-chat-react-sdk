import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Empty, List, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleLayout from '@/layouts/simple';
import { useUserInfo } from '@/store/userStore';

export default function ClientsPage() {
  const { email } = useUserInfo();
  const { t } = useTranslation();

  return (
    <SimpleLayout>
      <Row justify="center">
        <Col span={8}>
          <Card
            title={
              <Typography.Title level={3} style={{ margin: 0, textAlign: 'center' }}>
                {t('common.selectYourClient')}
              </Typography.Title>
            }
          >
            gfdgsdf
          </Card>
        </Col>
      </Row>
    </SimpleLayout>
  );
}
