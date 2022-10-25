import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useEth from '../../contexts/EthContext/useEth';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { DonateButton } from '../DonateButton/DonateButton';
import { Campaign } from '../../interfaces/interface';
import { convertSecondsToDays } from '../../utils/utils';
import './campaignInfo.scss';

export const CampaignInfo: FC = () => {
  const { state: { campaigns } } = useEth();

  const { id: campaignId } = useParams();

  const [currentCampaign, setCurrentCampaign] = useState<Campaign>();

  const fetchPlaylistSongs = () => {
    const foundedCampaign = campaigns
      .filter((campaign: Campaign) => campaign.id === Number(campaignId));
    if (foundedCampaign.length) {
      setCurrentCampaign(foundedCampaign[0]);
    }
  };

  useEffect(() => {
    fetchPlaylistSongs();
  }, [campaigns]);

  return (
    <>
      {currentCampaign ? (
        <div className="campaign-info-container">
          <div className="campaign-info-container-content">
            <div className="campaign-info-container-content-title">
              <h1>{currentCampaign.title}</h1>
            </div>
            <div className="campaign-info-container-content-info">
              <div className="campaign-info-container-content-info-image">Image</div>
              <div className="campaign-info-container-content-info-details">
                <ProgressBar
                  goal={currentCampaign.goal}
                  alreadyDonated={currentCampaign.alreadyDonated}
                />
                <div className="campaign-info-container-content-info-details-amount">
                  {`${currentCampaign.alreadyDonated} ETH donated of ${currentCampaign?.goal} ETH goal`}
                </div>
                <div className="campaign-info-container-content-info-details-donaters">
                  Donaters count: qwerty
                </div>
                <div className="campaign-info-container-content-info-details-days">
                  {`${convertSecondsToDays(currentCampaign.endsAt)} days to go`}
                </div>
                <DonateButton
                  id={currentCampaign.id}
                  donate={currentCampaign.donate}
                />
              </div>
              <div className="campaign-info-container-content-info-description">
                {currentCampaign.description}
              </div>
            </div>
          </div>
        </div>
      ) : <div>Loading...</div> }
    </>
  );
};
