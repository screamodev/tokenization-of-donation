import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { convertSecondsToDays } from '../../../utils/utils';
import { DonateButton } from '../../DonateButton/DonateButton';
import './campaignElement.scss';

interface CampaignElementProps {
    id: number;
    title: string;
    description: string;
    goal: number;
    alreadyDonated: number
    endsAt: number;
    donate: () => any;
}

export const CampaignElement: FC<CampaignElementProps> = ({
  id,
  title,
  description,
  goal,
  alreadyDonated,
  endsAt,
  donate,
}) => {
  const navigate = useNavigate();

  const navigateToCampaignPage = () => navigate(`/campaign/${id}`);

  return (
    <div
      onClick={navigateToCampaignPage}
      className="campaigns-element-item"
    >
      <div className="campaigns-element-item-image">some image</div>
      <div className="campaigns-element-item-content">
        <div className="campaigns-element-item-content-text">
          <h2 className="campaigns-element-item-content-text-title">{title}</h2>
          <p className="campaigns-element-item-content-text-description">{description}</p>
        </div>
        <div className="campaigns-element-item-content-details">
          <div className="campaigns-element-item-content-details-goal">
            <h3 className="font-bold">{`Goal is: ${goal} ETH`}</h3>
            <ProgressBar
              goal={goal}
              alreadyDonated={+alreadyDonated.toFixed(3)}
            />
          </div>
          <p className="campaigns-element-item-content-details-endsAt">{`${convertSecondsToDays(+endsAt)} days left`}</p>
        </div>
      </div>
      <DonateButton id={id} donate={donate} />
    </div>
  );
};
