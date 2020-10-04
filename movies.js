import https from 'https'
import ora from 'ora'
import chalk from 'chalk'


export function fetchMovies(page, extra) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   console.log(extra)
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/movie/${extra}?api_key=${process.env.API_KEY}&page=${page}`,
        method: 'GET'
    };
    const spinner = ora('Loading popular').start()
    https.request( options, (res) => {
        let response = ''
        res.on('data', (data) => {
          response += data
        })
        res.on('end', (d) => {
            printMovies(JSON.parse(response)) 
            extra=='now_playing' ? spinner.succeed("Movies playing now loaded") : spinner.succeed("Popular movies loaded")
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
}

export function fetchMovieById(id, extraTag) {
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/movie/${id}${extraTag}?api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    const spinner = ora('Fetching movie data').start()
    https.request( options, (res) => {
        let result = ''
        res.on('data', (data)=> {
          result += data
        })
        res.on('end', () => { 
            if(extraTag == '/reviews') {
              printReview(JSON.parse(result))
              spinner.succeed("Review loaded") 
            } else {
              printMovie(JSON.parse(result))
              spinner.succeed("Movie loaded") 
            }                          
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
}

function printMovies(movies) {
    console.log('\n' + chalk.white('------------------ \n') 
      + chalk.white(`page ${movies.page} of ${movies.total_pages}`))
  
    for (let movie of movies.results) {
        console.log('Movie: \n' 
        + chalk.white(`ID: ${movie.id} \n`)
        + chalk.white('Title: ') + chalk.blue.bold(`${movie.title} \n`)
        + chalk.white(`Release date: ${movie.release_date} \n`))
    }
}

function printMovie(movie) {
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
}

function printReview(reviews) {

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
}