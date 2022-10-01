import { Form, useNotification, Button, NFTBalance } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function ListNFT() {
    const router = useRouter()
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].nftMarketplace[0]
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const address = String(account)

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (trx) => handleApproveSuccess(trx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(trx, nftAddress, tokenId, price) {
        await trx.wait(1)
        console.log("Ok! Now time to list")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: (trx) => handleListSuccess(trx),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess(trx) {
        await trx.wait(1)
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
        router.push("/")
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div>
                {isWeb3Enabled ? (
                    <div>
                        <Form
                            buttonConfig={{
                                onClick: approveAndList,
                                theme: "primary",
                                text: "List my NFT",
                                loadingText: "Listing...",
                            }}
                            data={[
                                {
                                    name: "NFT Address",
                                    type: "text",
                                    inputWidth: "50%",
                                    value: "",
                                    key: "nftAddress",
                                },
                                {
                                    name: "Token ID",
                                    type: "number",
                                    value: "",
                                    key: "tokenId",
                                },
                                {
                                    name: "Price (in ETH)",
                                    type: "number",
                                    value: "",
                                    key: "price",
                                },
                            ]}
                            title="List your NFT!"
                            onSubmit={approveAndList}
                        />
                    </div>
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
