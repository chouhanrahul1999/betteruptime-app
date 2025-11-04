import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-cover bg-center bg-[url('https://betterstack.com/assets/v2/homepage-v3/hero-bg-86dc9b29.jpg')]">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center items-center gap-2">
          <img
            src="https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp"
            alt="Better Stack"
            className="w-8 h-8"
          />
          <span className="text-white text-lg font-semibold">Better Stack</span>
        </div>

        <h1 className="text-white font-inter text-6xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          See everything.
          <br />
          Fix anything.
        </h1>

        <p className="text-gray-400 text-lg md:text-lg max-w-2xl mx-auto mb-12">
          AI-native platform for on-call and incident response with effortless
          monitoring, status pages, tracing, infrastructure monitoring and log
          management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-8">
          <Input
            type="email"
            placeholder="Your work e-mail"
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 h-13 w-80 text-base"
          />
          <Link href={"/signup"}>
            <Button
              variant={"default"}
              className="h-13 px-8 rounded-xl whitespace-nowrap"
            >
              Start for free
            </Button>
          </Link>
        </div>

        <p className="text-gray-500 text-medium text-cent">
          Looking for an enterprise solution?{" "}
          <a href="#" className="text-white underline hover:no-underline">
            Book a demo
          </a>
        </p>
      </div>
    </section>
  );
}
