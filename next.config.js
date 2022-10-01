/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            "ipfs.io",
            "bafkreibfkec3ybuwxirrym2pkmn3nlrq6ng4a7zbyiegs26pw2pkl3ehxy.ipfs.nftstorage",
        ],
    },
}

module.exports = nextConfig
