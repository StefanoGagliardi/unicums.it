// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";

// https://docs.openzeppelin.com/contracts/2.x/api/token/erc721
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

// Questo contratto estende ERC721URIStorage è astratto con dei metodi da implementare
// https://ethereum.stackexchange.com/questions/16318/solidity-inherited-constructors-and-calling-the-parent-constructor/92151
contract NFT is ERC721URIStorage {

    // @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
    // of elements in a mapping, issuing ERC721 ids, or counting request ids.
    using Counters for Counters.Counter;


    Counters.Counter private _tokenIds;

    // è una variabile della classe
    // Address 0x (160 bits or 40 hex characters).
    address contractAddress;

    // Al costruttore passo l'address del marketplacde anche se nonho capito bene 
    constructor(address marketplaceAddress) ERC721("Unicums", "UNICUMS") {

        // Associo la variabile classico opp
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);

        _setTokenURI(newItemId, tokenURI);
        
        setApprovalForAll(contractAddress, true);
        
        return newItemId;
    }
}