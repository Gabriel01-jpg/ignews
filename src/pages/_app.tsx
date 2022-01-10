import '../styles/global.scss'

import { AppProps } from 'next/app'
import { Header } from "../components/Header";
import { Provider as NextAuProvider } from 'next-auth/client'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <NextAuProvider session={pageProps.session}>
          <Header />
          <Component {...pageProps} />
      </NextAuProvider>
  );
} 