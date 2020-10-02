import https from 'https'


export function apiCall(page) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/popular?page=${page}&api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    //START REQUEST
    https.request( options, (res) => {
        let response = "";
        res.on('data', (d) => {
            //process.stdout.write(d);
            response += d
        });
        res.on('end', (d) => {
            let json = JSON.parse(response)
            console.log(json)
            return json;
        });
    })
    .on('error', (e) => {
        console.error(e);
        return e;
    })
    .end();
    //END REQUEST
}
