import React, { useState } from "react"
import { Modal, useNotification, Loading } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import { ethers } from "ethers"
import truncateStr from "../utils/truncateStr"

export default function BuyModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    price,
    imageURI,
    tokenName,
    tokenDescription,
}) {
    const dispatch = useNotification()

    const [updating, setUpdating] = useState(false)

    function handleBuyItem() {
        setUpdating(true)
        buyItem({
            onError: (error) => {
                console.log(error)
            },
            onSuccess: handleBuyItemSuccess,
        })
    }

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const handleBuyItemSuccess = async (trx) => {
        await trx.wait(1)
        setUpdating(false)
        onClose && onClose()
        dispatch({
            type: "success",
            title: "Item Bought",
            position: "topR",
        })
        setChanged((prev) => !prev)
    }

    return (
        <Modal
            okText="Buy"
            title={`You may buy this NFT #${tokenId} from collection ${truncateStr(
                nftAddress,
                10
            )} for ${ethers.utils.formatUnits(price, "ether")} ETH`}
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={handleBuyItem}
            width="20vw"
        >
            {updating && <Loading spinnerColor="#2E7DAF" text="Loading...." />}
        </Modal>
    )
}
