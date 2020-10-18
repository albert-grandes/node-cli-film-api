# Node.js CLI pill

## Project overview

The objective of this project is to make first steps with Node.js by creating a simple command line intergface app using commonJS. Mini-project is using third party API - movies database (api.themoviedb.org), native Node.js https module and various npm packages to show request results and alerts in terminal.
As a result user, by entereing determined commands with specific flags, can fetch and print in terminal following data:

- specific page of most popular persons with details 
- information about person with specific id
- specific page of most popular movies with details
- specific page of now-playing movies with details
- information about movie with specific id or reviews for this movies

For detailed command see [Funcionality](#functionality)

## Requirements

Recommended:

Node.js version higher than 10

Npm version higher than 6

## Project structure

```
├── movies
│   ├── movies-now.json
│   ├── movies-popilar.json
│   ├── movie-id.json
│   └── review-id.json
├── persons
│   ├── popular-persons.json
│   └── person-id.json 
├── moviedb.js
├── movies.js
├── persons.js
└── notifier.js
```

- <span style="color:orange">moviedb.js</span> contains all the commands for the CLI written with Commander packages
- <span style="color:orange">movies.js</span> contains function to fetch movies data from API and print it in terminal with Chalk package
- <span style="color:orange">persons.js</span> contains function to fetch persons data from API and print it in terminal with Chalk package
- <span style="color:orange">notifier.js</span> has the function with configuration for Notifies functionality
- folders <span style="color:orange">movies</span> and <span style="color:orange">persons</span> contain local json files with info fetched from API in case of using --save and --local flags

## Installation

All the necessary dependancies are included in package.json file, in order to istall then:

```
npm install
```

## Functionality

All commands should start with:

```
./moviedb.js
```
### Fetching information about persons

Popular persons: <span style="color:orange">get-persons</span> command, rerquired flags are <span style="color:purple">-p</span> and <span style="color:purple">--page</span> with number

```
./moviedb.js get-persons -p --page 5
```
Person by id: <span style="color:orange">get-person</span> command, required flags are <span style="color:purple">--id</span> with number

```
./moviedb.js get-person --id 5
```
### Fetching information about movies

Popular movies: <span style="color:orange">get-movies</span> command, required flag <span style="color:purple">--page</span> with number

```
./moviedb.js get-movies --page 5
```

Optional flags:

<span style="color:purple; font-weight:bold">-n</span>  - for 'now-playing movies'

<span style="color:purple; font-weight:bold">-p</span> - for 'popular movies'

 if no optional flag included popular movies will be printed by default.

now-playing:

```
./moviedb.js get-movies --page 5 -n
```
popular:
```
./moviedb.js get-movies --page 5 -p
```
or
```
./moviedb.js get-movies --page 5
```

Movie by id: <span style="color:orange">get-movie</span> command, required flag <span style="color:purple">--id</span> with number

```
./moviedb.js get-movie --id 5
```

Optional flags:

<span style="color:purple; font-weight:bold">--reviews</span>  - for 'reviews'
```
./moviedb.js get-movie --id 5 --reviews
```

### General optional flags to use local files (jsons from folders movies and persons)

<span style="color:purple; font-weight:bold">--save</span>  - to save data to local jsons file

<span style="color:purple; font-weight:bold">--local</span>  - to print data from local jsons file

May be applied to any command

```
./moviedb.js get-movie --id 5 --reviews --save
```

```
./moviedb.js get-movie --id 5 --reviews --local
```

## Packages used in project
[Commander](https://www.npmjs.com/package/commander) - The complete solution for node.js command-line interfaces

[Ora](https://www.npmjs.com/package/commander) - Elegant terminal spinner

[Chalk](https://www.npmjs.com/package/chalk) - Terminal styling

[Dotenv](https://www.npmjs.com/package/dotenv) - A zero-dependency module that loads environment variables from a .env file into process.env.

[Notifier](https://www.npmjs.com/package/notifier) - A simple node.js module to handle all the application level notifications (apple push notifications, mails and facebook posts)

## Authors

**Yulia Belyakova** - [Code Assembler](https://code.assemblerschool.com/yulia-belyakova)

**Albert Grandes** - [Code Assembler](https://code.assemblerschool.com/albert-grandes)






