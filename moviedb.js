#!/usr/bin/env node

//console.log('weird duck')

const { program } = require('commander');
const https = require('https'); //https://nodejs.org/api/https.html 
//program.option('-t, --test', 'only is a test')

require('dotenv').config()
console.log(process.env.API_KEY)
program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    apiCall(options.page)
  })

program.parse(process.argv)

//if(program.test) console.log("The program is running")
function apiCall(page) {
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

