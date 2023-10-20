import { getNetwork } from '@wagmi/core';

enum PayFeesIn {
    Native,
    LINK
  }
// Enumeración de Redes Admitidas
enum SupportedNetworks {
  ETHEREUM_SEPOLIA = 0,
  OPTIMISM_GOERLI = 1,
  AVALANCHE_FUJI = 2,
  ARBITRUM_GOERLI = 3,
  POLYGON_MUMBAI = 4,
  BSC_TESTNET = 5,
}

// Definición de las configuraciones de red
interface NetworkConfig {
  name: string;
  chainId: number;
  router: string;
  linkToken: string;
  wrappedNative: string;
  ccipBnM: string;
  ccipLnM: string;
}

// Configuraciones de red para cada red admitida
const networks: { [key in SupportedNetworks]: NetworkConfig } = {
  [SupportedNetworks.ETHEREUM_SEPOLIA]: {
    name: "Ethereum Sepolia",
    chainId: 16015286601757825753,
    router: "0xD0daae2231E9CB96b94C8512223533293C3693Bf",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    wrappedNative: "0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534",
    ccipBnM: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    ccipLnM: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
  },
  [SupportedNetworks.OPTIMISM_GOERLI]: {
    name: "Optimism Goerli",
    chainId: 2664363617261496610,
    router: "0xEB52E9Ae4A9Fb37172978642d4C141ef53876f26",
    linkToken: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
    wrappedNative: "0x4200000000000000000000000000000000000006",
    ccipBnM: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
    ccipLnM: "0x835833d556299CdEC623e7980e7369145b037591",
  },
  [SupportedNetworks.AVALANCHE_FUJI]: {
    name: "Avalanche Fuji",
    chainId: 14767482510784806043,
    router: "0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8",
    linkToken: "0x0b9d5d9136855f6FEc3c0993feE6E9CE8a297846",
    wrappedNative: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    ccipBnM: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
    ccipLnM: "0x70F5c5C40b873EA597776DA2C21929A8282A3b35",
  },
  [SupportedNetworks.ARBITRUM_GOERLI]: {
    name: "Arbitrum Goerli",
    chainId: 6101244977088475029,
    router: "0x88E492127709447A5ABEFdaB8788a15B4567589E",
    linkToken: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28",
    wrappedNative: "0x32d5D5978905d9c6c2D4C417F0E06Fe768a4FB5a",
    ccipBnM: "0x0579b4c1C8AcbfF13c6253f1B10d66896Bf399Ef",
    ccipLnM: "0x0E14dBe2c8e1121902208be173A3fb91Bb125CDB",
  },
  [SupportedNetworks.POLYGON_MUMBAI]: {
    name: "Polygon Mumbai",
    chainId: 12532609583862916517,
    router: "0x70499c328e1E2a3c41108bd3730F6670a44595D1",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    wrappedNative: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    ccipBnM: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
    ccipLnM: "0xc1c76a8c5bFDE1Be034bbcD930c668726E7C1987",
  },
  [SupportedNetworks.BSC_TESTNET]: {
    name: "BSC Testnet",
    chainId: 97, // TODO: Agregar el chain ID correcto para BSC Testnet
    router: "0xYourBSCTestnetRouterAddress", // TODO: Agregar la dirección del router para BSC Testnet
    linkToken: "0xYourBSCTestnetLinkAddress", // TODO: Agregar la dirección de LINK para BSC Testnet
    wrappedNative: "0xYourBSCTestnetWETHAddress", // TODO: Agregar la dirección de WETH para BSC Testnet
    ccipBnM: "0xYourBSCTestnetCCIPBnMAddress", // TODO: Agregar la dirección de CCIP-BnM para BSC Testnet
    ccipLnM: "0xYourBSCTestnetCCIPLnMAddress", // TODO: Agregar la dirección de CCIP-LnM para BSC Testnet
  },
};

// Obtener el ID de la cadena
const getChainId = (network: SupportedNetworks) => {
  return networks[network].chainId;
};

// Obtener direcciones del enrutador
const getRouterAddress = (network: SupportedNetworks) => {
  return networks[network].router;
};

// Obtener direcciones de LINK
const getLinkAddress = (network: SupportedNetworks) => {
  return networks[network].linkToken;
};

// Obtener direcciones de WETH
const getWrappedNativeAddress = (network: SupportedNetworks) => {
  return networks[network].wrappedNative;
};

// Obtener direcciones de CCIP-BnM
const getCCIPBnMAddress = (network: SupportedNetworks) => {
  return networks[network].ccipBnM;
};

// Obtener direcciones de CCIP-LnM
const getCCIPLnMAddress = (network: SupportedNetworks) => {
  return networks[network].ccipLnM;
};

// Obtener el índice de cadena
const getChainIndex = (chainName: string) => {
  for (const network in SupportedNetworks) {
    if (SupportedNetworks[network] === chainName) {
      return Number(SupportedNetworks[network]);
    }
  }
  return undefined;
};

// Función para obtener la configuración basada en la red
const getConfigFromNetwork = (network: SupportedNetworks) => {
  const networkInfo = networks[network];
  if (!networkInfo) {
    throw new Error("Network not supported.");
  }

  const { router, linkToken, wrappedNative, chainId } = networkInfo;
  return { router, linkToken, wrappedNative, chainId };
};

function buildArgs(text: string) {
  const { chain, chains } = getNetwork();

  let _destinationChainSelector;

  if (chains && chains.length > 0) {
    _destinationChainSelector = chains[0].id;
  } else if (chain) {
    _destinationChainSelector = chain.id;
  } else {
    _destinationChainSelector = 14767482510784806043;
  }
  const senderContractAddress = '0x78966DeFeC946e78BF9E2A7f93b5f443ADbD36eE';
  const destinationChainSelector = _destinationChainSelector;
  const receiver = '0x98fcf378FdB37a9615014E91772EF9d921697ED2';
  const payFeesIn = PayFeesIn.Native;

  return {
    destinationChainSelector,
    receiver,
    messageText: text,
    payFeesIn
  };
}

export {
  buildArgs,
  SupportedNetworks,
  getChainId,
  getRouterAddress,
  getLinkAddress,
  getWrappedNativeAddress,
  getCCIPBnMAddress,
  getCCIPLnMAddress,
  getConfigFromNetwork,
  getChainIndex,
};
