import { FC } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { Campaign } from '../../interfaces/interface';
import { CampaignElement } from './CampaignElement/CampaignElement';
import './campaigns.scss';

export const Campaigns: FC = () => {
  const { state: { campaigns } } = useEth();

  return (
    <>
      {!campaigns.length
        ? (<span>Loading...</span>)
        : (
          <div className="campaigns-container">
            {campaigns.map(({
              id,
              title,
              description,
              goal,
              alreadyDonated,
              endsAt,
            }: Campaign) => (
              <CampaignElement
                key={id}
                title={title}
                description={description}
                goal={+goal}
                alreadyDonated={+alreadyDonated}
                endsAt={+endsAt}
              />
            ))}
          </div>
        )}
    </>
  );
};
