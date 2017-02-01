'use strict';

var dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, 
  {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    instanceMethods : {
      loanedOn: function() {
        return dateFormat(this.loaned_on, "yyyy-mm-dd-hh:mm:ss");
      },
      returnBy: function() {
        return dateFormat(this.return_by, "yyyy-mm-dd");
      },
      returnedOn: function() {
        return dateFormat(this.returned_on, "yyyy-mm-dd-hh:mm:ss");
      }
    }
  });
  return Loans;
};