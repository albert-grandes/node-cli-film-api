#!/usr/bin/env node
import {fetchPopularPersons, fetchPersonById} from './persons.js'
import {fetchMovies} from './movies.js'
import program from 'commander'
import dotenv from 'dotenv'

dotenv.config()

program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('--id <number>', 'get person')
  .action((options) => {
    fetchPersonById(options.id)
  })

  program
  .command('get-persons')
  .description('Make a network request to fetch person by id')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .action((options) => {
    fetchPopularPersons(options.page)
  })

  program
  .command('get-movies')
  .description('Make a network request to fetch movies')
  .requiredOption('--page <number>', 'get movies with page number')
  .option('-n --now', 'get movies which are out now')
  .option('-p --popular', 'get popular movies')
  .action((options) => {
    console.log(options.now)
    let extraFlag = options.now ? 'now_playing' : 'popular'
    fetchMovies(options.page, extraFlag)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5