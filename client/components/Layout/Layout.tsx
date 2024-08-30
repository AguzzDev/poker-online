import React from "react";
import { Navbar } from "components/Navbar";
import {
  FooterTypeEnum,
  LayoutProps,
  LayoutTypeEnum,
  NavbarTypeEnum,
} from "models";
import { Footer } from "components/Footer/Footer";
import Image from "next/image";
import Logo from "public/Logo";
import Link from "next/link";
import LogoMobile from "public/LogoMobile";

export const Layout = ({
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
            <Navbar type={NavbarTypeEnum.app} />
          </section>
          <section className="flex-1 overflow-y-auto appScreenWidth mb-5">
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
  } else if (type === LayoutTypeEnum.form) {
    body = (
      <Layout type={LayoutTypeEnum.empty}>
        <section className="flex flex-col-reverse lg:flex-row h-full">
          <section className="flex-col flex-1 lg:w-[50vw] py-5 px-5 sm:px-10">
            <div className="h-[95%]">
              <Logo className="hidden sm:block" />
              <LogoMobile className="block sm:hidden" />

              <div className="mt-3 sm:mt-5">{children}</div>
            </div>

            <div className="flex items-end h-[5%]">Develop By AguzzDev</div>
          </section>

          <section className="h-1/4 lg:h-full lg:flex-1 relative rounded-b-[5%] md:rounded-l-[5%] overflow-hidden">
            <div className="absolute bottom-4 left-5 z-50">
              <p>
                Image by
                <span className="ml-1 text-accent">
                  <Link href="https://www.freepik.com/" passHref>
                    <a target="_blank" rel="noopener noreferrer">
                      Freepik
                    </a>
                  </Link>
                </span>
              </p>
            </div>
            <Image
              src="/authImage.jpg"
              layout="fill"
              alt="Auth Image"
              objectFit="cover"
            />
          </section>
        </section>
      </Layout>
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

  return body;
};
