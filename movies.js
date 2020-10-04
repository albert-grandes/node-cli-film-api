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

export function fetchById(id) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/${id}?api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    const spinner = ora('Fetchin person data').start()
    https.request( options, (res) => {
        res.on('data', (data) => { 
            printById(JSON.parse(data))
            spinner.succeed("Person loaded");                   
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
}

function printMovies(movies) {
    console.log('\n')
    console.log(chalk.white('------------------'))
    console.log(chalk.white(`page ${movies.page} of ${movies.total_pages}`))
    for (let movie of movies.results) {
        console.log('Movie: \n')
        console.log(chalk.white(`ID: ${movie.id}`))
        console.log(chalk.white('Title: ') + chalk.blue.bold(movie.title))
        console.log(chalk.white(`Release date: ${movie.release_date} \n`))
    }
}

function printById(person) {
    console.log('\n')
    console.log(chalk.white('------------------'))
    
    console.log(chalk.white('Person:'))
    console.log(chalk.white(`ID: ${person.id}`))
    console.log(chalk.white('Name: ') + chalk.blue.bold(person.name))
    console.log(chalk.white(`Birthday: ${person.birthday}`) + chalk.grey(' | ') + chalk.white(person.place_of_birth))
    if(person.known_for_department) console.log(chalk.white('Deaprtment: ') + chalk.magenta.bold(person.known_for_department)) 
    console.log(chalk.white('Biogarphy: ') + chalk.blue.bold(person.biography))
    console.log(chalk.white('\nAlso known as:'))
    if(person.also_known_as.length > 0) {
        for(let name of person.also_known_as) {
            console.log(chalk.white(name))
        } 
    } else {
        console.log(chalk.yellow.bold(`${person.name} doesn't have other names`))
    }
}