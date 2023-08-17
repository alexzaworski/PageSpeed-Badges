const SHIELDS_API = "https://img.shields.io/badge";

const badgeUrl = (status, color) => {
  return `${SHIELDS_API}/PageSpeed-${status}-${color}.svg?label=PageSpeed&logo=PageSpeedInsights&logoColor=white`;
};

module.exports = badgeUrl;
