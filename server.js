const express = require('express')
const next = require('next')
const dotenv = require('dotenv');

dotenv.config();

const dev = process.env.APP_ENV !== 'production' || true;
const quiet = process.env.APP_DEBUG || true;
const host = process.env.APP_HOST || '127.0.0.1';
const port = parseInt(process.env.APP_PORT, 10) || 3000;
const app = next({dev: dev, quiet: quiet, hostname: host, port: port});
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const exprServer = express();

    exprServer.use(express.json());
    exprServer.use(express.urlencoded({ extended: false }));
    exprServer.use('/api', require('./backend/routes/api.js'));
    exprServer.all('*', (req, res) => handle(req, res));

    exprServer.listen(port, () => {
        console.log(`> Ready on http://${host}:${port}`)
    });
})
