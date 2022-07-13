import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
    return <div>
      <script src="/utilities.js" async />
      <Component {...pageProps} />
      <footer className="footer">
        <Link href="/">&lt;-- Back</Link>
      </footer>
    </div>
}

export default MyApp
