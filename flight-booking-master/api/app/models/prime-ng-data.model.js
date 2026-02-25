module.exports = (sequelize, Sequelize) => {
  // Important "primeNgData" is the table name in the database.
  return sequelize.define("primeNgData", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });
};
