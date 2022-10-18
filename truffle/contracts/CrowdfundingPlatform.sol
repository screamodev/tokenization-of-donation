//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Campaign.sol";

contract CrowdfundingPlatform {
    struct CrowdfundingCampaign {
        Campaign targetContract;
        bool claimed;
    }
    mapping(uint => CrowdfundingCampaign) public campaigns;
    uint private currentCampaignIndex;
    address public owner;
    uint constant CAMPAIGN_DURATION = 30 days;

    event CampaignStarted(uint id, uint endsAt, uint goal, address organizer);

    function start(uint _goal, uint _endsAt) external {

        require(_goal > 0, "You must define goal of your campaign.");
        require(
            _endsAt <= block.timestamp + CAMPAIGN_DURATION &&
            _endsAt > block.timestamp
        );

        currentCampaignIndex = currentCampaignIndex + 1;

        Campaign newCampaign = new Campaign(currentCampaignIndex, _endsAt, _goal, msg.sender);
        campaigns[currentCampaignIndex] = CrowdfundingCampaign({
        targetContract: newCampaign,
        claimed: false
        });

        emit CampaignStarted(currentCampaignIndex, _endsAt, _goal, msg.sender);
    }

    function onClaimed(uint id) external {
        CrowdfundingCampaign storage targetCampaign = campaigns[id];

        // make sure that contract which call this function is legal
        require(msg.sender == address(targetCampaign.targetContract));

        targetCampaign.claimed = true;
    }

}
