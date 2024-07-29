import Image from "next/image";
import Link from "next/link";
import { ButtonOne } from "components/Button/ButtonOne";
import { Layout } from "components/Layout/Layout";

export const LandingPage = () => {
  return (
    <Layout>
      <section className="screenWidth mt-10 pb-5">
        <div className="flex justify-between relative">
          <div className="flex-col space-y-8 w-[65%] md:w-[70%] lg:w-3/4">
            <h1>Ultimate Poker Showdown</h1>
            <p className="w-3/4 lg:w-2/4">
              Join the ultimate online multiplayer poker experience. Play,
              compete, and showcase your skills in every hand.
            </p>
            <div className="w-2/4 lg:w-1/4">
              <Link href="/auth" passHref>
                <a className="block w-full">
                  <ButtonOne style="py-2 w-full">Play</ButtonOne>
                </a>
              </Link>
            </div>
          </div>

          <div className="flex flex-1">
            <div className="relative w-full h-full scale-125 -translate-x-5 sm:-translate-x-0 md:-translate-x-5">
              <Image
                src="/cardsLanding.png"
                objectFit="contain"
                layout="fill"
                alt="Cards Image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="h-full relative">
        <div className="absolute top-10 left-0 w-full h-2/4">
          <Image src="/EllipseLanding.png" layout="fill" alt="Ellipse Image" />
        </div>

        <div className="absolute top-40 inset-0 bg-black1">
          <div className="screenWidth">
            <h1 className="text-center">More</h1>
          </div>
        </div>
      </section>
    </Layout>
  );
};
