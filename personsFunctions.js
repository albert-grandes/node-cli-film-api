import https from 'https'
import ora from 'ora'
import chalk from 'chalk'


export function apiCallPopular(page) {
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/popular?page=${page}&api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    //START REQUEST
    const spinner = ora('Loading popular').start()
    https.request( options, (res) => {
      
        let response = "";
        res.on('data', (d) => {
            //process.stdout.write(d);
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
    //END REQUEST
}

//export default apiCall

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
            console.log(chalk.white(`\t ${person.name} does not appear in any movies`))
        }
        console.log('\n')       
    }
}
