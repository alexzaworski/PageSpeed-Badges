const psi = require("psi");
const axios = require("axios");
const { Redis } = require("ioredis");

const errorBadge = require("./error-badge");
const badgeUrl = require("./badge-url");

const redis = new Redis(process.env.REDIS_URI ?? "redis://localhost:6379");
const cache_ttl = process.env.REDIS_TTL ?? 120;

const makeBadge = (speed, strat, cache = false) => {
  console.debug((cache ? "cache hit" : "cache miss") + ` - speed: ${speed}`);
  const stratLabel = strat && `(${strat})`;
  const color = getColor(speed);
  const status = [speed, stratLabel].filter(Boolean).join(" ");
  return axios.get(badgeUrl(status, color)).then(({ data }) => {
    return { img: data, statusCode: 200 };
  });
};

const speedBadge = ({
  url,
  strat = "mobile",
  showStratLabel = false,
  googleKey
}) => {
  return new Promise(async (resolve, reject) => {
    const psiOpts = Object.assign(
      { strategy: strat },
      googleKey ? { key: googleKey } : { noKey: true }
    );
    
    const cachedSpeed = await redis.get(url);
    if (cachedSpeed) {
      return makeBadge(cachedSpeed, showStratLabel && strat, true).then(resolve);
    }

    return psi(url, psiOpts)
      .then(async res => {
        const speed = res.data.lighthouseResult.categories.performance.score;
        const displaySpeed = Math.round(speed * 100);
        redis.set(url, displaySpeed, "EX", cache_ttl);
        return makeBadge(displaySpeed, showStratLabel && strat);
      })
      .catch(errorBadge)
      .then(resolve);
  });
};

const COLOR_THRESHOLDS = [
  { val: "brightgreen", threshold: 95 },
  { val: "green", threshold: 90 },
  { val: "yellowgreen", threshold: 80 },
  { val: "yellow", threshold: 70 },
  { val: "orange", threshold: 60 },
  { val: "red", threshold: 0 }
];

const getColor = speed => {
  return COLOR_THRESHOLDS.find(c => c.threshold <= speed).val;
};

module.exports = speedBadge;
