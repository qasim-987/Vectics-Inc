export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  statusBadge: "Live" | "In development";
  headline: string;
  shortDesc: string;
  fullDesc: string;
  pillars?: {
    title: string;
    description: string;
  }[];
  questionsAnswered?: string[];
  studioOutputs?: {
    title: string;
    description: string;
  }[];
}

export interface ClientStory {
  id: string;
  officeNumber: string;
  clientName: string;
  businessType: string;
  narrative: string;
  quote: string;
  quoteAuthor: string;
  fieldPhotos: {
    label: string;
    caption: string;
  }[];
  dailyMetrics: {
    label: string;
    value: string;
  }[];
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: "RouteCore" | "Vectis Inc." | "PulseGrid";
  categoryBadge: "Product" | "Company" | "In development";
  excerpt: string;
  readingTime: string;
  publishedDate: string;
  body: string[];
}

export const siteMeta = {
  name: "Vectis Inc.",
  wordmark: "Vectis",
  legalName: "Vectis Operations Inc.",
  tagline: "Software for the work that moves the world.",
  description: "Vectis Inc. builds focused software for operational businesses. Explore RouteCore, live distributor software, and PulseGrid and Vectis Studio in development.",
  email: "hello@vectisoperations.tech",
  location: "Rawalpindi • London • Remote",
};

export const productsData: ProductItem[] = [
  {
    id: "routecore",
    name: "RouteCore",
    slug: "distributionlife",
    statusBadge: "Live",
    headline: "One system for the office: collections, stock, deposits, and daily close.",
    shortDesc: "Windows desktop software for distributor offices. Track route collections, inventory, shops, bank deposits and cash, then print the close-of-day summary.",
    fullDesc: "RouteCore is built where the work happens. Independent distributor offices use RouteCore to keep a single, uncompromised operating record of each day's inventory loadouts, driver returns, partial shop payments, bank slips, and reconciled cash drawer totals.",
    pillars: [
      {
        title: "Inventory and load-outs",
        description: "Know what left the warehouse bay, what is on each vehicle, and what returned unsold before closing the ledger."
      },
      {
        title: "Route collections and driver records",
        description: "Track driver accounts, daily shop stops, credit balances, and cash handed in at the end of the shift."
      },
      {
        title: "Shops, credit and balances",
        description: "Maintain accurate accounts for hundreds of retail shops with partial collection history and credit limits."
      },
      {
        title: "Bank deposits and treasury",
        description: "Match morning cash collections with afternoon bank deposit slips, tracking bank charges and branch slips."
      },
      {
        title: "Cash reconciliation and the daily record",
        description: "Reconcile the day's total collections against physical cash, creating an indisputable operating record ready to print."
      }
    ]
  },
  {
    id: "pulsegrid",
    name: "PulseGrid",
    slug: "nano",
    statusBadge: "In development",
    headline: "Market intelligence for distributors: demand, price, and mix signals.",
    shortDesc: "PulseGrid is in development at Vectis Inc.: market intelligence for distributors, exploring demand, pricing and product mix to support daily inventory decisions.",
    fullDesc: "The market is already speaking through daily shop purchases. PulseGrid reads pattern shifts across retail routes—identifying which SKUs are accelerating, where gross margin is leaking, and exactly what should go on the next delivery truck.",
    questionsAnswered: [
      "What is actually moving across each retail territory?",
      "Where is unit margin holding, and where is credit erosion leaking capital?",
      "What exact product mix should be ordered for next week's inventory replenishment?",
      "Which retail clusters are expanding, and which shops are stalling?"
    ]
  },
  {
    id: "vectis-studio",
    name: "Vectis Studio",
    slug: "studio",
    statusBadge: "In development",
    headline: "Turning operational workflows into working software prototypes.",
    shortDesc: "Vectis Studio is in development: a tool for turning operational workflows into early software prototypes that teams can preview, discuss and refine together.",
    fullDesc: "Software starts with understanding the work. Vectis Studio allows operational managers to describe physical shop, warehouse, or fleet workflows and instantly generate tactile interface prototypes before committing to production builds.",
    studioOutputs: [
      {
        title: "Sites",
        description: "Public distributor portals, catalog showcases, and customer account access points."
      },
      {
        title: "Boards",
        description: "Operational dispatch boards, dispatch queue views, and dock scheduling interfaces."
      },
      {
        title: "Operational tools",
        description: "Focused utilities for handheld barcode audit counts, reconciliation tally sheets, and route auditing."
      }
    ]
  }
];

