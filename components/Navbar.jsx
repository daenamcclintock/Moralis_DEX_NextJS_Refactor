import { ConnectButton } from "web3uikit"
import Link from "next/link"

const Metamask = "../public/Metamask.png"

const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Decentralized Exchange</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
            </ul>
            <button id="login_button" class="btn btn-primary my-2 my-sm-0" type="submit">Sign in with Metamask</button>
            <img id="metamask_logo" src={Metamask} height="50rem" width="50rem"/>
        </div>
      </nav>
    )
}

export default Navbar