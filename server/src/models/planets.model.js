// packages
const {parse} = require('csv-parse');
const fs = require('fs');
const path = require("path");

// defaults
const habitablePlanets = [];

// function to filter habitable planets
function isHabitable (planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] > 1.6
}

// Front-end can call this function to get the habitable planets even if the data is not ready
// So we need to make sure the data is ready before we return the data using Promises

function loadPlanetsData() {
    // First we read the file using the event emitter "createReadStream"
    // createReadStream returns a buffer object (collection of bytes)
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
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
            reject(error);
        })
        .on('end', () => {
            // count the number of habitable planets
            console.log(`Found ${habitablePlanets.length} habitable planets.`);
            resolve()
        });
    });
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets
};