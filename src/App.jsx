import React, { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import api from './api';

function App() {
  const { authenticated, profile, token, login, logout } = useAuth();

  //Add trip data to state
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const GetcompletedTrips = async () => {
    try {
      setLoadingTrips(true);

      let response = await api.GetTFRCompletedTripsFromDB()

      const data = response.data?.rows || response.data || [];
      setTrips(Array.isArray(data) ? data : [data]);
      console.log("API response:", data);
    } catch (err) {
      console.error("API call failed:", err);
    }
    finally {
      setLoadingTrips(false);
    }
  };

//Automatically fetch data when user becomes authenticated
  useEffect(() => {
    if(authenticated) 
      {
        GetcompletedTrips();
      }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>UniTrack Portal</h1>
        <p>Please log in to continue.</p>
        <button onClick={login}>Log In with Keycloak</button>
      </div>
    );
  }

return (
    <div style={{ padding: "2rem" }}>
      <h1>UniTrack Portal</h1>
      <p>Welcome, <strong>{profile?.preferred_username || profile?.name}</strong>!</p>
      <p>Email: {profile?.email}</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", marginBottom: "2rem" }}>
        <button onClick={logout}>Log Out</button>
      </div>

      {/* 3. Render the data in a Table */}
      {trips.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <h2>Completed Trips</h2>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th>Consignment</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Arival Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, index) => (
                <tr key={trip.tfrID || index}>
                  <td>{trip.consignment}</td>
                  <td>{trip.wagon_origin_loc}</td>
                  <td>{trip.wagon_final_loc}</td>
                  <td>{trip.wagon_current_dt}</td>
                  <td>{trip.arrival_status}</td>
                  <td><button>Action</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default App;