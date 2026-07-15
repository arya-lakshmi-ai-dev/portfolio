import { ImageResponse } from "next/og";

import { site } from "@/config/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLUM = "#7F2F57";
const INK = "#1F191C";
const PAPER = "#F1F0ED";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        {/* masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `2px solid ${INK}`,
            paddingBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: PLUM,
              }}
            />
            <div
              style={{
                fontSize: 26,
                letterSpacing: 6,
                color: INK,
                textTransform: "uppercase",
              }}
            >
              {site.name}
            </div>
          </div>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#6B5F66" }}>
            PORTFOLIO
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              gap: 22,
              fontSize: 88,
              color: INK,
              lineHeight: 1.04,
            }}
          >
            <span>I build</span>
            <span style={{ color: PLUM, fontStyle: "italic" }}>
              intelligent
            </span>
            <span>products,</span>
          </div>
          <div style={{ fontSize: 88, color: INK, lineHeight: 1.04 }}>
            end to end.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #D8D2CC",
            paddingTop: 22,
          }}
        >
          <div style={{ fontSize: 26, color: PLUM, letterSpacing: 3 }}>
            {site.role.toUpperCase()}
          </div>
          <div style={{ fontSize: 24, color: "#6B5F66" }}>
            aryalakshmi.me · ask my AI anything
          </div>
        </div>
      </div>
    ),
    size
  );
}
