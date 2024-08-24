import { Metatags } from "components/Metatags";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id='${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}')`,
          }}
        />
        <link rel="shortcut icon" href="/Logo.png" />
        <Metatags />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
