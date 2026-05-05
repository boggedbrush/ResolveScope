export const SITE_URL = "https://resolvescope.pages.dev";
const SOCIAL_IMAGE = `${SITE_URL}/assets/resolvescope-social-preview.png`;
const LOGO_URL = `${SITE_URL}/logo-mark.svg`;

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  h1: string;
  robots?: string;
  keywords: string[];
}

const PUBLIC_ROUTE_SEO: RouteSeo[] = [
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
  },
];

const NOINDEX_ROUTE_SEO: RouteSeo[] = [
  {
    path: "/dashboard",
    title: "ResolveScope Demo Dashboard",
    description:
      "ResolveScope demo dashboard for reviewing fictional seeded evidence cases.",
    h1: "ResolveScope demo dashboard.",
    robots: "noindex, follow",
    keywords: ["ResolveScope demo dashboard"],
  },
  {
    path: "/dashboard/settings",
    title: "ResolveScope Demo Settings",
    description:
      "ResolveScope demo settings for local review preferences and fictional cases.",
    h1: "ResolveScope demo settings.",
    robots: "noindex, follow",
    keywords: ["ResolveScope demo settings"],
  },
  {
    path: "/demo/auto-claim",
    title: "ResolveScope Auto Claim Demo",
    description:
      "A noindex ResolveScope demo workspace for fictional auto claim evidence review.",
    h1: "ResolveScope auto claim demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope auto claim demo"],
  },
  {
    path: "/demo/fleet-safety",
    title: "ResolveScope Fleet Safety Demo",
    description:
      "A noindex ResolveScope demo workspace for fictional fleet safety incident review.",
    h1: "ResolveScope fleet safety demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope fleet safety demo"],
  },
  {
    path: "/demo/site-inspection",
    title: "ResolveScope Site Inspection Demo",
    description:
      "A noindex ResolveScope demo workspace for fictional site inspection evidence review.",
    h1: "ResolveScope site inspection demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope site inspection demo"],
  },
  {
    path: "/demo/consumer-quality",
    title: "ResolveScope Consumer Quality Demo",
    description:
      "A noindex ResolveScope demo workspace for fictional consumer quality complaint review.",
    h1: "ResolveScope consumer quality demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope consumer quality demo"],
  },
  {
    path: "/demo/compliance-audit",
    title: "ResolveScope Compliance Audit Demo",
    description:
      "A noindex ResolveScope demo workspace for fictional compliance audit evidence review.",
    h1: "ResolveScope compliance audit demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope compliance audit demo"],
  },
  {
    path: "/report/auto-claim",
    title: "ResolveScope Auto Claim Report Demo",
    description:
      "A noindex ResolveScope stakeholder report demo for fictional auto claim review.",
    h1: "ResolveScope auto claim report demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope auto claim report demo"],
  },
  {
    path: "/report/fleet-safety",
    title: "ResolveScope Fleet Safety Report Demo",
    description:
      "A noindex ResolveScope stakeholder report demo for fictional fleet safety review.",
    h1: "ResolveScope fleet safety report demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope fleet safety report demo"],
  },
  {
    path: "/report/site-inspection",
    title: "ResolveScope Site Inspection Report Demo",
    description:
      "A noindex ResolveScope stakeholder report demo for fictional site inspection review.",
    h1: "ResolveScope site inspection report demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope site inspection report demo"],
  },
  {
    path: "/report/consumer-quality",
    title: "ResolveScope Consumer Quality Report Demo",
    description:
      "A noindex ResolveScope stakeholder report demo for fictional consumer quality review.",
    h1: "ResolveScope consumer quality report demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope consumer quality report demo"],
  },
  {
    path: "/report/compliance-audit",
    title: "ResolveScope Compliance Audit Report Demo",
    description:
      "A noindex ResolveScope stakeholder report demo for fictional compliance audit review.",
    h1: "ResolveScope compliance audit report demo.",
    robots: "noindex, follow",
    keywords: ["ResolveScope compliance audit report demo"],
  },
];

export const ROUTE_SEO = [...PUBLIC_ROUTE_SEO, ...NOINDEX_ROUTE_SEO];
export const PUBLIC_INDEXABLE_ROUTES = PUBLIC_ROUTE_SEO;

const NOT_FOUND_SEO: RouteSeo = {
  path: "/404",
  title: "Page Not Found | ResolveScope",
  description:
    "The requested ResolveScope page could not be found. Return to the product overview or demo dashboard.",
  h1: "Page not found.",
  robots: "noindex, nofollow",
  keywords: ["ResolveScope 404"],
};

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export function getSeoForPath(pathname: string): RouteSeo {
  const normalized = normalizePath(pathname);
  const exact = ROUTE_SEO.find((route) => route.path === normalized);
  if (exact) return exact;

  if (normalized.startsWith("/cases/")) {
    return {
      path: normalized,
      title: "ResolveScope Local Case Demo",
      description:
        "A noindex ResolveScope local case workspace stored in this browser.",
      h1: "ResolveScope local case demo.",
      robots: "noindex, follow",
      keywords: ["ResolveScope local case demo"],
    };
  }

  return NOT_FOUND_SEO;
}

export function canonicalUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function routeJsonLd(route: RouteSeo) {
  const url = canonicalUrl(route.path);
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "ResolveScope",
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
  };
  const creator = {
    "@type": "Person",
    "@id": `${SITE_URL}/creator#carleton-lees`,
    name: "Carleton Lees",
    url: `${SITE_URL}/creator`,
  };

  const graph: object[] = [organization, creator];

  if (route.path === "/") {
    graph.push({
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "ResolveScope",
      url,
      description: route.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      creator: { "@id": `${SITE_URL}/creator#carleton-lees` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      keywords: route.keywords.join(", "),
    });
  } else if (route.path === "/creator") {
    graph.push({
      "@type": "ProfilePage",
      "@id": `${url}#profile-page`,
      url,
      name: route.title,
      description: route.description,
      mainEntity: { "@id": `${SITE_URL}/creator#carleton-lees` },
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
      creator: { "@id": `${SITE_URL}/creator#carleton-lees` },
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
      isPartOf: { "@id": `${SITE_URL}/#webapp` },
      keywords: route.keywords.join(", "),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function setMetaByName(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setMetaByProperty(property: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export function applyRouteSeo(pathname: string) {
  const route = getSeoForPath(pathname);
  const url = canonicalUrl(route.path);

  document.title = route.title;
  setMetaByName("description", route.description);
  setMetaByName("keywords", route.keywords.join(", "));
  setMetaByName("robots", route.robots ?? "index, follow");
  setMetaByProperty("og:url", url);
  setMetaByProperty("og:title", route.title);
  setMetaByProperty("og:description", route.description);
  setMetaByProperty("og:image", SOCIAL_IMAGE);
  setMetaByProperty(
    "og:image:alt",
    "ResolveScope spatial evidence review workspace preview"
  );
  setMetaByName("twitter:title", route.title);
  setMetaByName("twitter:description", route.description);
  setMetaByName("twitter:image", SOCIAL_IMAGE);
  setMetaByName(
    "twitter:image:alt",
    "ResolveScope spatial evidence review workspace preview"
  );
  setCanonical(url);

  let script = document.head.querySelector<HTMLScriptElement>(
    'script[data-route-jsonld="true"]'
  );
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.routeJsonld = "true";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(routeJsonLd(route));
}
