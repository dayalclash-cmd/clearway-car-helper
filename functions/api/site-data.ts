interface Env {
  SITE_DATA: KVNamespace;
}

const PACKAGES_KEY = "packages";
const SETTINGS_KEY = "siteSettings";
const ADMIN_PASSWORD = "clearway2025";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/site-data — public, returns packages + settings from KV
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const [packagesRaw, settingsRaw] = await Promise.all([
    context.env.SITE_DATA.get(PACKAGES_KEY),
    context.env.SITE_DATA.get(SETTINGS_KEY),
  ]);

  return new Response(
    JSON.stringify({
      packages: packagesRaw ? JSON.parse(packagesRaw) : null,
      siteSettings: settingsRaw ? JSON.parse(settingsRaw) : null,
    }),
    {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
};

// PUT /api/site-data — protected, saves packages + settings to KV
export const onRequestPut: PagesFunction<Env> = async (context) => {
  // Check auth
  const authHeader = context.request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = (await context.request.json()) as {
      packages?: unknown;
      siteSettings?: unknown;
    };

    const writes: Promise<void>[] = [];

    if (body.packages !== undefined) {
      writes.push(
        context.env.SITE_DATA.put(PACKAGES_KEY, JSON.stringify(body.packages))
      );
    }
    if (body.siteSettings !== undefined) {
      writes.push(
        context.env.SITE_DATA.put(
          SETTINGS_KEY,
          JSON.stringify(body.siteSettings)
        )
      );
    }

    await Promise.all(writes);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};
