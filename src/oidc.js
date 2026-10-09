import { UserManager, WebStorageStateStore } from "oidc-client-ts"

const oidcConfig = {
	authority: import.meta.env.VITE_OIDC_AUTHORITY,
	client_id: "thingworx",
	redirect_uri: `${import.meta.env.VITE_OIDC_BASE_URL}`,
	post_logout_redirect_uri: `${import.meta.env.VITE_OIDC_BASE_URL}`,
	response_type: "code",
	scope: "openid profile email",
	userStore: new WebStorageStateStore({ store: window.localStorage }),
	automaticSilentRenew: true,
};
console.log(window.location);
console.log("redirect_uri:", `${import.meta.env.VITE_OIDC_BASE_URL}`);
export const userManager = new UserManager(oidcConfig);