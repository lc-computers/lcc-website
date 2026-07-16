import { ImageResponse } from "next/og";

export const alt =
  "Lake Cumberland Computers — IT Services & Computer Support, Lake Cumberland KY";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #0284c7 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg
            width="88"
            height="88"
            viewBox="0 0 32 32"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="4" y="6" width="24" height="15" rx="2" />
            <path d="M11 26h10M16 21v5" />
            <path d="M9 15c2-2.5 4-2.5 6 0s4 2.5 6 0" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
              Lake Cumberland Computers
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 40, color: "#bae6fd" }}>
          Managed IT · Networking · Cybersecurity · WiFi · Cameras · Phones · Repair
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "#e0f2fe" }}>
          Russell Springs, KY — serving the Lake Cumberland region · (270) 566-3888
        </div>
      </div>
    ),
    { ...size }
  );
}
