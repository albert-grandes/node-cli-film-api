const https = require('https');
const ora = require('ora');


function apiCall(page) {
  const spinner = ora('Loading unicorns').start();
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
          spinner.succeed("Finish project")
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

exports.apiCall = apiCall;

