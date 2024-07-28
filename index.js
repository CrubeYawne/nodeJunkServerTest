// Import the HTTP module
import junkServer from './junkServer.js';


const port = 9000;

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


process.on('SIGTERM', () => { myServer.destroy() } );
