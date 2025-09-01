import { Octokit } from "@octokit/rest";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

const owner  = process.env.GH_OWNER;
const repo   = process.env.GH_REPO;
const branch = process.env.GH_BRANCH || "main";

function decodeDataUrl(dataUrl) {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || "");
  if (!m) throw new Error("Invalid data URL");
  const mime = m[1];
  const ext  = mime.split("/")[1].replace("jpeg", "jpg");
  return { ext, base64: m[2] };
}

async function commitBase64(octokit, path, base64Content, message) {
  let sha;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    sha = data.sha;
  } catch {}
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, path, branch, message, content: base64Content, sha
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { id, locationDataUrl, wardrobeDataUrl } = req.body || {};
    if (!id || !locationDataUrl || !wardrobeDataUrl) {
      return res.status(400).json({ error: "Missing id or images" });
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const loc = decodeDataUrl(locationDataUrl);
    const war = decodeDataUrl(wardrobeDataUrl);

    const locPath = `images/${id}-location.${loc.ext}`;
    const warPath = `images/${id}-wardrobe.${war.ext}`;

    await commitBase64(octokit, locPath, loc.base64, `Upload location for ${id}`);
    await commitBase64(octokit, warPath, war.base64, `Upload wardrobe for ${id}`);

    const shareUrl = `https://${req.headers.host}/api/share/${encodeURIComponent(id)}`;
    res.status(200).json({ ok: true, shareUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Upload failed" });
  }
}