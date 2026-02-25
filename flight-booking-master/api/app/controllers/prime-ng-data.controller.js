const db = require("../models");
const PrimeNgData = db.primeNgData;
const Op = db.Sequelize.Op;

// Create and Save a new PrimeNgData
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a PrimeNgData
  const primeNgData = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save PrimeNgData in the database
  PrimeNgData.create(primeNgData)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the PrimeNgData."
      });
    });
};

// Retrieve all PrimeNgData from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

  PrimeNgData.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving PrimeNgData."
      });
    });
};

// Find a single PrimeNgData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  PrimeNgData.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find PrimeNgData with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving PrimeNgData with id=" + id + ". Error: " + err
      });
    });
};

// Update a PrimeNgData by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  PrimeNgData.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "PrimeNgData was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update PrimeNgData with id=${id}. Maybe PrimeNgData was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating PrimeNgData with id=" + id  + ". Error: " + err
      });
    });
};

// Delete a PrimeNgData with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  PrimeNgData.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "PrimeNgData was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete PrimeNgData with id=${id}. Maybe PrimeNgData was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete PrimeNgData with id=" + id + ". Error: " + err
      });
    });
};

// Delete all PrimeNgData from the database.
exports.deleteAll = (req, res) => {
  PrimeNgData.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} PrimeNgData were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all PrimeNgData."
      });
    });
};

// find all published PrimeNgData
exports.findAllPublished = (req, res) => {
  PrimeNgData.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving PrimeNgData."
      });
    });
};
