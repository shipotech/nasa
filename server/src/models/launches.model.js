const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const {response} = require("express");

let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-712 c', // not applicable
    customers: ['NASA', 'ZTM'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
}

saveLaunch(launch);

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {

    console.log('Loading launches data...');
    const response = await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            pagination: false, // Do not paginate (get all results)
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem loading launches data');
        throw new Error(`Problem loading launches data. Status: ${response.status}`);
    }

    const launchDocs = response.data.docs;
    for (let launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }

        console.log(`${launch.flightNumber} - ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

// Check if launch exists
async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
}

// Get the latest flight number
async function getLatestFlightNumber() {
    const latestLaunch = await launches
      .findOne()
      .sort('-flightNumber') // Sort by descending flight number

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launches
      .find({}, {
        '_id': 0,
        '__v': 0
      })
      .skip(skip)
      .limit(limit)
}

async function saveLaunch(launch) {

    try {
        await launches.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true
        });
    } catch (error) {
        console.log(`Error saving launch ${launch} to database. Error: ${error}`);
    }
}

async function scheduleNewLaunch(launch) {
    // Get planet
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error(`Planet ${launch.target} not found`);
    }

    // Get the latest launch number
    const newFlightNumber = await getLatestFlightNumber() + 1;

    // Set a new launch
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    });

    // Save the new launch
    await saveLaunch(newLaunch);
}

async function deleteLaunch(launchId) {

    // Update the launch to be aborted instead of delete it
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    deleteLaunch
}