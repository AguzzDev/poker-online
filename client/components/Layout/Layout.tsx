import Head from "next/head";
import React from "react";
import { Navbar } from "components/Navbar";
import {
  FooterTypeEnum,
  LayoutProps,
  LayoutTypeEnum,
  NavbarTypeEnum,
} from "models";
import { Footer } from "components/Footer/Footer";

export const Layout = ({
  title,
  children,
  type = LayoutTypeEnum.default,
  navType = NavbarTypeEnum.default,
}: LayoutProps) => {
  let body = null;

  if (type === LayoutTypeEnum.empty) {
    body = (
      <section className="min-h-screen relative bg-bg">
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        <section className="absolute inset-0 z-10 h-full">{children}</section>
      </section>
    );
  } else if (type === LayoutTypeEnum.withoutFooter) {
    body = (
      <section className="min-h-screen relative bg-bg">
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        <section className="absolute inset-0 z-10 h-full screenWidth">
          <Navbar type={navType} />
          {children}
        </section>
      </section>
    );
  } else if (type === LayoutTypeEnum.app) {
    body = (
      <section className="min-h-screen relative bg-bg">
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        <section className="flex flex-col w-full h-full absolute inset-0 z-10 overflow-hidden">
          <section className="appScreenWidth">
            <Navbar type={navType} />
          </section>
          <section className="flex-1 overflow-hidden appScreenWidth mb-5">
            {children}
          </section>
          <Footer type={FooterTypeEnum.app} />
        </section>
      </section>
    );
  } else if (type === LayoutTypeEnum.appRoom) {
    body = (
      <section className="min-h-screen relative bg-bg">
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        <section className="flex flex-col w-full h-full absolute inset-0 z-10 overflow-hidden appScreenWidth">
          <Navbar type={navType} />

          <section className="flex-1 overflow-hidden mb-5">{children}</section>
        </section>
      </section>
    );
  } else {
    body = (
      <section className="min-h-[200vh] relative bg-landing">
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        <section className="flex flex-col absolute inset-0 z-10 h-full">
          <section className="screenWidth">
            <Navbar type={navType} />
          </section>

          {children}

          <Footer />
        </section>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Poker Online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {body}
    </>
  );
};
