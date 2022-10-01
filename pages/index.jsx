import { useMoralis } from "react-moralis"
import GET_ACTIVE_ITEMS from "../constants/SubgraphQueries"
import { useQuery } from "@apollo/client"
import NFTBox from "../components/NFTBox"
import { useState } from "react"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently listed</h1>
            <div className="flex flex-wrap ">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <div key={`${nftAddress}${tokenId}`} className="mx-2 my-2">
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        seller={seller}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
