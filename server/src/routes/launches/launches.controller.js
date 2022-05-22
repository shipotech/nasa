const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    deleteLaunch
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
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

    addNewLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);

    // Check if launch doesn't exists
    if (!existsLaunchWithId(id)) {
        return res.status(404).json({
            error: 'Launch not found'
        });
    }

    const aborted = deleteLaunch(id);
    return res.status(200).json(aborted);
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};