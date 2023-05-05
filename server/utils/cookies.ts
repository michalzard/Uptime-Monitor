// Cookies Utils

import { Request, Response } from "express";

/**
 * Sets name and value for Set-Cookie header
 * @param res express Response
 * @param name cookie name
 * @param value cookie value
 */
export function setHTTPOnlyCookie(res: Response, name: string, value: string) {
    res.cookie(name, value, { httpOnly: true, secure: true });
}
/**
 * Reads cookies from request headers in order to parsed them into k,v pairs
 * @param req express Request
 * @returns Object with key,value pairs of all cookies
 */
export function readCookiesFromHeaders(req: Request) {
    const { cookie } = req.headers;
    const results: { [key: string]: string } = {};
    if (cookie) {
        const s = cookie.split(";");
        for (let i = 0; i < s.length; i++) {
            const cookie = s[i];
            const cSplit = cookie.split("=");
            if (cSplit) results[cSplit[0].trim()] = cSplit[1];
        }
    } else return null;
    return results;
}