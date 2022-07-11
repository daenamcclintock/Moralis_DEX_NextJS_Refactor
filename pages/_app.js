import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <NotificationProvider>
        <Navbar />
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>

    
  )
}

export default MyApp
