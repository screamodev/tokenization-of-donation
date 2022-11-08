import React, { FC } from 'react';
import './nftRewardItem.scss';

interface NftRewardItemProps {
    name: string;
    image: string;
    description: string;
}

export const NftRewardItem: FC<NftRewardItemProps> = ({
  name,
  image,
  description,
}) => (
  <div className="nft-reward-item">
    <div className="nft-reward-item-image">
      <img className="" src={image} alt="nft" />
    </div>
    <div className="nft-reward-item-text">
      <p className="nft-reward-item-text-name">{name}</p>
      <p className="nft-reward-item-text-description">{description}</p>
    </div>
  </div>
);
