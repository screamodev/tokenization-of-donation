import React, { FC, useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { actions } from '../../contexts/EthContext';
import './donateButton.scss';

interface DonateButtonProps {
    id: number;
    donate: () => any;
}

export const DonateButton: FC<DonateButtonProps> = ({
  id,
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
    <>
      {!isDonateClicked ? (
        <button
          className="donate-button"
          onClick={handleClickDonate}
          type="button"
        >
          Donate
        </button>
      ) : (
        <div className="donate-funds">
          <input
            placeholder="Enter ETH amount"
            className="donate-funds-input"
            type="number"
            onChange={handleChangeDonate}
            value={donationAmount}
          />
          <button
            onClick={() => handleSendDonation(+donationAmount)}
            className="donate-funds-button"
            type="button"
          >
            Send
          </button>
        </div>
      )}
    </>
  );
};
