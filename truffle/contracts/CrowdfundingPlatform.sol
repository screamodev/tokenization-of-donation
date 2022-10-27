//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Campaign.sol";

contract CrowdfundingPlatform {
    struct CrowdfundingCampaign {
        Campaign targetContract;
        bool claimed;
    }
    mapping(uint => CrowdfundingCampaign) public campaigns;
    uint public campaignsCount = 0;
    address public owner;

    uint constant CAMPAIGN_DURATION_SIXTY = 60 days;

    event CampaignStarted(uint id, Campaign newCampaignAddress, uint endsAt, uint goal, address organizer);

    function startCampaign(string memory _title, string memory _description, uint _goal, uint _endsAt) external {

        // require(bytes(title).length > 0 && bytes(description).length > 0);
        require( _endsAt > block.timestamp);
        require(_endsAt <= block.timestamp + CAMPAIGN_DURATION_SIXTY);
        require(_goal > 0, "You must define goal of your campaign.");

        campaignsCount = campaignsCount + 1;

        Campaign newCampaign = new Campaign(campaignsCount, _title, _description, _endsAt, _goal, msg.sender);

        campaigns[campaignsCount] = CrowdfundingCampaign({
        targetContract: newCampaign,
        claimed: false
        });

        emit CampaignStarted(campaignsCount, newCampaign, _endsAt, _goal, msg.sender);
    }

    function onClaimed(uint id) external {
        CrowdfundingCampaign storage targetCampaign = campaigns[id];

        // make sure that contract which call this function is legal
        require(msg.sender == address(targetCampaign.targetContract));

        targetCampaign.claimed = true;
    }
}
