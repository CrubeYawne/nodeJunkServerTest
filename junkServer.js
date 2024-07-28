import http from 'http';
import path from 'path';
import fs from 'fs';

const METHOD_ALL = "ALL";
const METHOD_GET = "GET";
const METHOD_POST = "POST";

export default class junkServer
{
    constructor({port = 9000} = {})
    {
        this.port = port;
        this.server = http.createServer( async (req, res) => { this.processRequest(req, res) } );
        
        // Have the server listen on port 9000
        this.server.listen(this.port, () => { this.listenCallback() } );

        this.routes = [
            { path : "/debug", method: METHOD_ALL, callback: this.debugCallback }
        ];

        this.static = [];
    }
    destroy()
    {
        if(this.server)
        {
            this.server.close( () =>
            {
                console.log("Closing server");
            });
        }
    }

    async debugCallback(req, res)
    {
        res.writeHead(200);
        res.end("debug page");
    }

    listenCallback()
    {        
        console.log(`Server running on port: ${this.port}`);
    }

    staticRoute(folder)
    {
        this.static.push( folder );
    }

    all(path, callback_fn)
    {
        this.routes.push( { path: path, method : METHOD_ALL, callback : callback_fn } );
    }

    get(path, callback_fn)
    {
        this.routes.push( { path: path, method : METHOD_GET, callback : callback_fn } );
    }

    post(path, callback_fn)
    {
        this.routes.push( { path: path, method : METHOD_POST, callback : callback_fn } );
    }
    
    async processRequest(req,res)
    {
        let foundRoute = false;

        if(req.url == '/favicon.ico')
        {
            res.end();
            return;
        }

        let firstFolder = path.dirname(req.url);

        let foundStatic = false;

        for(let j=0; !foundStatic && j != this.static.length; ++j)
        {
            const staticItem = this.static[j];

            if(staticItem == firstFolder)
            {
                try
                {
                    let fileData = fs.readFileSync( `.${req.url}` );
                    res.writeHead(200);
                    res.end(fileData);
                }
                catch(e)
                {
                    console.log(e);
                    res.writeHead(500);
                    res.end("File not found");
                }
                foundStatic = true;
            }
        }
        
        if(foundStatic)
            return;

        for(let i=0; !foundRoute && i != this.routes.length; i++)
        {

            const item = this.routes[i];

            if(item.method != req.method && item.method !== METHOD_ALL)
                continue;

            if(item.path === req.url)
            {
                item.callback(req, res );
                foundRoute = true;
            }
        };

        if(!foundRoute)
        {
            res.writeHead(500);
            res.end("ERROR");
        }
    }
}