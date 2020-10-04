import https from 'https'
import ora from 'ora'


export function apiCall(page) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/popular?page=${page}&api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    //START REQUEST
    const spinner = ora('Loading popular').start()
    https.request( options, (res) => {
      
        let response = "";
        res.on('data', (d) => {
            //process.stdout.write(d);
            response += d 
        });
        res.on('end', (d) => { 
            let json = JSON.parse(response)
            spinner.succeed("Popular loaded");
            return json;  
            
        });

    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
    //END REQUEST
}

//export default apiCall
