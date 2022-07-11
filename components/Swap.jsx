import Moralis from "moralis"

const Swap = () => {

    /** Connect to Moralis server */
const serverUrl = "https://zszvwhvkt9vz.usemoralis.com:2053/server";
const appId = "gWAfANE8Xv9Fkt9IRBXeKy2jJNQUSpshS1U1jlsF";

let currentTrade = {};
let currentSelectSide;
let tokens;

async function init() {
  await Moralis.start({ serverUrl, appId });
  await Moralis.enableWeb3();
  await listAvailableTokens();
  let currentUser = Moralis.User.current();
  if (currentUser) {
    document.getElementById("swap_button").disabled = false;
  }
}

async function listAvailableTokens() {
  const result = await Moralis.Plugins.oneInch.getSupportedTokens({
    chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
  });
  tokens = result.tokens;
  let parent = document.getElementById("token_list");
  for (const address in tokens) {
    let token = tokens[address];
    let div = document.createElement("div");
    div.setAttribute("data-address", address);
    div.className = "token_row";
    let html = `
        <img class="token_list_img" src="${token.logoURI}">
        <span class="token_list_text">${token.symbol}</span>
        `;
    div.innerHTML = html;
    div.onclick = () => {
      selectToken(address);
    };
    parent.appendChild(div);
  }
}

function selectToken(address) {
  closeModal();
  console.log(tokens);
  currentTrade[currentSelectSide] = tokens[address];
  console.log(currentTrade);
  renderInterface();
  getQuote();
}

function renderInterface() {
  if (currentTrade.from) {
    // document.getElementById("from_token_img").src = currentTrade.from.logoURI;
    // document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
  }
  if (currentTrade.to) {
    // document.getElementById("to_token_img").src = currentTrade.to.logoURI;
    // document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
  }
}

async function login() {
  try {
    currentUser = Moralis.User.current();
    if (!currentUser) {
      currentUser = await Moralis.authenticate();
    }
    // document.getElementById("swap_button").disabled = false;
    // document.getElementById("login_button").remove()
    // document.getElementById("metamask_logo").remove()
  } catch (error) {
    console.log(error);
  }
}

function openModal(side) {
  currentSelectSide = side;
//   document.getElementById("token_modal").style.display = "block";
}
function closeModal() {
//   document.getElementById("token_modal").style.display = "none";
}

async function getQuote() {
  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;

  let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);

  const quote = await Moralis.Plugins.oneInch.quote({
    chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress: currentTrade.from.address, // The token you want to swap
    toTokenAddress: currentTrade.to.address, // The token you want to receive
    amount: amount,
  });
  console.log(quote);
//   document.getElementById("gas_estimate").innerHTML = quote.estimatedGas;
//   document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** quote.toToken.decimals;
}

async function trySwap() {
  let address = Moralis.User.current().get("ethAddress");
  let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  if (currentTrade.from.symbol !== "ETH") {
    const allowance = await Moralis.Plugins.oneInch.hasAllowance({
      chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: currentTrade.from.address, // The token you want to swap
      fromAddress: address, // Your wallet address
      amount: amount,
    });
    console.log(allowance);
    if (!allowance) {
      await Moralis.Plugins.oneInch.approve({
        chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
        tokenAddress: currentTrade.from.address, // The token you want to swap
        fromAddress: address, // Your wallet address
      });
    }
  }
  try {
    let receipt = await doSwap(address, amount);
    alert("Swap Complete");
    console.log(`Swap Complete! Swap receipt: ${receipt}`)
  } catch (error) {
    console.log(error);
  }
}

function doSwap(userAddress, amount) {
  return Moralis.Plugins.oneInch.swap({
    chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress: currentTrade.from.address, // The token you want to swap
    toTokenAddress: currentTrade.to.address, // The token you want to receive
    amount: amount,
    fromAddress: userAddress, // Your wallet address
    slippage: 1,
  });
}

init();

// document.getElementById("modal_close").onclick = closeModal;
// document.getElementById("from_token_select").onclick = () => {
//   openModal("from");
// };
// document.getElementById("to_token_select").onclick = () => {
//   openModal("to");
// };
// document.getElementById("login_button").onclick = login;
// document.getElementById("from_amount").onblur = getQuote;
// document.getElementById("swap_button").onclick = trySwap;

    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col col-md-6 offset-md-3" id="window">
                        <h4>Swap</h4>
                        <div id="form">
                            <div class="swapbox">
                                <div class="swapbox_select token_select" id="from_token_select">
                                    <img class="token_image" id="from_token_img"/>
                                    <span id="from_token_text"></span>
                                </div>
                                <div class="swapbox_select">
                                    <input class="number form-control" placeholder="amount" id="from_amount"/>
                                </div>
                            </div>
                            <div class="swapbox">
                                <div class="swapbox_select token_select"  id="to_token_select">
                                    <img class="token_image" id="to_token_img"/>
                                    <span id="to_token_text"></span>
                                </div>
                                <div class="swapbox_select">
                                    <input class="number form-control" placeholder="amount" id="to_amount"/>
                                </div>
                            </div>
                            <div>Estimated Gas: <span id="gas_estimate"></span></div>
                            <button disabled class="btn btn-large btn-primary btn-block" id="swap_button">
                                Swap Asset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal" id="token_modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Select token</h5>
                            <button id="modal_close" type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div id="token_list"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Swap