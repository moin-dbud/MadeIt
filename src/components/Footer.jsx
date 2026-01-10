
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (

    <div className="relative w-full h-[100dvh] md:h-[70dvh]  2xl:h-[50dvh] ">

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[100dvh] md:h-[70dvh] 2xl:h-[50dvh]">
        <div className="h-full w-full">
          <div className="h-full max-w-[1536px] mx-auto flex flex-col justify-between items-center ">
            <footer className="w-full text-foreground px-8 py-8 md:py-12">
              <div className="w-full flex flex-col lg:flex-row md:justify-between md:items-start gap-10 md:gap-20">
                <div className="flex-1 flex flex-col gap-4 min-w-[220px]">
                  <img src="/logo.png" alt="MadeIt" className="h-8  w-8 scale-600 ml-7.5" />
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs md:max-w-sm">
                    MadeIt helps students finish real projects and turn their progress into proof-of-work portfolios.
                  </p>
                  <div className="flex gap-3 mt-2">
                    <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background rounded-lg p-2 hover:bg-primary/10 transition-colors" target="_blank">
                      <Twitter />
                    </a>
                    <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background rounded-lg p-2 hover:bg-primary/10 transition-colors" target="_blank">
                      <Github />
                    </a>
                  </div>
                </div>

                <div className="flex-1 flex-grow w-full grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 md:mt-0">
                  <div>
                    <h4 className="font-heading text-lg font-semibold mb-3">Company</h4>
                    <ul className="flex flex-col gap-2">
                      <li>
                        <a href="/about" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">About</a>
                      </li>
                      <li>
                        <a href="/contact-us" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Contact</a>
                      </li>
                      <li>
                        <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Careers</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold mb-3">Social</h4>
                    <ul className="flex flex-col gap-2">
                      <li>
                        <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Twitter</a>
                      </li>
                      <li>
                        <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline:none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">GitHub</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold mb-3">Resources</h4>
                    <ul className="flex flex-col gap-2">
                      <li>
                        <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Documentation</a>
                      </li>
                      <li>
                        <a href="/privacy-policy" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Privacy Policy</a>
                      </li>
                      <li>
                        <a href="#" className="inline-flex cursor-pointer gap-2 whitespace-nowrap rounded-md text-md font-medium duration-200 disabled:pointer-events-none disabled:opacity-50 text-gray-400 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground transition-all hover:underline underline-offset-4 decoration-primary">Terms of Service</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
            <div className="h-20 md:h-40 overflow-hidden flex items-center justify-center w-full relative">
              <h1 className="font-heading tracking-tighter text-[120px] sm:text-[200px] md:text-[275px] lg:text-[250px] font-bold bg-gradient-to-r from-white/40 to-muted text-transparent bg-clip-text transform:translateY(10%)">MadeIt</h1>
              <p className="absolute left-1/2 bottom-5 -translate-x-1/2 w-full text-center text-xs sm:text-sm text-muted-foreground z-10">© 2025 MadeIt. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
