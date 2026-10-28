export interface SiteNavItem {
  label: string;
  href: string;
}

/** Shared between the primary navigation and the Explore footer column. */
export const primaryNavigation: SiteNavItem[] = [
  { label: "Products", href: "/#products" },
  { label: "Clients", href: "/clients" },
  { label: "Journal", href: "/journal" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/about" },
];

export const footerNavigation: SiteNavItem[] = [
  { label: "What we build", href: "/#what-we-build" },
  ...primaryNavigation,
  { label: "Contact", href: "/contact" },
];

export const parentCompany = {
  label: "Forza Inc.",
  href: "https://forzainc.tech/",
};
