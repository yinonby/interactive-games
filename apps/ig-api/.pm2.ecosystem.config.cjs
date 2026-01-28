
const apiPm2BaseConf = {
}

module.exports = {
  apps: [{
    name: "ig-api:dev",
    ...apiPm2BaseConf,
    interpreter: "node",
    script: "npm",
    args: "run start:dev",
    watch: ["./", "../../packages/"],
    exec_mode: "fork", // tsx not working with cluster
    env: {
      NODE_ENV: "development",
      LOG_LEVEL: "DBG",
    },
  }, {
    name: "ig-api:dev:inspect",
    ...apiPm2BaseConf,
    interpreter: "node",
    script: "npm",
    args: "run start:dev:inspect",
    watch: ["./", "../../packages/"],
    exec_mode: "fork", // tsx not working with cluster
    env: {
      NODE_ENV: "development",
      LOG_LEVEL: "DBG",
    },
  }, {
    name: "ig-api:prod",
    ...apiPm2BaseConf,
    interpreter: "node",
    script: ".dist/index.cjs",
    watch: [".dist"],
    exec_mode: "cluster",
    instances: "max",
    env: {
      NODE_ENV: "production",
      LOG_LEVEL: "INF",
    },
  }]
}
