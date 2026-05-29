import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  const imgBuffer = readFileSync(join(process.cwd(), "public/guitar-og.jpg"))
  const base64 = imgBuffer.toString("base64")
  const src = `data:image/jpeg;base64,${base64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "linear-gradient(to bottom, #0f172a, #020617)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Guitar photo — right side, fading in */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "540px",
            height: "630px",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0",
              background: "linear-gradient(to right, #0f172a 0%, rgba(15,23,42,0.6) 40%, transparent 100%)",
              zIndex: 1,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "0",
              background: "linear-gradient(to top, #020617 0%, transparent 30%)",
              zIndex: 1,
              display: "flex",
            }}
          />
          <img
            src={src}
            style={{
              width: "540px",
              height: "630px",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Left: text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: "680px",
            position: "relative",
            zIndex: 2,
            gap: "0",
          }}
        >
          {/* Site logo/title */}
          <div
            style={{
              fontSize: "88px",
              fontWeight: "700",
              color: "white",
              letterSpacing: "-3px",
              lineHeight: "1",
              display: "flex",
              marginBottom: "16px",
            }}
          >
            Guitar Lab
          </div>

          {/* Subtitle — slate-400 */}
          <div
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              lineHeight: "1.4",
              display: "flex",
              marginBottom: "40px",
            }}
          >
            Master Guitar Theory &amp; Technique
          </div>

          {/* Module category pills — matching site style */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Scales & Lead",    color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)" },
              { label: "Chords & Harmony", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
              { label: "Technique",        color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.2)" },
              { label: "Styles",           color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)" },
              { label: "Songs",            color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)" },
            ].map((tag) => (
              <div
                key={tag.label}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: `1px solid ${tag.border}`,
                  background: tag.bg,
                  color: tag.color,
                  fontSize: "17px",
                  fontWeight: "500",
                  display: "flex",
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>

          {/* Module count — slate-500 style */}
          <div
            style={{
              marginTop: "36px",
              fontSize: "17px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#9333ea",
                display: "flex",
              }}
            />
            40+ interactive modules
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
