// eslint-disable-next-line @typescript-eslint/no-var-requires
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    if (
        process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_IS_CYPRESS !== 'true'
    ) {
        app.use(
            '/ethglobal',
            createProxyMiddleware({
                target: 'https://ethglobal.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/ethglobal/?(.*)': '/$1',
                },
                secure: process.env.NODE_ENV !== 'development',
            }),
        );
    }
};
