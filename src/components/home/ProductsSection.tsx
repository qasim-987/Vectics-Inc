const services = [
  {
    title: "AI business automation",
    description: "Reduce repetitive work by connecting the tools and tasks your team already relies on.",
  },
  {
    title: "AI agents",
    description: "Build focused assistants that help staff find information, handle routine requests, and complete defined tasks.",
  },
  {
    title: "Custom websites",
    description: "Create clear, accessible websites that explain your business and make it easy for customers to take the next step.",
  },
  {
    title: "Web apps",
    description: "Bring essential business workflows into secure, easy-to-use applications that work across devices.",
  },
  {
    title: "Dashboards & analytics",
    description: "Bring key business information together so your team can understand activity and make informed decisions.",
  },
  {
    title: "Internal tools",
    description: "Replace scattered spreadsheets and manual processes with tools shaped around the way your team works.",
  },
  {
    title: "API integrations",
    description: "Connect the systems you use to reduce duplicate entry and keep important information in sync.",
  },
];

export default function ProductsSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="border-y border-border bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        <div className="grid gap-6 border-b border-border pb-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services-title" className="mt-4 max-w-[16ch] text-3xl font-semibold leading-tight tracking-[-0.04em] text-text sm:text-5xl">
              Useful technology, without the extra complexity.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-text-muted">
            We work with businesses to improve everyday operations, connect existing systems, and build digital products around real needs.
          </p>
        </div>

        <div className="mt-2 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="border-b border-border py-7 sm:py-8">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-text">{service.title}</h3>
              <p className="mt-3 max-w-[42ch] text-sm leading-6 text-text-muted">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
