/**
 * According with Smart contact NFTmarketplace.sol
 * struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
 */
type Address = string;
export type MarketItem = {
  itemId: number;
  nftContract: Address;
  tokenId: number;
  seller: string;
  owner: string;
  price: number;
  sold: boolean;
}