export const clientStories: ClientStory[] = [
  {
    id: "khyber-beverage",
    officeNumber: "Office 01",
    clientName: "Khyber Beverage Logistics",
    businessType: "Independent distributor of regional beverages & packaged goods",
    narrative: "Operating 18 delivery routes across congested urban commercial zones. The office uses RouteCore every morning for driver stock load-outs and every evening for credit collections reconciliation.",
    quote: "Before RouteCore, our evening close took four hours of handwritten ledgers and dispute checks. Today, driver accounts reconcile in thirty minutes, and our daily summary prints cleanly before 7 PM.",
    quoteAuthor: "Tariq Mahmood, Managing Director",
    fieldPhotos: [
      { label: "Field · 01", caption: "Warehouse loading bay at 5:30 AM before route dispatch" },
      { label: "Field · 02", caption: "Driver collection slip reconciliation desk" }
    ],
    dailyMetrics: [
      { label: "Active Routes", value: "18" },
      { label: "Daily Retail Accounts", value: "480+" },
      { label: "Reconciliation Speed", value: "30 min" }
    ]
  },
  {
    id: "indus-valley",
    officeNumber: "Office 02",
    clientName: "Indus Valley Wholesale",
    businessType: "High-volume FMCG, dry goods & staple provisions distributor",
    narrative: "Managing hundreds of small grocers with complex partial credit arrangements. RouteCore tracks shop balances down to the single rupee with verifiable transaction histories.",
    quote: "When dealing with hundreds of small retail kiosks, unrecorded credit is where margin bleeds. RouteCore gives our cashiers an absolute daily truth that drivers and shop owners both trust.",
    quoteAuthor: "Zainab Al-Hassan, Head of Accounts",
    fieldPhotos: [
      { label: "Field · 03", caption: "Cash reconciliation drawer and bank slip registry" },
      { label: "Field · 04", caption: "Warehouse pallet storage and inventory staging" }
    ],
    dailyMetrics: [
      { label: "Active Retail Shops", value: "720" },
      { label: "Credit Tracking Accuracy", value: "99.9%" },
      { label: "Daily Close SLA", value: "100%" }
    ]
  },
  {
    id: "atlas-route",
    officeNumber: "Office 03",
    clientName: "Atlas Route Traders",
    businessType: "Multi-depot ambient and temperature-controlled beverage distributor",
    narrative: "Managing two regional warehouses and a fleet of 24 refrigerated vans. RouteCore provides centralized visibility into load balances and cash treasury deposits across both offices.",
    quote: "The software doesn't try to reinvent operations with unnecessary cloud complications. It installs locally, boots instantly, and keeps working even when our warehouse internet drops.",
    quoteAuthor: "Farhan Qureshi, Operations Lead",
    fieldPhotos: [
      { label: "Field · 05", caption: "Depot morning briefing and dispatch manifest check" },
      { label: "Field · 06", caption: "Print station for close-of-day summary reports" }
    ],
    dailyMetrics: [
      { label: "Operating Depots", value: "2" },
      { label: "Fleet Vehicles", value: "24" },
      { label: "Offline Reliability", value: "100%" }
    ]
  },
  {
    id: "margalla-foods",
    officeNumber: "Office 04",
    clientName: "Margalla Food Services",
    businessType: "Commercial kitchen supply and institutional food delivery",
    narrative: "Supplying hospitality chains and institutional dining halls with strict delivery timeframes and weekly rolling statements generated from RouteCore records.",
    quote: "In institutional supply, billing errors destroy client trust. With RouteCore, every carton leaving the loading dock is tied to an itemized invoice that matches bank deposits.",
    quoteAuthor: "Khurram Shah, Finance Controller",
    fieldPhotos: [
      { label: "Field · 07", caption: "Staging dock carton verification at midday" },
      { label: "Field · 08", caption: "Daily treasury deposit folder ready for bank courier" }
    ],
    dailyMetrics: [
      { label: "Institutional Clients", value: "115" },
      { label: "Weekly Invoice Volume", value: "$180k+" },
      { label: "Billing Dispute Rate", value: "< 0.1%" }
    ]
  }
];

