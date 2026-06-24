// ============================================================================
// SNUSII V2 — JSON-LD Structured Data Components
// Inject server-side into <head> for search engine crawling.
// ============================================================================

import { Product } from "@/types";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

// ─── Script Tag Renderer ────────────────────────────────────────────────────

interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

export function JsonLdScript({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Product Schema (Google Shopping / Rich Results) ────────────────────────

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand_name,
      url: `${SITE_URL}/brands/${product.brand_slug}`,
    },
    category: product.category_name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "EGP",
      price: product.price.toFixed(2),
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "EG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: {
          "@type": "ReturnMethod",
          url: `${SITE_URL}/returns`,
        },
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "EG",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 6,
            unitCode: "DAY",
          },
        },
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Nicotine Strength",
        value: `${product.strength} mg/g`,
        unitText: "mg/g",
      },
      {
        "@type": "PropertyValue",
        name: "Flavor",
        value: product.flavor,
      },
      {
        "@type": "PropertyValue",
        name: "Pouches Per Can",
        value: product.can_count,
        unitCode: "C62",
      },
      {
        "@type": "PropertyValue",
        name: "Tobacco-Free",
        value: true,
      },
      {
        "@type": "PropertyValue",
        name: "Age Restriction",
        value: "21+",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 42,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return <JsonLdScript id={`product-${product.slug}`} data={schema} />;
}

// ─── Organization Schema (root layout) ───────────────────────────────────────

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Snusii Egypt",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Egypt's largest premium nicotine pouches e-commerce platform. 100% authentic White Fox, Siberia, and 77 products with fast delivery to all 27 governorates.",
    foundingDate: "2024",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 10,
      maxValue: 50,
    },
    sameAs: [
      "https://facebook.com/snusii.eg",
      "https://instagram.com/snusii.eg",
      "https://twitter.com/snusii_eg",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+20-1XXXXXXXXX",
      contactType: "customer service",
      areaServed: "EG",
      availableLanguage: ["Arabic", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
  };

  return <JsonLdScript id="organization" data={schema} />;
}

// ─── WebSite Schema (enables sitelinks search box) ────────────────────────

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLdScript id="website" data={schema} />;
}

// ─── BreadcrumbList Schema ──────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript id="breadcrumb" data={schema} />;
}

// ─── ItemList Schema (product listing pages) ────────────────────────────────

interface ItemListSchemaProps {
  name: string;
  url: string;
  products: Array<{
    name: string;
    slug: string;
    price: number;
    image: string;
    brand: string;
  }>;
}

export function ItemListSchema({ name, url, products }: ItemListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${SITE_URL}/products/${product.slug}`,
      image: product.image,
    })),
  };

  return <JsonLdScript id={`itemlist-${name.toLowerCase().replace(/\s+/g, "-")}`} data={schema} />;
}
