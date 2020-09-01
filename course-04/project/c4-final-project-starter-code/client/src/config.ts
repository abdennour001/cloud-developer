// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '8dptt3iddc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'abdennour.eu.auth0.com', // Auth0 domain
  clientId: 'ezrYOpqUpoeL3dXJ1E8V9pZSRBhwGnL9', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
