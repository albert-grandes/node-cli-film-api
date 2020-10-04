import https from 'https'
import ora from 'ora'
import chalk from 'chalk'


export function fetchPopular(page) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/popular?page=${page}&api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    const spinner = ora('Loading popular').start()
    https.request( options, (res) => {
        let response = "";
        res.on('data', (d) => {
            response += d 
        });
        res.on('end', (d) => { 
            let json = JSON.parse(response)
            printPopular(json)
            spinner.succeed("Popular loaded");                   
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

function printPopular(popular) {
    console.log('\n')
    console.log(chalk.white('------------------'))
    console.log(chalk.white(`page ${popular.page} of ${popular.total_pages}`))
    for (let person of popular.results) {
        console.log('Person:')
        console.log(chalk.white(`ID: ${person.id}`))
        console.log(chalk.white('Name: ') + chalk.blue.bold(person.name))
        if(person.known_for_department) console.log(chalk.white('Deaprtment: ') + chalk.magenta.bold(person.known_for_department))
        console.log('\n')
        console.log(chalk.white('Appearing in movies:'))
        console.log('\n')
        if(person.known_for) {
            for (let movie of person.known_for) {
                console.log(chalk.white('\t Movie:'))
                console.log(chalk.white(`\t ID: ${movie.id}`))
                console.log(chalk.white(`\t Release date: ${movie.release_date}`))
                console.log(chalk.white(`\t Title: ${movie.title} \n`))
            }
        }  else {
            console.log(chalk.yellow.bold(`\t ${person.name} does not appear in any movies`))
        }
        console.log('\n')       
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
