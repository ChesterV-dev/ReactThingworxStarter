import React, { createContext, useContext, useEffect, useState } from "react";
import { userManager } from "../oidc";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			//Check if returning from Keycloak with auth code in URL
			if(window.location.search.includes("code=") || window.location.search.includes("state="))
			  {
			  	try{
			  		const loggedInUser = await userManager.signinRedirectCallback();
			  		setUser(loggedInUser);
			  		//Clean auth query params from URL
			  		window.history.replaceState({}, document.title, window.location.pathname);
			  	}
			  	catch(e){
			  		console.error("Error processing OIDC redirect callback: ", e);
			  	}
			  }
			else
			{
				//Restore existing user session from storage
				const existingUser = await userManager.getUser();
				if(existingUser && !existingUser.expired)
				  {
				  	setUser(existingUser);
				  }
			}
			setLoading(false);
		};
		initAuth();

		//Register OIDC event listners for session syncronization
		const onUserLoaded = (loadedUser) => setUser(loadedUser);
		const onUserUnloaded = () => setUser(null);

		userManager.events.addUserLoaded(onUserLoaded);
		userManager.events.addUserUnloaded(onUserUnloaded);

return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const login = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();

  const value = {
    user,
    token: user?.access_token,
    profile: user?.profile,
    authenticated: !!user && !user.expired,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Initializing authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};