const Bootcamp = require("../models/bootcamp.model.js");

exports.getAllBootcamp = (req, res) => {};

exports.getBootcamp = (req, res) => {};

exports.createBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.create(req.body); // Use 'bootcamp' instead of 'movie'
        res.status(201).json({
          status: "SUCCESS",
          data: {
            bootcamp, // Return 'bootcamp' data in response
          },
        });
      } catch (error) {
        res.status(400).json({
          status: "FAIL",
          message: error.message,
        });
      }
    };

exports.updateBootcamp = (req, res) => {};

exports.deleteBootcamp = (req, res) => {};
