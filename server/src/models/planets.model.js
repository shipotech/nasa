// packages
const {parse} = require('csv-parse');
const fs = require('fs');
const path = require("path");

const planets = require('./planets.mongo');


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
        .on('data', async (data) => {
            if (isHabitable(data)) {
                //habitablePlanets.push(row); old approach
                await savePlanet(data);
            }
        })
        .on('error', (error) => {
            console.log(error.message);
            reject(error);
        })
        .on('end', async () => {
            // count the number of habitable planets
            const count = (await getAllPlanets()).length;
            console.log(`Found ${count} habitable planets.`);
            resolve()
        });
    });
}

async function getAllPlanets() {
    //return habitablePlanets; old approach
    // Exclude the _id and __v fields from the response (those are created by MongoDB by default)
    return planets.find({}, {
        '_id': 0,
        '__v': 0
    });
}

async function savePlanet(planet) {
    // making an upsert (insert + update)
    // If planet already exists, do nothing
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (error) {
        console.log(`Error saving planet ${planet.kepler_name} to database. Error: ${error}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};