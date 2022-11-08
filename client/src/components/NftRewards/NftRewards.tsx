import { FC } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { NftItem } from '../../interfaces/interface';
import { NftRewardItem } from './NftRewardItem/NftRewardItem';
import './nftRewards.scss';

export const NftRewards: FC = () => {
  const { state: { userNfts } } = useEth();

  return (
    <>
      {!userNfts.length
        ? (<span>Loading...</span>)
        : (
          <div className="rewards-container">
            {userNfts.map(({
              name,
              image,
              description,
            }: NftItem, index: number) => (
              <NftRewardItem
                name={name}
                image={image}
                description={description}
                key={index}
              />
            ))}
          </div>
        )}
    </>
  );
};
