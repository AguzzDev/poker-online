import Image from "next/image";
import Link from "next/link";
import { ButtonOne } from "components/Button/ButtonOne";
import { Layout } from "components/Layout/Layout";
import { links } from "utils/links";
import { motion } from "framer-motion";

export const LandingPage = () => {
  return (
    <Layout>
      <section className="h-screen screenWidth mt-10 pb-5">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="flex justify-between relative"
        >
          <div className="flex-col space-y-8 w-full sm:w-[65%] md:w-[70%] lg:w-3/4">
            <h1>
              Ultimate Poker
              <br />
              Showdown
            </h1>
            <h5 className="w-3/4 lg:w-7/12">
              Join the ultimate online multiplayer poker experience. Play,
              compete, and showcase your skills in every hand.
            </h5>
            <div className="w-2/4 lg:w-1/4">
              <Link href={links.auth} passHref>
                <a>
                  <ButtonOne style="w-full">Play</ButtonOne>
                </a>
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex flex-1">
            <div className="relative w-full h-full scale-125 translate-y-8 md:translate-y-14 lg:translate-y-16 xl:translate-y-20 -translate-x-5 sm:-translate-x-0 md:-translate-x-14 lg:-translate-x-16 xl:-translate-x-20">
              <Image
                src="/cardsLanding.png"
                objectFit="contain"
                layout="fill"
                alt="Cards Image"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="h-full relative">
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 lg:top-10 left-0 w-full h-2/4"
        >
          <Image
            src="/EllipseLanding.png"
            layout="fill"
            alt="Ellipse Image"
            priority
          />
        </motion.div>

        <div className="absolute top-44 inset-0 bg-black1">
          <div className="screenWidth">
            {/* <h1 className="text-center">More</h1> */}
          </div>
        </div>
      </section>
    </Layout>
  );
};
