import React, { useState } from "react"
import { Modal, Input, useNotification, Loading } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import { ethers } from "ethers"
import truncateStr from "../utils/truncateStr"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    imageURI,
    tokenName,
    tokenDescription,
}) {
    const dispatch = useNotification()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    const [updating, setUpdating] = useState(false)

    const handleUpdateListingSuccess = async (trx) => {
        await trx.wait(1)
        setUpdating(false)
        onClose && onClose()
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal
            okText="Change"
            width="20vw"
            title={`Changing price of NFT ${tokenId} from collection ${truncateStr(
                nftAddress,
                10
            )}`}
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                setUpdating(true)
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            {updating ? (
                <div>
                    <Loading spinnerColor="#2E7DAF" text="Loading...." />
                </div>
            ) : (
                <div className="pb-1.5">
                    <Input
                        label="Update listing price in L1 Currency (ETH)"
                        name="New listing price"
                        type="number"
                        onChange={(event) => {
                            setPriceToUpdateListingWith(event.target.value)
                        }}
                    />
                </div>
            )}
        </Modal>
    )
}
