#!/usr/bin/env node
//import apiCall from "./clearfunctions";

const call = require('./functions');

require('dotenv').config()


const { program } = require('commander');
const https = require('https'); //https://nodejs.org/api/https.html 
//program.option('-t, --test', 'only is a test')


console.log(process.env.API_KEY)
program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    call.apiCall(options.page)
  })

program.parse(process.argv)


