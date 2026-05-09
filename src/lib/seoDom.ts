/** Production site origin — keep in sync with `index.html` canonical and sitemap. */
export const SITE_ORIGIN = "https://pakpalforum.com"

export const DEFAULT_OG_IMAGE_PATH = "/images/ppf%20logo%20transparent.webp"

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_ORIGIN}${p}`
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute("property", property)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute("name", name)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

export function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement("link")
    link.rel = "canonical"
    document.head.appendChild(link)
  }
  link.href = href
}

export function applyHomeSeo(opts: { title: string; description: string }) {
  document.title = opts.title
  const meta = document.getElementById("meta-description") as HTMLMetaElement | null
  if (meta) meta.content = opts.description

  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH)
  setMetaByProperty("og:type", "website")
  setMetaByProperty("og:title", opts.title)
  setMetaByProperty("og:description", opts.description)
  setMetaByProperty("og:url", `${SITE_ORIGIN}/`)
  setMetaByProperty("og:image", ogImage)
  setMetaByProperty("og:image:alt", opts.title)

  setMetaByName("twitter:card", "summary_large_image")
  setMetaByName("twitter:title", opts.title)
  setMetaByName("twitter:description", opts.description)
  setMetaByName("twitter:image", ogImage)

  setCanonical(`${SITE_ORIGIN}/`)
}

export function applyTrackerSeo() {
  const title = "Live march tracker | Pak-Palestine Forum (PPF)"
  const description =
    "Follow live march location updates for Pakistanis March for Gaza — peaceful solidarity with Palestine, organized by Pak-Palestine Forum."
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH)

  document.title = title
  const meta = document.getElementById("meta-description") as HTMLMetaElement | null
  if (meta) meta.content = description

  setMetaByProperty("og:type", "website")
  setMetaByProperty("og:title", title)
  setMetaByProperty("og:description", description)
  setMetaByProperty("og:url", `${SITE_ORIGIN}/tracker`)
  setMetaByProperty("og:image", ogImage)
  setMetaByProperty("og:image:alt", title)

  setMetaByName("twitter:card", "summary_large_image")
  setMetaByName("twitter:title", title)
  setMetaByName("twitter:description", description)
  setMetaByName("twitter:image", ogImage)

  setCanonical(`${SITE_ORIGIN}/tracker`)
}
