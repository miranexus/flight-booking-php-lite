module.exports = app => {
  const router = require("express").Router();
  const primeNgData = require("../controllers/prime-ng-data.controller.js");

  // Create a new PrimeNgData
  router.post("/", primeNgData.create);

  // Retrieve all PrimeNgData
  router.get("/", primeNgData.findAll);

  // Retrieve all published PrimeNgData
  router.get("/published", primeNgData.findAllPublished);

  // Retrieve a single PrimeNgData with id
  router.get("/:id", primeNgData.findOne);

  // Update a PrimeNgData with id
  router.put("/:id", primeNgData.update);

  // Delete a PrimeNgData with id
  router.delete("/:id", primeNgData.delete);

  // Delete all PrimeNgData
  router.delete("/", primeNgData.deleteAll);

  app.use('/api/prime-ng-data', router);
};
