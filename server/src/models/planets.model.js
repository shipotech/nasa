// packages
const {parse} = require('csv-parse');
const fs = require('fs');

// defaults
const habitablePlanets = [];

// function to filter habitable planets
function isHabitable (planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] > 1.6
}


// First we read the file using the event emitter "createReadStream"
// createReadStream returns a buffer object (collection of bytes)
fs.createReadStream('../../data/kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true // returns an array of objects
    }))
    .on('data', (row) => {
        if (isHabitable(row)) {
            habitablePlanets.push(row);
        }
    })
    .on('error', (error) => {
        console.log(error.message);
    })
    .on('end', () => {
        // count the number of habitable planets
        console.log(`Found ${habitablePlanets.length} habitable planets.`);

        // get habitable planets names
        console.log(habitablePlanets.map(planet =>
            planet['kepler_name'])
        );
    });

module.exports = {
    planets: habitablePlanets
};