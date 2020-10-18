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
  .option('--save', 'saving data to local json file')
  .option('--local', 'showing data from local json file', 'local')
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
      persons.fetchPersonById(options.id, extraFlag)
    }
    
  })

  program
  .command('get-persons')
  .description('Make a network request to fetch person by id')
  .requiredOption('-p --popular', 'Fetch the popular persons')
  .requiredOption('--page <number>', 'get popular persons')
  .option('--save', 'saving data to local json file')
  .option('--local', 'showing data from local json file', 'local')
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
  .option('-n --now-playing', 'get movies which are out now')
  .option('-p --popular', 'get popular movies')
  .option('--save', 'saving data to local json file')
  .option('--local', 'showing data from local json file', 'local')
  .action((options) => {
    let extraFlag2 = ''
    if(options.local && options.save) {
      console.warn('ERROR: You cannot use two extra flag (--save and --local) at the same time')
    } else {
      if(options.save) {
        extraFlag2 = 'save'
      }
      if(options.local) {
        extraFlag2 = 'local'
      }
      const extraFlag = options.nowPlaying ? 'now_playing' : 'popular'
      movies.fetchMovies(options.page, extraFlag, extraFlag2)
    }
    
  })

  program
  .command('get-movie')
  .description('Make a network request to fetch movies')
  .requiredOption('--id <number>', 'get movie by Id')
  .option('--reviews', 'get reviews for the movie with id')
  .option('--save', 'saving data to local json file')
  .option('--local', 'showing data from local json file', 'local')
  .action((options) => {
    let extraFlag = options.reviews ? '/reviews' : ''
    let extraFlag2 = ''
    if(options.local && options.save) {
      console.warn('ERROR: You cannot use two extra flag (--save and --local) at the same time')
    } else {
      if(options.save) {
        extraFlag2 = 'save'
      }
      if(options.local) {
        extraFlag2 = 'local'
      }
      movies.fetchMovieById(options.id, extraFlag, extraFlag2)
    }
    
  })

program.parse(process.argv)


//Executing using> $ node -r dotenv/config moviedb.js get-person -p --page 5