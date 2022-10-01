import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card } from "web3uikit"
import React from "react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import nftAbi from "../constants/BasicNft.json"
import truncateStr from "../utils/truncateStr"
import { useDispatch } from "react-redux"
import { setCurrentNFT } from "../redux/slices/nftSlice"

export default function NFTBox({ price, nftAddress, tokenId, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()

        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI =
                tokenURIResponse.image ||
                "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png"
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name || "No info")
            setTokenDescription(tokenURIResponse.description || "No info")
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }

    const handleCardClick = () => {
        //isOwnedByUser ? setShowModalChangePrice(true) : setShowModalBuy(true)
        dispatch(
            setCurrentNFT({
                price,
                nftAddress,
                tokenId,
                imageURI,
                tokenName,
                tokenDescription,
                seller,
            })
        )
        router.push(`/${nftAddress}/${tokenId}`)
    }

    return (
        <div>
            {imageURI ? (
                <div>
                    <Card
                        title={tokenName}
                        description={tokenDescription}
                        onClick={handleCardClick}
                    >
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">
                                    Owned by {formattedSellerAddress}
                                </div>
                                <Image src={imageURI} height={200} width={200} alt="NFT" />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : null}
        </div>
    )
}
