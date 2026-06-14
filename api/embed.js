export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const username = url.pathname.slice(1).toLowerCase().trim();

  if (!username) {
    return res.redirect(302, 'https://forgave.lol');
  }

  const supabaseUrl = "https://xqqwyugfyntgbgohzqcz.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcXd5dWdmeW50Z2Jnb2h6cWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjI1NTQsImV4cCI6MjA5NTE5ODU1NH0.Y-Z5HawSgxraigCep2BHINLvev98b3m3BGsI1DT_LQY";

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=*`, {
      headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
    });
    const users = await response.json();
    const user = users?.[0];

    const embedTitle = user?.embed_title || `${username} on forgave.lol`;
    const embedDescription = user?.embed_description || (user?.lines?.[0] || "Check out my profile on forgave.lol!");
    const embedImage = user?.embed_image || "https://files.catbox.moe/fjrfis.png";

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(embedTitle)}</title>
        <meta property="og:title" content="${escapeHtml(embedTitle)}">
        <meta property="og:description" content="${escapeHtml(embedDescription)}">
        <meta property="og:image" content="${escapeHtml(embedImage)}">
        <meta property="og:url" content="https://forgave.lol/${username}">
        <meta name="twitter:card" content="summary_large_image">
        <meta http-equiv="refresh" content="0; url=https://forgave.lol/${username}">
    </head>
    <body>
        <p>Redirecting to <a href="https://forgave.lol/${username}">forgave.lol/${username}</a>...</p>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.redirect(302, 'https://forgave.lol');
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}
