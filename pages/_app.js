import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Swap from '../components/Swap'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.css';

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

function MyApp({ Component, pageProps }) {

  <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
  />

  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <NotificationProvider>
        <Navbar />
        <Swap />
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp
