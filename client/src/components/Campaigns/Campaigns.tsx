import { FC } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { Campaign } from '../../interfaces/interface';
import { CampaignElement } from './CampaignElement/CampaignElement';
import './campaigns.scss';

export const Campaigns: FC = () => {
  const { state: { campaigns, isLoading, userAccount } } = useEth();

  return (
    <>
      {userAccount
        ? !isLoading
          ? !campaigns.length
            ? (<span>Campaigns are empty.</span>)
            : (
              <div className="campaigns-container">
                {campaigns.map(({
                  id,
                  title,
                  description,
                  goal,
                  alreadyDonated,
                  claimed,
                  endsAt,
                  donate,
                }: Campaign) => (
                  <CampaignElement
                    id={id}
                    key={id}
                    title={title}
                    description={description}
                    goal={goal}
                    alreadyDonated={alreadyDonated}
                    claimed={claimed}
                    endsAt={endsAt}
                    donate={donate}
                  />
                ))}
              </div>
            )
          : (<span>Loading...</span>)
        : (<span>You should login using metamask</span>)}
    </>
  );
};
