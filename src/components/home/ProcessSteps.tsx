import Reveal from "@/components/home/Reveal";

const approach = [
  {
    title: "Understand the work",
    description: "We learn how your team works today, where time is lost, and what a better outcome needs to look like.",
  },
  {
    title: "Agree on a clear scope",
    description: "Together, we define a practical first release, the right technical approach, and how we will know it is useful.",
  },
  {
    title: "Build and test",
    description: "We develop the solution in reviewable pieces, check it against real workflows, and make adjustments as we go.",
  },
  {
    title: "Support real use",
    description: "We help your team put the software to work and can continue improving it as your needs change.",
  },
];

export default function ProcessSteps() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        <Reveal className="grid gap-6 border-b border-border pb-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] md:items-end md:gap-12">
          <div>
            <p className="eyebrow">Our approach</p>
            <h2 id="approach-title" className="mt-4 max-w-[14ch] text-3xl font-semibold leading-tight tracking-[-0.04em] text-text sm:text-5xl">
              Start with the problem. Build for the people doing the work.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-text-muted">
            Straightforward collaboration keeps the project focused, the decisions clear, and the result grounded in how your business operates.
          </p>
        </Reveal>

        <div className="mt-2 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((item, index) => (
            <Reveal key={item.title} staggerIndex={index} className="h-full">
              <article className="h-full border-b border-border py-7 sm:py-8">
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
