#!/usr/bin/env node
//import apiCall from "./clearfunctions";
const persons = require('./persons');
const movies = require('./movies');
const { program } = require('commander');
const https = require('https'); //https://nodejs.org/api/https.html 
require('dotenv').config()



//program.option('-t, --test', 'only is a test')

program
  .command('get-person')
  .description('Make a network request to fetch the most popular persons')
  .requiredOption('--id <number>', 'get person')
  .action((options) => {
    persons.fetchPersonById(options.id)
  })

  program
  .command('get-persons')
  .description('Make a network request to fetch person by id')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .option('--save', 'saving data to local json file')
  .option('--local', 'saving data to local json file', 'local')
  .action((options) => {
    let extraFlag = ''
    if(options.local && options.save) {
      console.warn('ERROR: You cannot use two extra flag (--save and --local) at the same time')
    } else {
      if(options.save) {
        extraFlag = 'save'
      }
      if(options.local) {
        extraFlag = 'local'
      }
      persons.fetchPopularPersons(options.page, extraFlag)
    }
  })

 program
  .command('get-movies')
  .description('Make a network request to fetch movies')
  .requiredOption('--page <number>', 'get movies with page number')
  .option('-n --now', 'get movies which are out now')
  .option('-p --popular', 'get popular movies')
  .action((options) => {
    let extraFlag = options.now ? 'now_playing' : 'popular'
    movies.fetchMovies(options.page, extraFlag)
  })

  program
  .command('get-movie')
  .description('Make a network request to fetch movies')
  .requiredOption('--id <number>', 'get movie by Id')
  .option('--reviews', 'get reviews for the movie with id')
  .action((options) => {
    let extraFlag = options.reviews ? '/reviews' : ''
    movies.fetchMovieById(options.id, extraFlag)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5