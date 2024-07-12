import Head from "next/head";
import React from "react";
import { Navbar } from "components/Navbar";
import { LayoutProps } from "models";

export const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Poker Online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <Navbar />
        <section className="flex flex-col max-w-6xl mx-auto h-full">
          <section className="px-5 md:px-0 h-3/4">{children}</section>
          <footer className="flex items-end h-full pb-3">
            Develop by AguzzDev
          </footer>
        </section>
      </>
    </>
  );
};
