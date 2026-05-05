import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "..");
const distDir = path.join(appDir, "dist");
const siteUrl = "https://resolvescope.pages.dev";
const socialImage = `${siteUrl}/assets/resolvescope-social-preview.png`;
const logoUrl = `${siteUrl}/logo-mark.svg`;

const publicRoutes = [
  {
    path: "/",
    title: "ResolveScope | Evidence-to-Action Case Management",
    description:
      "ResolveScope turns scattered documents, images, notes, and spatial evidence into structured case files with AI-assisted extraction, human review, approval, and export.",
    h1: "ResolveScope turns scattered evidence into approved case files.",
    keywords: [
      "ResolveScope",
      "evidence-to-action case management",
      "AI case review",
      "spatial evidence review",
      "OpenAI Codex Creator Challenge",
      "Handshake Creator Challenge",
      "Handhake Creator Challenge",
      "Carleton Lees",
    ],
    sections: [
      [
        "Evidence-to-action case management",
        "ResolveScope turns scattered documents, photos, notes, and spatial evidence into structured, reviewable case files with AI-assisted extraction, human approval, and export-ready reports.",
      ],
      [
        "Challenge context",
        "ResolveScope was created by Carleton Lees for the OpenAI Handshake Codex Creator Challenge as a focused employer-facing product concept.",
      ],
    ],
  },
  {
    path: "/architecture",
    title: "ResolveScope Architecture | Human-Gated Evidence Pipeline",
    description:
      "Explore the ResolveScope architecture for governed evidence intake, AI-assisted extraction, human approval, provenance, spatial review, and export-ready case files.",
    h1: "A governed evidence pipeline, built for review.",
    keywords: [
      "ResolveScope architecture",
      "evidence pipeline",
      "AI trust model",
      "human review workflow",
      "Codex implementation",
    ],
    sections: [
      [
        "ResolveScope architecture",
        "The system is organized around evidence intake, AI-assisted extraction, human approval, provenance, spatial review, and export-ready case files.",
      ],
      [
        "Codex implementation notes",
        "Codex supported implementation across product structure, reusable workflow patterns, and review surfaces while final product judgment remained human-owned.",
      ],
    ],
  },
  {
    path: "/codex-creator-challenge",
    title: "ResolveScope | OpenAI Handshake Codex Creator Challenge Entry",
    description:
      "ResolveScope is a Codex Creator Challenge entry by Carleton Lees, built to turn scattered operational evidence into reviewable, export-ready case files.",
    h1: "ResolveScope for the OpenAI Handshake Codex Creator Challenge.",
    keywords: [
      "OpenAI",
      "Handshake",
      "Handhake",
      "Codex",
      "Creator Challenge",
      "OpenAI Handshake Codex Creator Challenge",
      "ResolveScope",
      "Carleton Lees",
    ],
    sections: [
      [
        "Challenge entry",
        "ResolveScope is a focused OpenAI Handshake Codex Creator Challenge entry by Carleton Lees. It shows how Codex can help turn a product concept into a working employer-facing evidence review demo.",
      ],
      [
        "Search note",
        "This page uses the official Handshake spelling while also helping people who search for the common Handhake misspelling find the ResolveScope Creator Challenge entry.",
      ],
    ],
  },
  {
    path: "/creator",
    title: "Carleton Lees | ResolveScope Creator",
    description:
      "Carleton Lees created ResolveScope as an evidence-to-action product concept for the OpenAI Handshake Codex Creator Challenge.",
    h1: "Carleton Lees, creator of ResolveScope.",
    keywords: [
      "Carleton Lees",
      "ResolveScope creator",
      "OpenAI Codex",
      "Creator Challenge",
      "Handshake",
      "Handhake",
    ],
    sections: [
      [
        "Creator profile",
        "Carleton Lees created ResolveScope as a focused evidence-to-action platform concept for the OpenAI Handshake Codex Creator Challenge.",
      ],
      [
        "Product focus",
        "The project emphasizes structured evidence, human review, traceability, spatial context, and export-ready case files over broad unsupported scope.",
      ],
    ],
  },
];

const noindexRoutes = [
  ["/dashboard", "ResolveScope Demo Dashboard"],
  ["/dashboard/settings", "ResolveScope Demo Settings"],
  ["/demo/auto-claim", "ResolveScope Auto Claim Demo"],
  ["/demo/fleet-safety", "ResolveScope Fleet Safety Demo"],
  ["/demo/site-inspection", "ResolveScope Site Inspection Demo"],
  ["/demo/consumer-quality", "ResolveScope Consumer Quality Demo"],
  ["/demo/compliance-audit", "ResolveScope Compliance Audit Demo"],
  ["/report/auto-claim", "ResolveScope Auto Claim Report Demo"],
  ["/report/fleet-safety", "ResolveScope Fleet Safety Report Demo"],
  ["/report/site-inspection", "ResolveScope Site Inspection Report Demo"],
  ["/report/consumer-quality", "ResolveScope Consumer Quality Report Demo"],
  ["/report/compliance-audit", "ResolveScope Compliance Audit Report Demo"],
].map(([routePath, title]) => ({
  path: routePath,
  title,
  description: `${title} for fictional seeded ResolveScope evidence review. This app surface is available for the demo but is not intended as an indexable SEO landing page.`,
  h1: title,
  robots: "noindex, follow",
  keywords: [title, "ResolveScope demo"],
  sections: [
    [
      "ResolveScope demo surface",
      "This route is available for interactive review of fictional seeded demo data and is intentionally excluded from the XML sitemap.",
    ],
  ],
}));

