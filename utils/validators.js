const { isEmail, isInt, isDate, isTime, isURL } = require("validator");

exports.validateEmail = function (email) {
  const instituteEmailRegex = /^[^@\s\.]+@[A-Za-z]+\.(nits\.ac\.in)$/;
  return isEmail(email) && instituteEmailRegex.test(email.toLowerCase());
};

exports.validateScholarID = function (scholarID) {
  const scholarIDRegex = /^[1-2][0-9][1][1-6][0-9]{3}$/;
  return isInt(scholarID) && scholarIDRegex.test(scholarID);
};

exports.validateDate = function (date) {
  return isDate(date);
};

exports.validateTime = function (startTime) {
  return isTime(startTime + "");
};

exports.validateGroupLink = function (URL) {
  // group link can be null
  return URL === null || isURL(URL + "");
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
