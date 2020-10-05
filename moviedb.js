#!/usr/bin/env node
//import apiCall from "./clearfunctions";
const ora = require('ora');
const call = require('./functions');
const { program } = require('commander');
const https = require('https'); //https://nodejs.org/api/https.html 
require('dotenv').config()



//program.option('-t, --test', 'only is a test')


console.log(process.env.API_KEY)
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
  .option('--save', 'saving data to local json file')
  .action((options) => {
    let local = ''
    if(options.save) {
      local = 'save'
    } 
    fetchPopularPersons(options.page, local)
  })

  program
  .command('get-movies')
  .description('Make a network request to fetch movies')
  .requiredOption('--page <number>', 'get movies with page number')
  .option('-n --now', 'get movies which are out now')
  .option('-p --popular', 'get popular movies')
  .action((options) => {
    let extraFlag = options.now ? 'now_playing' : 'popular'
    fetchMovies(options.page, extraFlag)
  })

  program
  .command('get-movie')
  .description('Make a network request to fetch movies')
  .requiredOption('--id <number>', 'get movie by Id')
  .option('--reviews', 'get reviews for the movie with id')
  .action((options) => {
    
    call.apiCall(options.page)
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5