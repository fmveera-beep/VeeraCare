import type { InsightSection } from "@/lib/insights/posts";

export function InsightsArticleProse({ sections }: { sections: InsightSection[] }) {
  return (
    <div className="insights-prose mx-auto max-w-[720px]">
      {sections.map((section, i) => (
        <section key={i} className={i > 0 ? "mt-10 md:mt-12" : undefined}>
          {section.heading ? (
            <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
              {section.heading}
            </h2>
          ) : null}
          <div className={section.heading ? "mt-4 space-y-4" : "space-y-4"}>
            {section.paragraphs.map((p, j) => (
              <p
                key={j}
                className="text-base leading-[1.75] text-neutral-700 md:text-[1.05rem]"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
