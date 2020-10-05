const https  = require('https')
const ora = require('ora');
const chalk = require('chalk')
const fs = require('fs')


function fetchPopularPersons(page, local=undefined) {
  const spinner = ora('Loading popular').start()
    //https://nodejs.org/api/https.html#https_https_request_options_callback
   if(local =='local') {
       if(fs.existsSync('./persons/popular-persons.json')) {
          const response = fs.readFileSync('persons/popular-persons.json');
          
          const solution = printPopular(JSON.parse(response))
            
          solution ? spinner.succeed("Popular loaded from local") : spinner.warn("Problem printing data.")
      
       } else {
        spinner.warn('The information not is storage in local. Use --save to save information in local.')
       }
   } else {
    const options = {
      host: 'api.themoviedb.org',
      port: 443,
      path: `/3/person/popular?page=${page}&api_key=${process.env.API_KEY}`,
      method: 'GET'
    };
    
    https.request( options, (res) => {
        let response = "";
        res.on('data', (d) => {
            response += d 
        });
        res.on('end', (d) => { 
            if(local == 'save') {
                fs.writeFile('./persons/popular-persons.json', response, (err) => {
                  if (err) spinner.fail('We can not save data')
                  spinner.succeed('Data saved')
                })
            } else {
                const solution = printPopular(JSON.parse(response))         
                solution ? spinner.succeed("Popular loaded from local") : spinner.warn("Problem printing data.")
            }
                              
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end()
   }
    
}

function fetchPersonById(id, local='undefined') {
  const spinner = ora('Fetchin person data').start()
    if(local =='local') {
      if(fs.existsSync('./persons/person-id.json')) {
         const response = fs.readFileSync('./persons/person-id.json');
         printById(JSON.parse(response))
         spinner.succeed("Popular loaded from local")
      } else {
       spinner.warn('The information not is storage in local. Use --save to save information in local.')
      }
  } else {
    const options = {
        host: 'api.themoviedb.org',
        port: 443,
        path: `/3/person/${id}?api_key=${process.env.API_KEY}`,
        method: 'GET'
    };
    
    https.request( options, (res) => {
      let response = "";
        res.on('data', (d) => {
            response += d 
        });
        res.on('end', () => {           
            if(local == 'save') {
                fs.writeFile('./persons/person-id.json', response, (err) => {
                    if (err) spinner.fail('We can not save data')
                    spinner.succeed('Data saved')
                })
            } else {
              printById(JSON.parse(response))
              spinner.succeed("Person loaded");
            }
        });
    })
    .on('error', (e) => {
      spinner.fail(`Something went wrong! Error message: ${e.message}`)
    })
    .end();
  }
}

function printPopular(popular) {

    try {
        checkErrors(popular)

        console.log('\n' 
            + chalk.white('------------------')
            + chalk.white(`page ${popular.page} of ${popular.total_pages}`))
            
            for (let person of popular.results) {
                console.log('Person:'
                + chalk.white(`\nID: ${person.id}`)
                + chalk.white('\nName: ') 
                + chalk.blue.bold(person.name))
            
                if(person.known_for_department) console.log(chalk.white('Deaprtment: ') + chalk.magenta.bold(person.known_for_department))
                console.log(chalk.white('\nAppearing in movies:\n'))

                if(person.known_for) {
                    for (let movie of person.known_for) {
                        console.log(chalk.white('\t Movie:\n')
                        +chalk.white(`\t ID: ${movie.id}\n`)
                        +chalk.white(`\t Release date: ${movie.release_date}\n`)
                        +chalk.white(`\t Title: ${movie.title} \n`))
                    }
                }  else {
                    console.log(chalk.yellow.bold(`\t ${person.name} does not appear in any movies`))
                }
                console.log('\n')       
            }
            return true

    } catch(e) {
      return false;
    }    
}

function printById(person) {
    console.log('\n'
      + chalk.white('------------------\n')
      + chalk.white('\nPerson:\n')
      + chalk.white(`\nID: ${person.id}`)
      + chalk.white('\nName: ') + chalk.blue.bold(person.name)
      + chalk.white(`\nBirthday: ${person.birthday}`) + chalk.grey(' | ') + chalk.white(person.place_of_birth)) 
  
    if(person.known_for_department) console.log(chalk.white('Department: ') + chalk.magenta.bold(person.known_for_department)) 
    console.log(chalk.white('Biogarphy: ') 
      + chalk.blue.bold(person.biography)
      + chalk.white('\nAlso known as:'))
  
    if(person.also_known_as.length > 0) {
        for(let name of person.also_known_as) {
            console.log(chalk.white(name))
        } 
    } else {
        console.log(chalk.yellow.bold(`${person.name} doesn't have other names`))
    }
}

function checkErrors(object) {
    if(object.success == false) throw false
    if(object.hasOwnProperty('errors')) throw false
}

exports.fetchPopularPersons = fetchPopularPersons
exports.fetchPersonById = fetchPersonById