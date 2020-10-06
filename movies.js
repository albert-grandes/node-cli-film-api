const https  = require('https')
const ora = require('ora');
const chalk = require('chalk')
const fs = require('fs')
const ntf = require('./notifier');

function fetchMovies(page, extra, local='undefined') {
  if(local =='local') {
    let path = (extra=='now_playing')? './movies/movies-now.json' : './movies/popular-movies.json'
    loadLocal(path)
} else { 
    const path = `/3/movie/${extra}?api_key=${process.env.API_KEY}&page=${page}`;
    const options = new Options(path)
    https.request( options, (res) => {
        let response = ''
        res.on('data', (data) => {
          response += data
        })
        res.on('end', () => {
            if(local == 'save') {
              saveLocal(path, response)
          } else {
            const spinner = ora('Loading popular').start()
            const solution = printMovies(JSON.parse(response))          
            if(solution) {
              extra=='now_playing' ? spinner.succeed("Movies playing now loaded") : spinner.succeed("Popular movies loaded")
            } else {
              spinner.fail("Problem printing data.")
            }       
          }
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
  }    
}

function fetchMovieById(id, extraTag, local='undefined') {
  if(local =='local') {
    let path = (extraTag=='/reviews')? './movies/movies-reviews.json' : './movies/movies-id.json';
    loadLocal(path)
  } else {
    const path = `/3/movie/${id}${extraTag}?api_key=${process.env.API_KEY}`
    const options = new Options(path)  
    https.request( options, (res) => {      
        let result = ''
        res.on('data', (data)=> {
          result += data
        })
        res.on('end', () => { 
          if(local == 'save') {
            saveLocal(path, result)
            } else {
                const spinner = ora('Loading popular').start()
                if(extraTag == '/reviews') {
                  const solution = printReview(JSON.parse(result))
                  solution ? spinner.succeed("Review loaded")  : spinner.fail('Problem printing data')
                } else {
                  const solution = printMovie(JSON.parse(result))
                  solution ? spinner.succeed("Movie loaded") : spinner.fail('Problem printing data')
                }
              }                        
        })
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
  }
}

function printMovies(movies) {
  try {
    checkErrors(movies)
  
    console.log('\n' + chalk.white('------------------ \n') 
      + chalk.white(`page ${movies.page} of ${movies.total_pages}`))
  
    for (let movie of movies.results) {
        console.log('Movie: \n' 
        + chalk.white(`ID: ${movie.id} \n`)
        + chalk.white('Title: ') + chalk.blue.bold(`${movie.title} \n`)
        + chalk.white(`Release date: ${movie.release_date} \n`))
    }
    return true
  } catch (e) {
    return false
  }
}

function printMovie(movie) {
  try {
    checkErrors(movie)
    console.log('\n' + chalk.white('------------------'))
    
    console.log(chalk.white('\nMovie: \n') 
      + chalk.white(`\nMovie Id: ${movie.id}`)
      + chalk.white(`\nTitle: `) + chalk.blue.bold(movie.title)
      + chalk.white(`\nRelease date: ${movie.release_date}`)
      + chalk.white(`\nRuntime: ${movie.runtime}`)
      + chalk.white(`\nVote count: ${movie.vote_count}`)
      + chalk.white(`\nOverview: ${movie.overview}`))
    console.log('\nGenres:')

    if(movie.genres.length > 0) {
      for (let genre of movie.genres) {
        console.log(chalk.white(genre.name))
      }
    } else {
      console.log(chalk.yellow(`Movie ${movie.id} doesn't have declared genres`))
    }

    console.log('\nSpoken languages:')
    if(movie.spoken_languages.length > 0) {
      for (let lang of movie.spoken_languages) {
        console.log(chalk.white(lang.name))
      }
    } else {
      console.log(chalk.yellow(`Movie ${movie.id} doesn't have spoken langages`))
    }
    return true;
  } catch(e){
    return false;
  }
}

function printReview(reviews) {
  try {
    checkErrors(reviews)
    if(reviews.results.length >= 1) {
      console.log('\n' + chalk.white('------------------')
      + chalk.white(`\npage ${reviews.page} of ${reviews.total_pages}`)
      + chalk.white('\nReviews:'))
      for (let rev of reviews.results) {
          console.log(chalk.white(`\nAuthor: `) + chalk.blue.bold(rev.author))
          rev.content.length>400 ? console.log(chalk.white(`\nContent: ${rev.content.slice(0,400)} ...`)) : console.log(chalk.white(`\nContent: ${rev.content}`))      
      }   
    } else {
      console.log(chalk.yellow.bold(`\nMovie with id ${reviews.id} doesnt't have reviews`))
    }
    return true
  } catch(e) {
    return false
  }  
}

function checkErrors(object) {
  if(object.success == false) throw false
  if(object.hasOwnProperty('errors')) throw false
}

function loadLocal(path) {
    const spinner = ora('Loading popular').start() 
    if(fs.existsSync(path)) {
      const response = fs.readFileSync(path)
      let solution = ''
      if (path == './movies/movies-now.json' || path == './movies/popular-movies.json') {
        solution = printMovies(JSON.parse(response))
      } else {
        solution = printMovie(JSON.parse(response))
      }
      solution ? spinner.succeed("Popular loaded from local") : spinner.fail('Problem printing data.')
    } else {
      spinner.warn('The information not is storage in local. Use --save to save information in local.')
    }  
}

function saveLocal(path, response) {
  const spinner = ora('Loading popular').start()
  fs.writeFile(path, response, (err) => {
    if (err) {
      spinner.fail('We can not save data')
    } else {
      spinner.succeed('Data saved')
      ntf.notificate('Success', 'Data saved with exit')
    }
  })
}

class Options {
  constructor(path) {
    this.host = 'api.themoviedb.org',
    this.port = 443,
    this.path = path,
    this.method = 'GET'
  }
}

exports.fetchMovies = fetchMovies
exports.fetchMovieById = fetchMovieById
exports.printMovies = printMovies
exports.printMovie = printMovie
exports.printReview = printReview