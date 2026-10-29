import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/home/Reveal";

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
        <Reveal className="grid gap-6 border-b border-border pb-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services-title" className="mt-4 max-w-[16ch] text-3xl font-semibold leading-tight tracking-[-0.04em] text-text sm:text-5xl">
              Useful technology, without the extra complexity.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-text-muted">
            We work with businesses to improve everyday operations, connect existing systems, and build digital products around real needs.
          </p>
        </Reveal>

        <div className="mt-2 grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} staggerIndex={Math.min(index, 4)} className="h-full">
              <Link
                href="/#contact"
                aria-label={`Discuss ${service.title} with Vectis`}
                className="service-card group flex h-full min-h-40 flex-col border-b border-border py-7 transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 active:translate-y-0 sm:py-8"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold tracking-[-0.02em] text-text">{service.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true" />
                </span>
                <span className="mt-3 block max-w-[42ch] text-sm leading-6 text-text-muted">{service.description}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