const allRoutes = [...publicRoutes, ...noindexRoutes];

function canonicalUrl(routePath) {
  return routePath === "/" ? `${siteUrl}/` : `${siteUrl}${routePath}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function routeJsonLd(route) {
  const url = canonicalUrl(route.path);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ResolveScope",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/creator#carleton-lees`,
      name: "Carleton Lees",
      url: `${siteUrl}/creator`,
    },
  ];

  if (route.path === "/") {
    graph.push({
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "ResolveScope",
      url,
      description: route.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      creator: { "@id": `${siteUrl}/creator#carleton-lees` },
      publisher: { "@id": `${siteUrl}/#organization` },
      keywords: route.keywords.join(", "),
    });
  } else if (route.path === "/creator") {
    graph.push({
      "@type": "ProfilePage",
      "@id": `${url}#profile-page`,
      url,
      name: route.title,
      description: route.description,
      mainEntity: { "@id": `${siteUrl}/creator#carleton-lees` },
      keywords: route.keywords.join(", "),
    });
  } else if (route.path === "/codex-creator-challenge") {
    graph.push({
      "@type": "CreativeWork",
      "@id": `${url}#challenge-entry`,
      name: "ResolveScope",
      alternateName: [
        "OpenAI Handshake Codex Creator Challenge entry",
        "OpenAI Handhake Codex Creator Challenge entry",
      ],
      url,
      description: route.description,
      creator: { "@id": `${siteUrl}/creator#carleton-lees` },
      about: ["OpenAI", "Handshake", "Codex", "Creator Challenge"],
      keywords: route.keywords.join(", "),
    });
  } else {
    graph.push({
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${siteUrl}/#webapp` },
      keywords: route.keywords.join(", "),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function replaceOrInsertHeadTag(html, matcher, replacement) {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function renderNoscript(route) {
  const sections = route.sections
    .map(
      ([title, body]) =>
        `      <h2>${escapeHtml(title)}</h2>\n      <p>${escapeHtml(body)}</p>`
    )
    .join("\n");

  return `<noscript>
      <h1>${escapeHtml(route.h1)}</h1>
${sections}
    </noscript>`;
}

function safeJsonScript(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function renderRouteHtml(baseHtml, route) {
  const url = canonicalUrl(route.path);
  let html = baseHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="robots" content="${escapeAttr(route.robots ?? "index, follow")}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="keywords" content="${escapeAttr(route.keywords.join(", "))}" />`
  );
  html = html
    .replace(
      /<meta property="og:url" content="[\s\S]*?" \/>/,
      `<meta property="og:url" content="${escapeAttr(url)}" />`
    )
    .replace(
      /<meta property="og:title" content="[\s\S]*?" \/>/,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?" \/>/,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<meta property="og:image" content="[\s\S]*?" \/>/,
      `<meta property="og:image" content="${escapeAttr(socialImage)}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[\s\S]*?" \/>/,
      `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?" \/>/,
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<meta name="twitter:image" content="[\s\S]*?" \/>/,
      `<meta name="twitter:image" content="${escapeAttr(socialImage)}" />`
    )
    .replace(
      /<link rel="canonical" href="[\s\S]*?" \/>/,
      `<link rel="canonical" href="${escapeAttr(url)}" />`
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-route-jsonld="true">\n    ${safeJsonScript(
        routeJsonLd(route)
      )}\n    </script>`
    )
    .replace(
      /<script type="application\/ld\+json" data-route-jsonld="true">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-route-jsonld="true">\n    ${safeJsonScript(
        routeJsonLd(route)
      )}\n    </script>`
    )
    .replace(/<noscript>[\s\S]*?<\/noscript>/, renderNoscript(route));

  return html;
}

async function writeRouteHtml(baseHtml, route) {
  const html = renderRouteHtml(baseHtml, route);
  const trimmed = route.path === "/" ? "index" : route.path.slice(1);
  if (route.path === "/") {
    await writeFile(path.join(distDir, "index.html"), html);
    return;
  }

  const flatFile = path.join(distDir, `${trimmed}.html`);
  await mkdir(path.dirname(flatFile), { recursive: true });
  await writeFile(flatFile, html);
  const routeDir = path.join(distDir, trimmed);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

function render404(baseHtml) {
  return renderRouteHtml(baseHtml, {
    path: "/404",
    title: "Page Not Found | ResolveScope",
    description:
      "The requested ResolveScope page could not be found. Return to the product overview or demo dashboard.",
    h1: "Page not found.",
    robots: "noindex, nofollow",
    keywords: ["ResolveScope 404"],
    sections: [
      [
        "ResolveScope",
        "The requested page is not available. Use the product overview, architecture page, creator profile, or demo dashboard to continue.",
      ],
    ],
  });
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
await Promise.all(allRoutes.map((route) => writeRouteHtml(baseHtml, route)));
await writeFile(path.join(distDir, "404.html"), render404(baseHtml));

const sitemapUrls = publicRoutes
  .map(
    (route) => `  <url>
    <loc>${canonicalUrl(route.path)}</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.path === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n");

await writeFile(
  path.join(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);
