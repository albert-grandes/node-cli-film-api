const movies = require('./../movies.js')

describe('movies.fetchMovieById', ()=> {
    test('return name of the movie from json file', async ()=> {
      
      expect.assertions(1)

      const expected = 'Shadows in paradise'

      const movieObject = await movies.fetchMovieById(5, '', 'local')
      const title = movieObject.title
      return expect(title).toBe(expected);   
      
    })
})
