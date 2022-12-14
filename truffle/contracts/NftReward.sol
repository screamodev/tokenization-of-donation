//SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Campaign.sol";

contract NftReward is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => bool) public isUserHaveNft;
    uint constant public NFT_PRICE = 1 ether / 1000;
    string public baseUrl;

    constructor(string memory _tokenName, string memory _tokenSymbol, string memory _baseUrl) ERC721(_tokenName, _tokenSymbol) {
        baseUrl = _baseUrl;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUrl;
    }

    function safeMint(address to, string memory uri) public {
        require(!isUserHaveNft[to], "You can't own more than one token");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        isUserHaveNft[to] = true;
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
        return isUserHaveNft[userAddress];
    }
}
