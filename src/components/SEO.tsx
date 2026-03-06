import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path: string;
}

const SEO = ({ title, description, path }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", `https://clearwaycarhire.ie${path}`, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://clearwaycarhire.ie${path}`);
  }, [title, description, path]);

  return null;
};

export default SEO;
