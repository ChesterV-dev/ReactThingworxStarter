import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/Thingworx": {
        target: "https://devunitrack.cas.eskom.co.za",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            proxyReq.setHeader("Origin", "https://devunitrack.cas.eskom.co.za");
            proxyReq.setHeader("Referer", "https://devunitrack.cas.eskom.co.za/Shipment/");
          });
          proxy.on("proxyRes", (proxyRes) => {
            const location = proxyRes.headers["location"];
            if (location && typeof location === "string") {
              proxyRes.headers["location"] = location.replace(
                "https://devunitrack.cas.eskom.co.za",
                ""
              );
            }
            const setCookie = proxyRes.headers["set-cookie"];
            if (setCookie) {
              proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, "")
                  .replace(/;\s*SameSite=\w+/gi, "; SameSite=Lax")
              );
            }
          });
        },
      },
    },
  },
});