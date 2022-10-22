import { FC } from 'react';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { convertSecondsToDays } from '../../../utils/utils';
import './campaignElement.scss';

interface CampaignElementProps {
    title: string;
    description: string;
    goal: number;
    alreadyDonated: number
    endsAt: number;
}

export const CampaignElement: FC<CampaignElementProps> = ({
  title, description, goal, alreadyDonated, endsAt,
}) => (
  <div className="campaigns-element-item">
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
            alreadyDonated={+alreadyDonated}
          />
        </div>
        <p className="campaigns-element-item-content-details-endsAt">{`${convertSecondsToDays(+endsAt)} days left`}</p>
      </div>
    </div>
  </div>
);
