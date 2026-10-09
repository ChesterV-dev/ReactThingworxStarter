import axios from "axios";
import { userManager } from "./oidc";

// import type { GetTFRCompletedTripsFromDB } from "~/types/apiResponses";

const BASE = `/Thingworx/Things`;

function config(accessToken)
  {
   return {
   	Authorization: `Bearer ${accessToken}`,
   	"x-thingworx-session": "true",
   	Accept: "application/json",
   	"Content-Type": "application/json"
   };
  }

let user = null;

export function setUser(input) {
	user = input;
}

async function getUser() {
	if(user) 
	{
		return user;
	}
	user = await userManager.getUser();
	return user;
}

async function apiPost(thing, service, body = {}){
	const u = await getUser();

	console.log("User:", u);
	console.log("Expired:", u?.expired);
	console.log("Token:", u?.access_token);
	console.log("Headers:", config(u?.access_token));

    if (!u || u.expired || !u.access_token) {
        await userManager.signinRedirect();
        throw new Error("User not authenticated");
    }
    return axios.post(`${BASE}/${thing}/Services/${service}`, body, {
        headers: config(u.access_token),
        withCredentials: true,
    });
}

async function GetTFRCompletedTripsFromDB(params) {
    return apiPost("Module.TFR.Service", "GetTFRCompletedTripsFromDB", params);
}

export async function initializeSession() {
    try {
        await GetTFRCompletedTripsFromDB({ Page: 1, PageSize: 1 });
    } catch (e) {
        // Ignore errors, just want to establish the ThingWorx session
        console.warn("Session initialization failed", e);
    }
}

export default {
    GetTFRCompletedTripsFromDB
};