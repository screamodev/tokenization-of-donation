import React, { FC, useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { actions } from '../../contexts/EthContext';
import { filterNftInstance } from '../../contexts/EthContext/helpers/helpers';
import { NFT_PRICE } from '../../constants/constansts';
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
      nftRewardAbi,
      userNftAddresses,
      userAccount,
    }, dispatch,
  } = useEth();

  const [donationAmount, setDonationAmount] = useState('');
  const [isDonateClicked, setIsDonateClicked] = useState(false);

  const handleChangeDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setDonationAmount(e.target.value);
  };

  const handleClickDonate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDonateClicked(true);
  };

  const handleSendDonation = async (value: number) => {
    const valueInWei = web3.utils.toWei(`${value}`, 'ether');

    await donate().send({ from: userAccount, value: valueInWei })
      .then(async ({ events: { Donated: { returnValues: { amount, nftReward } } } }: any) => {
        const donatedAmount = +web3.utils.fromWei(amount, 'ether');
        const fixedAmount = +donatedAmount.toFixed(3);

        dispatch({
          type: actions.donateFunds,
          data: { id, donatedAmount: fixedAmount },
        });

        if (+valueInWei >= NFT_PRICE && !userNftAddresses.includes(nftReward)) {
          const nft = await filterNftInstance(web3, nftRewardAbi, nftReward);
          dispatch({
            type: actions.addNft,
            data: { nft, nftReward },
          });
        }
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
            onClick={(e) => e.stopPropagation()}
            onChange={handleChangeDonate}
            value={donationAmount}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              return handleSendDonation(+donationAmount);
            }}
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
