
if (process.env.NEXTAUTH_URL) {
    process.env.BASE_URL = process.env.NEXTAUTH_URL.replace('/api/auth', '');
}

if (process.env.BASE_URL) {
    process.env.NEXTAUTH_URL = process.env.BASE_URL + '/api/auth';
}

module.exports = {
    basePath: '',
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: '*' },
                    { key: 'Access-Control-Allow-Headers', value: '*' },
                ],
            },
        ];
    }
};