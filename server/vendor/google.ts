import { google, Auth } from "googleapis";

export const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.CLIENT_URL}`,
});
export const googleAccessScopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
];

export const authorizationURL = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: googleAccessScopes,
    include_granted_scopes: true,
    response_type: "code",
});

export async function getGoogleTokens(code: string) {
    return (await oauth2Client.getToken(code)).tokens;
}

export function setGoogleCredentials(tokens: Auth.Credentials) {
    return oauth2Client.setCredentials(tokens);
}

export async function getGoogleUserInfo() {
    return await google.oauth2({ version: "v2", auth: oauth2Client }).userinfo.get();
}