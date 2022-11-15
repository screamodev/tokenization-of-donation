import { FC } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { HomePage } from '../../pages/HomePage/HomePage';
import { EthProvider } from '../../contexts/EthContext';
import { CreateCampaignPage } from '../../pages/CreateCampaignPage/CreateCampaignPage';
import { AboutPage } from '../../pages/AboutPage/AboutPage';
import { CampaignPage } from '../../pages/CampaignPage/CampaignPage';
import { MyNftRewardsPage } from '../../pages/MyNftRewardsPage/MyNftRewardsPage';
import { MyCampaignsPage } from '../../pages/MyCampaignsPage/MyCampaignsPage';

export const App: FC = () => (
  <EthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:id" element={<CampaignPage />} />
        <Route path="/create-campaign" element={<CreateCampaignPage />} />
        <Route path="/my-campaigns" element={<MyCampaignsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-rewards" element={<MyNftRewardsPage />} />
      </Routes>
    </BrowserRouter>
  </EthProvider>
);
