const express = require("express");
const http = require('follow-redirects').http;
const app  = express();
const port = 80;

const isLocalhost = function (url) {
    try{
        u = new URL(url);
        if(u.hostname.includes('localhost')
        || u.hostname.includes('127.0.0.1')
        ){
            return true;
        }
    }catch{}
    return false;
}
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.post("/request", (req, res) => {
    let url = req.body.url;
    let options = {
        'followRedirects':false
    }
    if(req.body?.url){
        if(isLocalhost(req.body.url)){
            res.send('Localhost is restricted.');
            return;
        };
        http.get(url, options, (response) => {
            let data = '';
            response.on('data', chunk => {
                data += chunk.toString();
            });
            response.on('end', () => {
                res.send(data);
            })
        }).on('error', (e) => {
            console.log(e);
            res.status(500).send('Server Error');
        })
    }else{
        res.send('URL is required.');
    }
})

app.get("/admin", (req, res) => {
    if(req.socket.remoteAddress.includes('127.0.0.1')){
        res.send('Admin Page');
    }else{
        res.status(404).send('Not Found');
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})