const { isEmail, isInt, isDate } = require("validator");

exports.validateEmail = function (email) {
  return isEmail(email);
};

exports.validateScholarID = function (scholarID) {
  const scholarIDRegex = /^[1-2][0-9][1][1-6][0-9]{3}$/;
  return isInt(scholarID) && scholarIDRegex.test(scholarID);
};

exports.validateDate = function (date) {
  return isDate(date);
};

exports.validateMinTeamSize = function (minTeamSize) {
  const minTeamSizeString = minTeamSize + "";
  return isInt(minTeamSizeString, {
    min: 1,
  });
};

exports.validateMaxTeamSize = function (maxTeamSize) {
  const maxTeamSizeString = maxTeamSize + "";
  return isInt(maxTeamSizeString) && parseInt(maxTeamSizeString) >= parseInt(this.minTeamSize);
};
