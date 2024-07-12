import { LayoutProps } from "models";
import Head from "next/head";
import React from "react";

export const LayoutWithoutNavbar = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Poker Online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <section className="flex flex-col max-w-6xl mx-auto h-full">
          <section className="px-5 md:px-0 h-3/4 bg-red-300">
            {children}
          </section>
          <footer className="flex items-end h-full pb-3 z-50">
            Develop by AguzzDev
          </footer>
        </section>
      </>
    </>
  );
};
