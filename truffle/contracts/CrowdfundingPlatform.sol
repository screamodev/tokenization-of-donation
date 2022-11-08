//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Campaign.sol";
import "./NftReward.sol";

contract CrowdfundingPlatform {
    struct CrowdfundingCampaign {
        Campaign targetContract;
        bool claimed;
    }

    mapping(uint => CrowdfundingCampaign) public campaigns;
    mapping(address => mapping(uint => NftReward)) public donatersNfts;
    mapping(address => uint) public usersNftCounts;
    uint public campaignsCount;
    address public owner;

    event CampaignStarted(uint id, Campaign newCampaignAddress, uint endsAt, uint goal, address organizer);

    function startCampaign(
        string memory _title,
        string memory _description,
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _CID,
        uint _goal,
        uint _endsAt
    ) external {
        require(_endsAt > block.timestamp, "Campaign duration can't be earlier than now.");
        require(_goal > 0, "You must define goal of your campaign.");

        campaignsCount = campaignsCount + 1;

        Campaign newCampaign = new Campaign(campaignsCount, _title, _description, _tokenName, _tokenSymbol, _CID, _endsAt, _goal, msg.sender);

        campaigns[campaignsCount] = CrowdfundingCampaign({
        targetContract: newCampaign,
        claimed: false
        });

        emit CampaignStarted(campaignsCount, newCampaign, _endsAt, _goal, msg.sender);
    }

    function onClaimed(uint id) external {
        CrowdfundingCampaign storage targetCampaign = campaigns[id];

        require(msg.sender == address(targetCampaign.targetContract), "It is not required campaign.");

        targetCampaign.claimed = true;
    }

    function setDonaterNft(address donater, NftReward nftAddress) external {
        donatersNfts[donater][usersNftCounts[donater] + 1] = nftAddress;

        usersNftCounts[donater] += 1;
    }
}
