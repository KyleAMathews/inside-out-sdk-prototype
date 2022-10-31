const withTM = require(`next-transpile-modules`)([`ui`, `inside-out`])

module.exports = withTM({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
})
