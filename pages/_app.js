import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import "../styles/globals.css"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL_GOERLI_ENDPOINT,
})

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>NFT marketplace</title>
                <meta name="description" content="NFT marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp
