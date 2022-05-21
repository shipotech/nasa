const {
    getAllLaunches,
    addNewLaunch
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    // Get the new launch from the request body
    const launch = req.body;

    // Convert date to date object
    launch.launchDate = new Date(launch.launchDate);
    addNewLaunch(launch);

    return res.status(201).json(req.body);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
};