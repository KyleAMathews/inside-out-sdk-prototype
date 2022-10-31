const contentful = require(`contentful`)
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: `892zz7ecazv3`,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: `jNec5oJ63V6ltaHiKiTSMqvxL3Ttik0WuvwQM_CmCf4`,
})

export default client
