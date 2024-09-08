// Import the HTTP module
import junkServer from './nodeJunkServer/junkServer.js';

import { port } from './config/config.js';

import { lastcommit } from './lastcommit.js';

const myServer = new junkServer({ port });

myServer.staticRoute("/static");

myServer.all("/", (req,res) => {

    res.end("Home");
});

myServer.all("/test", (req,res) => {

    res.end("woot");
});

myServer.all("/json", async (req,res) => {

    res.end(JSON.stringify({test : 'one1', test2 : 2 }));
});

myServer.all('/lastcommit', async(req, res) => {
    res.end(`Last Commit: ${lastcommit}`);
});

process.on('SIGTERM', () => { myServer.destroy() } );
