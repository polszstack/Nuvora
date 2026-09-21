import Image from "next/image";
import Link from "next/link";
import { StoreHeader } from "@/components/store-header";

// Swap this path with any image added to public/images to replace the story image.
const storyImage = "/images/Gemini_Generated_Image_9dgstw9dgstw9dgs.jpg";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#1e2a27]">
      <StoreHeader />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:pt-16">
        <div>
          <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#6b837a]">
            <span className="h-px w-8 bg-[#e58d61]" /> Our story
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.04] sm:text-7xl">
            Less, but <em className="font-serif font-normal text-[#e58d61]">better.</em> Always.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#6d7975]">
            Nuvora began with a simple idea: the things we live with should feel
            as considered as the way we want to live.
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#dceae3]">
          <Image
            src={storyImage}
            alt="A collection of thoughtfully selected Nuvora goods"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-[#e8e7e2] bg-white px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-4xl gap-10 text-lg leading-8 text-[#6e7d75] md:grid-cols-2">
          <p>
            We work with independent makers who care about materials, process,
            and the small details that make an object worth keeping. Every
            piece is chosen to be useful, beautiful, and made to stay with you.
          </p>
          <p>
            There is no endless scroll here and no pressure to buy more. Just a
            slower, more thoughtful edit of everyday goods for the spaces and
            rituals that matter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">
          The Nuvora standard
        </p>
        <h2 className="max-w-2xl text-4xl font-semibold leading-tight">
          Thoughtful objects for a slower life.
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-[#6e7d75]">
          From the first sketch to the final delivery, we look for honest
          materials, lasting design, and makers who put care into their work.
          That is what makes something earn its place in your home.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-[#1e2a27] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e58d61]"
        >
          Explore the collection
        </Link>
      </section>
    </main>
  );
}
