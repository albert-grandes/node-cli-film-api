#!/usr/bin/env node
import {apiCall} from './functions.js'
import program from 'commander'
import dotenv from 'dotenv'



dotenv.config()
//console.log('weird duck')

//program.option('-t, --test', 'only is a test')

console.log(process.env.API_KEY)

 
 
//const spinner = ora('Loading unicorns').start();

program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    apiCall(options.page)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5