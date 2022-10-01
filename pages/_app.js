import Head from "next/head"
import Header from "../components/Header"
import "../styles/globals.css"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { MoralisProvider } from "react-moralis"
import { wrapper } from "../redux/store"

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
            <MoralisProvider
                initializeOnMount={false}
                // appId={process.env.NEXT_PUBLIC_APP_ID}
                // serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
            >
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

export default wrapper.withRedux(MyApp)
