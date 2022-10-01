import React, { useState } from "react"
import UpdateListingModal from "../../components/UpdateListingModal"
import BuyModal from "../../components/BuyModal"
import networkMapping from "../../constants/networkMapping.json"
import { useMoralis } from "react-moralis"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentNFT } from "../../redux/slices/nftSlice"
import { Button, Card } from "web3uikit"
import truncateStr from "../../utils/truncateStr"
import Image from "next/image"
import { ethers } from "ethers"

export default function TokenPage() {
    const { chainId, account } = useMoralis()
    const { price, nftAddress, tokenId, imageURI, tokenName, tokenDescription, seller } =
        useSelector((state) => state.nfts.currentNFT)

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const [showModalChangePrice, setShowModalChangePrice] = useState(false)
    const [showModalBuy, setShowModalBuy] = useState(false)
    const [updating, setUpdating] = useState(false)

    const hideModalChangePrice = () => setShowModalChangePrice(false)
    const hideModalBuy = () => setShowModalBuy(false)

    const chainString = chainId ? parseInt(chainId).toString() : "31337" //before was 0x234
    const marketplaceAddress = networkMapping[chainString].nftMarketplace[0]

    const handleCardClick = () => {
        isOwnedByUser ? setShowModalChangePrice(true) : setShowModalBuy(true)
    }

    return (
        <>
            <Card title={tokenName} description={tokenDescription} onClick={() => null}>
                <div className="p-2 w-full h-screen">
                    <div className="flex justify-center items-start gap-2">
                        <Image src={imageURI} height={200} width={200} alt="NFT" />
                        <div>
                            <div className="italic text-md">Owned by {formattedSellerAddress}</div>
                            <div className="font-bold">
                                {ethers.utils.formatUnits(price, "ether")} ETH
                            </div>
                            #{tokenId}
                            {
                                <Button
                                    onClick={handleCardClick}
                                    text={isOwnedByUser ? "Change price" : "Buy"}
                                    type="button"
                                    theme="primary"
                                    isLoading={updating}
                                />
                            }
                        </div>
                    </div>
                </div>
            </Card>
            <UpdateListingModal
                isVisible={showModalChangePrice}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                imageURI={imageURI}
                tokenName={tokenName}
                tokenDescription={tokenDescription}
                onClose={hideModalChangePrice}
            />
            <BuyModal
                isVisible={showModalBuy}
                tokenId={tokenId}
                price={price}
                tokenName={tokenName}
                tokenDescription={tokenDescription}
                imageURI={imageURI}
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                onClose={hideModalBuy}
            />
        </>
    )
}
