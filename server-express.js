require('marko/node-require').install();
require('marko/express');
require('path');

const compression = require('compression');
const express = require('express');
const path = require('path');

const indexTemplate = require('./src/index.marko');


const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8080;


// Configure lasso to control how JS/CSS/etc. is delivered to the browser
require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: path.join(__dirname, 'static'), // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

const app = express();

// Enable gzip compression for all HTTP responses
app.use(compression());

app.use(require('lasso/middleware').serveStatic());

app.get('/', (req, res) => {
    res.marko(indexTemplate, {});
});

app.listen(port, () => {
    console.log(
      `Server started! Try it out:
      http://localhost:${port}/`
    );

    if (process.send) {
        process.send('online');
    }
});
