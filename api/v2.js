const speedBadge = require("../lib");

async function handler(request, response) {
  if (!request.url) return response.status(400);

  const url = new URL(request.url, `http://${request.headers.host}`);
  const { searchParams } = url;
  const { GOOGLE_API_KEY: googleKey } = process.env;
  const urlParam = searchParams.get("url");
  const strat = searchParams.get("strat") ?? "mobile";
  const showStratLabel = searchParams.get("showStratLabel") ?? false;
  
  const result = await speedBadge({ url: urlParam, strat, showStratLabel, googleKey });

  if (!result) {
    return response.status(500).send("Fatal error :(");
  }

  const { statusCode, img } = result;
  response.setHeader("Cache-Control", "maxage=86400");
  response.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  response.status(statusCode).send(img);

  return response;
}

module.exports = handler;
