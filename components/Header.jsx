import Link from "next/link"
import React from "react"
import { ConnectButton, CryptoLogos, ENSAvatar } from "web3uikit"
import { useRouter } from "next/router"

export default function Header() {
    const router = useRouter()
    const currentRoute = router.pathname
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center">
                <CryptoLogos chain="ethereum" onClick={function noRefCheck() {}} size="48px" />
                <Link href="/">
                    <h1 className="py-4 px-4 font-bold text-3xl hover:cursor-pointer">
                        NFT marketplace
                    </h1>
                </Link>
            </div>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a
                        className={`mr-4 py-2 px-6 rounded-full  ${
                            currentRoute == "/" ? "bg-indigo-100" : "bg-none"
                        }`}
                    >
                        Home
                    </a>
                </Link>
                <Link href="/sell-nft">
                    <a
                        className={`mr-4 py-2 px-6 rounded-full ${
                            currentRoute == "/sell-nft" ? "bg-indigo-100" : "bg-none"
                        }`}
                    >
                        List NFT
                    </a>
                </Link>
                <Link href="/my-nfts">
                    <a
                        className={`mr-4 py-2 px-6 rounded-full ${
                            currentRoute == "/sell-nft" ? "bg-indigo-100" : "bg-none"
                        }`}
                    >
                        My NFTs
                    </a>
                </Link>
                <Link href="/withdraw-proceeds">
                    <a
                        className={`mr-4 py-2 px-6 rounded-full ${
                            currentRoute == "/withdraw-proceeds" ? "bg-indigo-100" : "bg-none"
                        }`}
                    >
                        My proceeds
                    </a>
                </Link>
                <ENSAvatar address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" size={40} />
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
