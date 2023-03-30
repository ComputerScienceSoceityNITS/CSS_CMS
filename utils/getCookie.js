// cookie_name = required cookie,
// cookie_string = req.headers.cookie or req.cookie [usually]
// returns the value of the cookie if found & `undefined` if not

const getCookie = (cookie_name, cookie_string) => {
  if (!cookie_string) return undefined;
  const cookies = {};
  cookie_string.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (!key || !value) return;
    cookies[key.trim()] = value.trim();
  });
  return cookies[cookie_name];
};

module.exports = { getCookie };
