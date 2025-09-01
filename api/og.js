/** @jsxImportSource react */
import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const owner  = process.env.GH_OWNER;
const repo   = process.env.GH_REPO;
const branch = process.env.GH_BRANCH || "main";

const base = (p) => `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${p}`;

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "item";

  const locationUrl = base(`images/${id}-location.jpg`);
  const wardrobeUrl = base(`images/${id}-wardrobe.jpg`);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630, display: "flex",
          background: "#0e1217", color: "#e9eef4", fontSize: 42, fontFamily: "Inter, system-ui, sans-serif"
        }}
      >
        <div style={{ flex: 1, position: "relative", display: "flex" }}>
          <img src={locationUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", left: 24, bottom: 24, padding: "6px 12px",
            background: "rgba(0,0,0,.45)", borderRadius: 12, fontSize: 28
          }}>Location</div>
        </div>
        <div style={{ width: 2, background: "#233042" }} />
        <div style={{ flex: 1, position: "relative", display: "flex" }}>
          <img src={wardrobeUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", left: 24, bottom: 24, padding: "6px 12px",
            background: "rgba(0,0,0,.45)", borderRadius: 12, fontSize: 28
          }}>Wardrobe</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}