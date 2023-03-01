function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

function validateScholarID(scholarID) {
  // @todo regex support
  return typeof scholarID === "string" && scholarID.length === 7;
}

module.exports = { validateEmail, validateScholarID };
