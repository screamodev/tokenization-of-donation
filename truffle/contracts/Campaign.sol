//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./CrowdfundingPlatform.sol";

contract Campaign {
    uint public id;
    string public title;
    string public description;
    uint public endsAt;
    uint public goal;
    uint public alreadyDonated;
    address public organizer;
    CrowdfundingPlatform parentContract;
    bool public claimed;
    mapping(address => uint) public donations;

    event donated(uint amount, address donater);
    event refundedAmount(uint amount, address refunder);

    constructor(uint _id, string memory _title, string memory _description, uint _endsAt, uint _goal, address _organizer) {
        id = _id;
        title = _title;
        description = _description;
        endsAt = _endsAt;
        goal = _goal;
        organizer = _organizer;
        parentContract = CrowdfundingPlatform(msg.sender);
    }

    function donate() external payable {
        require(block.timestamp <= endsAt);
        require(msg.value > 0, "0 < value");

        alreadyDonated += msg.value;
        donations[msg.sender] += msg.value;

        emit donated(msg.value, msg.sender);
    }

    function refundDonation(uint _amount) external {
        require(block.timestamp <= endsAt);
        require(_amount <= donations[msg.sender]);

        donations[msg.sender] -= _amount;
        alreadyDonated -= _amount;

        payable(msg.sender).transfer(_amount);

        emit refundedAmount(_amount, msg.sender);
    }

    function claim() external {
        // require(block.timestamp > endsAt);
        require(msg.sender == organizer);
        require(alreadyDonated >= goal);
        require(!claimed);

        claimed = true;

        payable(organizer).transfer(alreadyDonated);

        parentContract.onClaimed(id);
    }
}
