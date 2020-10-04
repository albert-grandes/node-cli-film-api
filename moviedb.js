#!/usr/bin/env node
import {apiCallPopular} from './personsFunctions.js'
import program from 'commander'
import dotenv from 'dotenv'



dotenv.config()

program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    apiCallPopular(options.page)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5