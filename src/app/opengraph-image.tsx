import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vectis Inc. — AI software and business automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#FAFAF7",
          color: "#0F1B2D",
          fontFamily: "Inter, sans-serif",
          border: "1px solid #E4E4DE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, fontWeight: 700, letterSpacing: "-1px" }}>
          Vectis <span style={{ marginLeft: 12, color: "#5B6675", fontWeight: 400 }}>Inc.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 20, letterSpacing: "3px", textTransform: "uppercase", color: "#5B6675" }}>
            AI software / business automation
          </div>
          <div style={{ maxWidth: 960, fontSize: 72, fontWeight: 600, lineHeight: 1.03, letterSpacing: "-4px" }}>
            Software built around how your business works.
          </div>
        </div>
        <div style={{ width: "100%", height: 3, backgroundColor: "#1D4ED8" }} />
      </div>
    ),
    size,
  );
}
