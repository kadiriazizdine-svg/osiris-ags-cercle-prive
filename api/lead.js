// Fonction Vercel : envoie l'événement Lead à l'API Conversions de Meta.
// Le token n'est JAMAIS dans le code : il est lu depuis la variable d'environnement META_CAPI_TOKEN (Vercel > Settings > Environment Variables).
const PIXEL_ID = "1627718115570252";
const GRAPH_VERSION = "v21.0";

function parseCookies(header) {
  const out = {};
  (header || "").split(";").forEach(function (part) {
    const i = part.indexOf("=");
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  const token = process.env.META_CAPI_TOKEN;
  if (!token) { res.status(500).json({ ok: false, error: "META_CAPI_TOKEN manquant" }); return; }

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }

  const cookies = parseCookies(req.headers.cookie);
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || undefined;
  const userData = {
    client_ip_address: ip,
    client_user_agent: req.headers["user-agent"] || undefined,
    fbp: cookies._fbp || body.fbp || undefined,
    fbc: cookies._fbc || body.fbc || undefined
  };

  const payload = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(body.event_id || ""),
      action_source: "website",
      event_source_url: String(body.url || req.headers.referer || ""),
      user_data: userData,
      custom_data: { content_name: "Cercle Privé", content_category: "WhatsApp", placement: String(body.placement || "") }
    }]
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const r = await fetch("https://graph.facebook.com/" + GRAPH_VERSION + "/" + PIXEL_ID + "/events?access_token=" + encodeURIComponent(token), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, meta: j });
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e) });
  }
};
