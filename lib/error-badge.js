const axios = require("axios");
const badgeUrl = require("./badge-url");

const errorBadge = error => {
  console.error(error);
  return new Promise(resolve => {
    axios
      .get(badgeUrl("ERR", "red"))
      .then(({ data }) => {
        resolve({ img: data, statusCode: 500 });
      })
      .catch(unrecoverableError => {
        console.error(unrecoverableError);
        resolve(null);
      });
  });
};

module.exports = errorBadge;
