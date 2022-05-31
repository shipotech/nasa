const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-712 c',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true,
}

saveLaunch(launch);

// Check if launch exists
async function existsLaunchWithId(launchId) {
    return await launches.findOne({
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

async function getAllLaunches() {
    return await launches
      .find({}, {
        '_id': 0,
        '__v': 0
      });
}

async function saveLaunch(launch) {
    // Get planet
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error(`Planet ${launch.target} not found`);
    }

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
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    deleteLaunch
}