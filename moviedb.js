#!/usr/bin/env node
import {fetchPopular, fetchById} from './persons.js'
import program from 'commander'
import dotenv from 'dotenv'



dotenv.config()

program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('--id <number>', 'get person')
  .action((options) => {
    fetchById(options.id)
  })

  program
  .command('get-persons')
  .description('Make a network request to fetch person by id')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    fetchPopular(options.page)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5