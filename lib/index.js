const psi = require("psi");
const axios = require("axios");

const errorBadge = require("./error-badge");
const badgeUrl = require("./badge-url");

const speedBadge = ({
  url,
  strat = "mobile",
  showStratLabel = false,
  googleKey
}) => {
  return new Promise((resolve, reject) => {
    const psiOpts = Object.assign(
      {
        strategy: strat
      },
      googleKey ? { key: googleKey } : { noKey: true }
    );

    return psi(url, psiOpts)
      .then(response => {
        const stratLabel = showStratLabel && `(${strat})`;
        const speed = response.ruleGroups.SPEED.score;
        const color = getColor(speed);
        const status = [speed, stratLabel].filter(Boolean).join(" ");
        return axios.get(badgeUrl(status, color)).then(({ data }) => {
          resolve({ img: data, statusCode: 200 });
        });
      })
      .catch(errorBadge)
      .then(resolve);
  });
};

const COLOR_THRESHOLDS = [
  {
    val: "brightgreen",
    threshold: 95
  },
  {
    val: "green",
    threshold: 90
  },
  {
    val: "yellowgreen",
    threshold: 80
  },
  {
    val: "yellow",
    threshold: 70
  },
  {
    val: "orange",
    threshold: 60
  },
  {
    val: "red",
    threshold: 0
  }
];

const getColor = speed => {
  return COLOR_THRESHOLDS.find(c => c.threshold <= speed).val;
};

module.exports = speedBadge;
