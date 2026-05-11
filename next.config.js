/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    async redirects(){
        return [
            {
                source:"/",
                destination:"/login",
                permanent: false
            }
        ]
    }
};

module.exports = nextConfig;
