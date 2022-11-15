//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./CrowdfundingPlatform.sol";
import "./NftReward.sol";

contract Campaign {
    uint public id;
    string public title;
    string public description;
    uint public endsAt;
    uint public goal;
    uint public alreadyDonated;
    address public organizer;
    CrowdfundingPlatform parentContract;
    NftReward nftReward;
    string nftMetaCID;
    bool public claimed;
    mapping(address => uint) public donations;

    event Donated(uint amount, address donater, NftReward nftReward);
    event RefundedAmount(uint amount, address refunder);

    constructor(
        uint _id,
        string memory _title,
        string memory _description,
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _CID,
        string memory _baseUrl,
        uint _endsAt,
        uint _goal,
        address _organizer
    ) {
        id = _id;
        title = _title;
        description = _description;
        endsAt = _endsAt;
        nftMetaCID = _CID;
        goal = _goal;
        organizer = _organizer;
        parentContract = CrowdfundingPlatform(msg.sender);
        nftReward = new NftReward(_tokenName, _tokenSymbol, _baseUrl);
    }

    function donate() external payable {
        require(block.timestamp <= endsAt, "Campaign already has over.");
        require(msg.value > 0, "You can't donate 0.");

        alreadyDonated += msg.value;
        donations[msg.sender] += msg.value;

        if (!nftReward.getIsUserHaveNft(msg.sender) && msg.value >= nftReward.NFT_PRICE()) {
            nftReward.safeMint(msg.sender, nftMetaCID);
            parentContract.setDonaterNft(msg.sender, nftReward);
        }

        emit Donated(msg.value, msg.sender, nftReward);
    }

    function refundDonation(uint _amount) external {
        require(block.timestamp <= endsAt, "Campaign already has over.");
        require(_amount <= donations[msg.sender], "you cant refund more than you gave.");

        donations[msg.sender] -= _amount;
        alreadyDonated -= _amount;

        payable(msg.sender).transfer(_amount);

        emit RefundedAmount(_amount, msg.sender);
    }

    function claim() external {
        require(msg.sender == organizer, "You are not the organizer.");
        require(alreadyDonated >= goal, "Not enough funds.");
        require(!claimed, "Campaign already has claimed.");

        claimed = true;

        payable(organizer).transfer(alreadyDonated);

        parentContract.onClaimed(id);
    }
}