export const journalArticles: JournalArticle[] = [
  {
    id: "journal-1",
    slug: "whole-distribution-office-in-one-system",
    title: "The whole distribution office, in one system.",
    category: "RouteCore",
    categoryBadge: "Product",
    excerpt: "Why distribution businesses don't need sprawling web ERPs—they need a single, rock-solid desktop ledger that respects the messy reality of cash and stock.",
    readingTime: "5 min read",
    publishedDate: "October 2026",
    body: [
      "In a distribution office, theory meets reality at 6:00 PM. Drivers walk through the door with stacks of paper invoices, handfuls of cash notes, crossed-out delivery lines, and claims of broken cartons. Generic accounting software assumes every transaction occurs online with an instant credit card transaction. Real distribution operations do not work that way.",
      "We built RouteCore around this exact moment. Instead of forcing distributors into complex web workflows with continuous spinners, RouteCore operates natively on the desktop. It treats every operational day as an atomic unit: load-outs must equal sales plus returns; cash collections plus credit extensions must equal the total manifest; and bank deposit slips must tie the ledger to the physical vault.",
      "When software respects how businesses actually operate, workers don't fight the system—they rely on it to protect their business."
    ]
  },
  {
    id: "journal-2",
    slug: "software-that-holds-up-where-work-happens",
    title: "Software that has to hold up where the work actually happens.",
    category: "Vectis Inc.",
    categoryBadge: "Company",
    excerpt: "Building software for warehouse floors requires an engineering philosophy centered on durability, speed, and zero tolerance for data corruption.",
    readingTime: "6 min read",
    publishedDate: "September 2026",
    body: [
      "Most enterprise software is designed in air-conditioned tech offices for users sitting at dual-monitor desks with high-speed fiber internet. But the software that moves physical goods operates in environments with noisy diesel generators, dusty warehouse bays, fluctuating grid power, and intermittent network access.",
      "At Vectis Inc., our fundamental design principle is 'Reliable over impressive'. A feature that crashes once a month during end-of-day reconciliation is not an inconvenience—it halts the payroll of drivers and delays bank courier deposits. That is why our products prioritize local SQLite databases, zero-latency keyboard shortcuts, and deterministic data persistence.",
      "We measure our success not by venture capital headlines, but by the quiet satisfaction of a distributor printing their close-of-day summary and walking out of the office on time."
    ]
  },
  {
    id: "journal-3",
    slug: "reading-the-market-for-route-profitability",
    title: "Reading the market so the operation can stay profitable.",
    category: "PulseGrid",
    categoryBadge: "In development",
    excerpt: "How distributors can transform daily route delivery tallies into forward-looking intelligence on demand elasticity and product mix.",
    readingTime: "7 min read",
    publishedDate: "August 2026",
    body: [
      "A distributor's fleet is an antenna constantly gathering granular market intelligence. Every day, thousands of shop owners express their exact purchasing power: which soft drink sizes are stalling on the shelf, which snack flavors are accelerating, and where price increases are triggering substitution.",
      "Yet in most operations, this invaluable intelligence sits buried in paper close-of-day folders. PulseGrid is our in-development market intelligence layer that sits directly atop RouteCore's ledger. It continuously analyzes route purchase velocities without requiring manual data re-entry.",
      "By highlighting margin erosion and emerging SKU demand, PulseGrid empowers distributors to negotiate stronger terms with manufacturers and allocate fleet capacity where profit is highest."
    ]
  }
];

export const operationalPillars = [
  {
    phase: "Opening",
    title: "The warehouse before the list.",
    description: "Shutters, cartons, and the first count. Software starts here, on the concrete floor, not in an abstract pitch deck.",
    tag: "Field · 01"
  },
  {
    phase: "Route",
    title: "The work already moving.",
    description: "A route is a daily promise across town. Stock in the back, shops along the way, traffic in between.",
    tag: "Field · 02"
  },
  {
    phase: "Ledger",
    title: "Paper still in the day.",
    description: "Receipts, counterfoil slips, crossed-out lines. Systems have to meet the day where it is, not where software designers wish it was.",
    tag: "Field · 03"
  },
  {
    phase: "Balance",
    title: "The office after the last return.",
    description: "When the drivers return, collections, bank deposit slips, and stock return totals reconcile into one day's undeniable truth.",
    tag: "Field · 04"
  }
];

export const principles = [
  {
    num: "01",
    name: "Simple",
    headline: "Simple over clever.",
    desc: "Complex operational systems should feel intuitive. We eliminate gratuitous UI clutter so floor operators can move with velocity."
  },
  {
    num: "02",
    name: "Practical",
    headline: "Practical over perfect.",
    desc: "We solve real physical bottlenecks rather than theoretical edge cases. If it doesn't help close the operating day, we don't build it."
  },
  {
    num: "03",
    name: "Reliable",
    headline: "Reliable over impressive.",
    desc: "Software people can depend on every single day without fear of server downtime, data corruption, or sluggish latency."
  },
  {
    num: "04",
    name: "Continuous",
    headline: "Continuous over finished.",
    desc: "We build lasting partnerships. We refine and improve our tools side-by-side with the distributors who use them."
  }
];

export const processSteps = [
  { num: "01", name: "Observe", desc: "We spend time on the warehouse floor and on delivery routes to map real operational friction." },
  { num: "02", name: "Map", desc: "We translate messy physical handoffs into clear, deterministic data models and ledger workflows." },
  { num: "03", name: "Build", desc: "We write fast, native, resilient software engineered to withstand poor connectivity and heavy load." },
  { num: "04", name: "Use", desc: "We deploy directly with office cashiers, dispatchers, and managers during live operating days." },
  { num: "05", name: "Improve", desc: "We gather ongoing floor feedback to harden the system and eliminate friction on every update." }
];
