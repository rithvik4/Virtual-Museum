type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center px-6 py-16">
      <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-museum-gold">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{description}</p>
      </div>
    </section>
  );
}