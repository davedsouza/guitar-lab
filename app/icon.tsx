import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
  const imgBuffer = readFileSync(join(process.cwd(), "public/guitar-icon.jpg"))
  const base64 = imgBuffer.toString("base64")
  const src = `data:image/jpeg;base64,${base64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        <div
          style={{
            width: "512px",
            height: "512px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={src}
            style={{
              width: "640px",
              height: "640px",
              objectFit: "cover",
              objectPosition: "center",
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
