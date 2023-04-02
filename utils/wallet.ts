import {TezosToolkit, MichelsonMap} from '@taquito/taquito';
import {BeaconWallet} from '@taquito/beacon-wallet';
import {bytes2Char, char2Bytes} from '@taquito/utils';
import axios from 'axios';
import { NetworkType } from '@airgap/beacon-sdk';

const NAME = 'TezGuard'; // the name of the app
const CONTRACT_ADDRESS = 'KT1WLsMMw8XqNqgQbdccDBVQV6ooZm7y75pW';
const RPC_URL = 'https://ghostnet.ecadinfra.com'; // network rpc url
const NETWORK = NetworkType.GHOSTNET;

const Tezos = new TezosToolkit(RPC_URL);

const options = {
  name: NAME,
  iconUrl: 'https://tezostaquito.io/img/favicon.png',
  preferredNetwork: NETWORK,
};

const wallet = new BeaconWallet(options);

Tezos.setWalletProvider(wallet);

const connectWallet = async () => {

    await wallet.requestPermissions({
      network: {
        type: NETWORK,
      },
    });
    return wallet;
  };
  
const disconnectWallet = async () => {
   await wallet.clearActiveAccount();
};

const getPKH = async () => {
    const pkh = await wallet.getPKH();
    return pkh;
};

const getContract = async () => {
    const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
    return contract;
};

// const _mintNFT = async (url:string, token_id: number) => {
//     const activeAccount = await wallet.client.getActiveAccount();
//     const amount = 1;
//     const contract = await getContract();
//     url = char2Bytes(url);
//     const op = await contract.methods.mint(activeAccount!.address, amount, MichelsonMap.fromLiteral({'': url}), token_id).send();
//     return await op.confirmation(3);
//   };

//   const _getNFTs = async () => {
//     const response = await axios.get(
//       `https://api.ghostnet.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/bigmaps/token_metadata/keys`
//     );
//     const data = response.data;
//     let tokens = [];
//     for (let i = 0; i < data.length; i++) {
//       let url = data[i].value.token_info[''];
//       if (url) {
//         url = bytes2Char(url);
//       }
//       const token = {
//         token_id: data[i].value.token_id,
//         url,
//       };
//       tokens.push(token);
//     }
//     return tokens;
//   };

// Endpoint de l'api de tzkt que nous allons utiliser

// https://api.ghostnet.tzkt.io/v1/tokens/balances?account=tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXn&token.contract=KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV&token.metadata.id=identifiant_unique

  const mintNFT = async (_id: string) => {
    try {

      const contract = await Tezos.wallet.at('KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV');
      
      // const id = 'identifiant_unique' // 6964656e74696669616e745f756e69717565
      const bytes = char2Bytes(_id);
      console.log(bytes)
    
      const params = [
        {
          'metadata': MichelsonMap.fromLiteral({'id': bytes}),
          'to_': 'tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXn' // the 2nd wallet 'Bob' that I am using for the demo. He will get the permission
        }
      ]

      const op = await contract.methods.mint(params).send();
      await op.confirmation();

    } catch (e) {
      console.log(e);
    }
  };

  // This method check if a wallet owns a NFT and so if the owner has the permission to access the data
  const getNFT = async (walletAddress: string, contractAddress: string, id:string) => {

    const response = await axios.get(
      `https://api.ghostnet.tzkt.io/v1/tokens/balances?account=${walletAddress}&token.contract=${contractAddress}&token.metadata.id=${id}`
    );
    const data = response.data;
    console.log(data)

    if(data.length == 0){
      alert("Permission DENIED : You do not have the permission to access this area.")
    }
    else{
      alert('Permission GRANTED !')
    }
  }

 export {connectWallet, disconnectWallet, getPKH, getContract, mintNFT, getNFT};
