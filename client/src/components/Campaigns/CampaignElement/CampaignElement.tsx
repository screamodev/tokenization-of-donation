import React, { FC, useState } from 'react';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { convertSecondsToDays } from '../../../utils/utils';
import useEth from '../../../contexts/EthContext/useEth';
import { actions } from '../../../contexts/EthContext';
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
  const {
    state: {
      web3,
      userAccount,
    }, dispatch,
  } = useEth();

  const [donationAmount, setDonationAmount] = useState('');
  const [isDonateClicked, setIsDonateClicked] = useState(false);

  const handleChangeDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonationAmount(e.target.value);
  };

  const handleClickDonate = () => {
    setIsDonateClicked(true);
  };

  const handleSendDonation = async (value: number) => {
    await donate().send({ from: userAccount, value: web3.utils.toWei(`${value}`, 'ether') })
      .then(({ events: { donated: { returnValues } } }: any) => {
        const donatedAmount = +web3.utils.fromWei(returnValues[0], 'ether');
        const fixedAmount = +donatedAmount.toFixed(3);

        dispatch({
          type: actions.donateFunds,
          data: { id, donatedAmount: fixedAmount },
        });
      });
  };

  return (
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
              alreadyDonated={+alreadyDonated.toFixed(3)}
            />
          </div>
          <p className="campaigns-element-item-content-details-endsAt">{`${convertSecondsToDays(+endsAt)} days left`}</p>
        </div>
      </div>
      {!isDonateClicked ? (
        <button
          className="campaigns-element-item-donate-button"
          onClick={handleClickDonate}
          type="button"
        >
          Donate
        </button>
      ) : (
        <div className="campaigns-element-item-donate-funds">
          <input
            placeholder="Enter ETH amount"
            className="campaigns-element-item-donate-funds-input"
            type="number"
            onChange={handleChangeDonate}
            value={donationAmount}
          />
          <button
            onClick={() => handleSendDonation(+donationAmount)}
            className="campaigns-element-item-donate-funds-button"
            type="button"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};
