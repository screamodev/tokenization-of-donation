import { FC } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { CreateCampaignForm } from '../../components/CreateCampaignForm/CreateCampaignForm';

export const HomePage: FC = () => (
  <PageLayout>
    <CreateCampaignForm />
  </PageLayout>
);
