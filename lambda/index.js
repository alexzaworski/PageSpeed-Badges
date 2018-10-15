const speedBadge = require("../lib");

exports.handler = (event, context, callback) => {
  const { queryStringParameters } = event;
  const opts = queryStringParameters || {};
  const { googleKey } = process.env;
  const { url, strat = "mobile", showStratLabel = false } = opts;

  speedBadge({ url, strat, showStratLabel, googleKey }).then(result => {
    if (!result) {
      return callback({
        statusCode: 500,
        body: "Fatal error :("
      });
    }

    const { statusCode, img } = result;
    callback(null, {
      statusCode,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8"
      },
      body: img
    });
  });
};
