'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
   const now = new Date();
    await queryInterface.bulkInsert('Users', [
      { name: 'a', email: 'a@a.com', password: bcrypt.hashSync('aaaaaaaa', bcrypt.genSaltSync(8)), createdAt: now, updatedAt: now},
      { name: 'b', email: 'b@b.com', password: bcrypt.hashSync('bbbbbbbb', bcrypt.genSaltSync(8)), createdAt: now, updatedAt: now},
      { name: 'c', email: 'c@c.com', password: bcrypt.hashSync('cccccccc', bcrypt.genSaltSync(8)), createdAt: now, updatedAt: now},
      { name: 'd', email: 'd@d.com', password: bcrypt.hashSync('dddddddd', bcrypt.genSaltSync(8)), createdAt: now, updatedAt: now},
      { name: 'e', email: 'e@e.com', password: bcrypt.hashSync('eeeeeeee', bcrypt.genSaltSync(8)), createdAt: now, updatedAt: now},
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
