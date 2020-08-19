// const { Credentials } = require('google-auth-library/build/src/auth/credentials');
// const googleAuth = require('google-auth-library');
// const scope = "https://mail.google.com/";

// tutorials
// https://designdigitalsolutions.com/sending-mail-via-nodemailer-using-your-gmail-with-oauth2/


/**
 * Step 0: Create OAuth2 credentials at the Google Console (make sure to download JSON, not only just get key and secret)
 */
const credentials = {
    "web": {
        "client_id": "643186910391-2r9tcphgmbc8sub1f3vqd2pf07nb599k.apps.googleusercontent.com",
        "project_id": "pesta-sains-nasional-2020",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "_KwB2cbr6BIODj0YpBaNN5dQ",
        "redirect_uris": ["http://localhost:3001"],
        "javascript_origins": ["http://localhost:3001"]
    }
};


/**
 * Step 1: Authorize in the browser
 */
// function getAuthorizeUrl() {
//     const oauth2Client = new googleAuth.OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);

//     const authUrl = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: scope
//     });

//     if (authUrl) console.log("Auth url is: ", authUrl);
//     else console.log("Get auth access fail");
// }

// getAuthorizeUrl();

/**
 * Step 2: Get auth token
 */

/**
 * Paste in your one-time use authorization code here
 */
// const code = '4/3AFmUnTom2n0GS1W7xLPZ9jpo2ERMEUTpE1yeMD1xpN1m3A6qevc6CZcVtwmhuys9afXdC3AbtT2rTakF81J_cY&scope=https://mail.google.com/';

// function getAccessToken() {
//     const oauth2Client = new googleAuth.OAuth2Client(
//         credentials.web.client_id,
//         credentials.web.client_secret,
//         credentials.web.redirect_uris[0]
//     );

//     oauth2Client.getToken(code, (err, token) => {
//         if (err) console.log(err);
//         else console.log(token);
//     });
// }

// getAccessToken();


/**
 * Step 3: Save access and refresh tokens as an export for Nodemailer
*/

/**
 * Paste your credentials here as this object.
 */
const tokens = {
    access_token: 'ya29.a0AfH6SMACx8YQxhYckr-WeaGPgsRWTTCpYONpXkPwesttd-RCclAxM3MhdNZGhrzYVnNdwyExw8EylRE4Zb8I12r-IKQmNpEuVQYDDDNXYuKgCiW6d_UxPVmAwJ1xNDT8L-Aa0kX8-x1_SnjP2pRBM4kocjcxw028bWc',
    refresh_token: '1//0gfIlfQGM99cbCgYIARAAGBASNwF-L9IrahzdY5GWSVnIhz1QpyDkZb-898_SryvXARFn7oHNy5A5a_CYih_eTAoNv_JTMl6gdis',
    scope: 'https://mail.google.com/',
    token_type: 'Bearer',
    expiry_date: 1597822150248
};

const googleAuth = {
    tokens,
    credentials
};

module.exports = googleAuth;