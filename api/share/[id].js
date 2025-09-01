export default async function handler(req, res) {
  const { id = "" } = req.query;
  const cleanId = Array.isArray(id) ? id[0] : id;
  const redirectBase = process.env.REDIRECT_BASE || "";

  const og = `https://${req.headers.host}/api/og?id=${encodeURIComponent(cleanId)}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Callsheet • ${cleanId}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="Callsheet • ${cleanId} — Location & Wardrobe">
<meta property="og:description" content="Preview images for ${cleanId}.">
<meta property="og:url" content="https://${req.headers.host}/api/share/${encodeURIComponent(cleanId)}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${og}">
<meta http-equiv="Cache-Control" content="public, max-age=600">
</head>
<body>
<script>
  setTimeout(function(){
    var base = ${JSON.stringify(redirectBase)};
    if (base) location.replace(base + encodeURIComponent(${JSON.stringify(cleanId)}));
  }, 50);
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}