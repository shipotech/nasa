const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    deleteLaunch
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    // Get the new launch from the request body
    const launch = req.body;

    // Making validations
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch fields'
        });
    }

    // Convert date to date object
    launch.launchDate = new Date(launch.launchDate);

    // Add date validation
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }

    await scheduleNewLaunch(launch);

    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);

    // Check if launch doesn't exists
    const existsLaunch = await existsLaunchWithId(id);
    if (!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        });
    }

    const aborted = await deleteLaunch(id);
    if (!aborted) {
        return res.status(400).json({
            error: 'Could not abort launch'
        });
    }

    return res.status(200).json({
        ok: true
    });
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};