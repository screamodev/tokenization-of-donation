//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Campaign.sol";

contract NftReward is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct userToken {
        bool isUserHaveNft;
        uint tokenId;
    }

    mapping(address => userToken) public usersTokens;
    uint constant public NFT_PRICE = 1 ether / 1000;

    constructor(string memory tokenName, string memory tokenSymbol) ERC721(tokenName, tokenSymbol) {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }

    function safeMint(address to, string memory uri) public {
        require(!usersTokens[to].isUserHaveNft, "Sorry, you can't own more than one token");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        usersTokens[to].isUserHaveNft = true;
        usersTokens[to].tokenId = tokenId;

    }

    function burn(address user, uint tokenId) external {
        _burn(tokenId);

        delete usersTokens[user];
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getIsUserHaveNft(address userAddress) view external returns (bool) {
        return usersTokens[userAddress].isUserHaveNft;
    }

    function getUserTokenId(address userAddress) view external returns (uint) {
        return usersTokens[userAddress].tokenId;
    }
}
