const http = require('https');
const fs = require('fs');
const url = require('url');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

console.log('Server will listen at :  https://localhost ');
http.createServer(options, function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    });
    let json_response;

    console.log(url.parse(req.url,true).pathname);
    if (url.parse(req.url,true).pathname == "/config") {
        json_response = {
            baseUrl: "https://localhost.adobe.io:9090/",
            apiKey: "apiKey",
            auth: {
                schema: "Bearer",
                imsToken: "dummyToken"
            },
            imsOrg: "imsOrg",
            version: 1,
            service: "commerce",
            extensionPoint: "backend-ui"
        }
    } else {
        json_response = [{
            "name": "test-extension",
            "title": "Test extension",
            "description": "No",
            "icon": "no",
            "publisher": "aQQ6300000008LEGAY",
            "endpoints": {
                "commerce/backend-ui/1": {
                    "view": [{
                        "href": "https://localhost:9080/index.html"
                    }]
                }
            },
            "xrInfo": {
                "supportEmail": "test@adobe.com",
                "appId": "4a4c7cf8-bd64-4649-b8ed-662cd0d9c918"
            },
            "status": "PUBLISHED" }]
    }
    //console.log(json_response);
    res.end( JSON.stringify(json_response) );
}).listen(9090);
