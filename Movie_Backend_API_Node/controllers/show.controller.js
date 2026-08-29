const showService = require('../service/show.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const createShow = async (req, res) => {
    try {
        const response = await showService.createShow(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the show";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to create the show";
        return res.status(500).json(errorResponseBody);
    }
};

const getShows = async (req, res) => {
    try {
        const response = await showService.getShows(req.query);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the shows";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch the shows";
        return res.status(500).json(errorResponseBody);
    }
};

const getShow = async (req, res) => {
    try {
        const response = await showService.getShowById(req.params.id);
        if (!response) {
            errorResponseBody.message = "Show not found";
            return res.status(404).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the show";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch the show";
        return res.status(500).json(errorResponseBody);
    }
};

const updateShow = async (req, res) => {
    try {
        const response = await showService.updateShow(req.params.id, req.body);
        if (!response) {
            errorResponseBody.message = "Show not found";
            return res.status(404).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the show";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to update the show";
        return res.status(500).json(errorResponseBody);
    }
};

const deleteShow = async (req, res) => {
    try {
        const response = await showService.deleteShow(req.params.id);
        if (!response) {
            errorResponseBody.message = "Show not found";
            return res.status(404).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the show";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to delete the show";
        return res.status(500).json(errorResponseBody);
    }
};

module.exports = {
    createShow,
    getShows,
    getShow,
    updateShow,
    deleteShow
};
