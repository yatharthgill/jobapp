import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { AuroraBackground } from "./ui/aurora-background";
import { BackgroundGradient } from "./ui/background-gradient";
import { FloatingDock } from "./ui/floating-dock";
import { IconBrandGithub, IconBrandX, IconExchange, IconHome, IconNewSection, IconTerminal2 } from "@tabler/icons-react";

const BrandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-black"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

// --- Main Footer Component ---
export default function Footer() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 30, mass: 1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.4,
      },
    },
  };

const links = [
    {
        title: "Twitter",
        icon: (
            <IconBrandX className="h-full w-full text-neutral-500 " />
        ),
        href: "/",
    },
    {
        title: "GitHub",
        icon: (
            <IconBrandGithub className="h-full w-full text-neutral-500 " />
        ),
        href: "/",
    },
    {
        title: "Facebook",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-neutral-500 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
        href: "/",
    },
    {
        title: "Instagram",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-neutral-500 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
        ),
        href: "/",
    },
];

  return (
    <footer className="w-full">
      <AuroraBackground>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 w-full"
        >
          <div className="w-full  mx-auto relative z-10 p-8 md:p-10 lg:p-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Section: Brand and Newsletter */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                  <BrandIcon />
                  <span className="text-xl font-bold text-black">JobApp.</span>
                </div>
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Crafting digital experiences that inspire and innovate.
                </p>
                <BackgroundGradient
                  containerClassName="rounded-full"
                  className="w-full max-w-xs"
                >
                  <form className="p-[2px] rounded-full bg-white flex items-center">
                    <input
                      type="email"
                      placeholder="Subscribe to newsletter"
                      className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none px-4 py-2 rounded-full"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors duration-300"
                    >
                      Go
                    </button>
                  </form>
                </BackgroundGradient>
              </div>

              {/* Center Section: Quick Links */}
              <motion.div
                className="flex flex-col items-center md:items-start gap-4"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-black">Quick Links</h3>
                <ul className="space-y-2 text-center md:text-left">
                  {["Home", "About Us", "Services", "Portfolio", "Contact"].map(
                    (link) => (
                      <motion.li key={link} variants={listItemVariants}>
                        <motion.a
                          href="#"
                          className="text-gray-600 hover:text-black transition-colors duration-300 block"
                          whileHover={{ scale: 1.05, x: 2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {link}
                        </motion.a>
                      </motion.li>
                    )
                  )}
                </ul>
              </motion.div>

              {/* Right Section: Socials */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <h3 className="font-semibold text-black">Follow Us</h3>
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Join our community on social media.
                </p>
                <div >
                  <FloatingDock
                    mobileClassName="translate-y-10"
                    items={links}
                  />
                </div>

              </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="mt-8 pt-8 border-t border-black/10 text-center text-gray-500 text-sm">
              <p>
                &copy; {new Date().getFullYear()} JobApp. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </AuroraBackground>
    </footer>
  );
}

