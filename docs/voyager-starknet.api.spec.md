# [shared] PRO Plan - Voyager Public API

## Blocks

- **GET** `/blocks`
    
    *Get all blocks*
    
    params:
    
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
    		{
    		  "blockNumber": 1655720,
          "hash": "0x781fb89f90f7c3a660ceab01587bc6d3caff67a97698b678fb337c128ca74b",
          "timestamp": 1753889087,
          "stateRoot": "0x5c1fd1fd3ebbc9f0c99e695da105875b8fda090beed5b8c72ad4085b57c409e",
          "txnCount": 39,
          "eventCount": 323,
          "messageCount": 0,
          "l1VerificationTxHash": null,
          "status": "Accepted on L2"
    		}
    	]
    }
    ```
    
- **GET** `/blocks/{blockHash}`
    
    *Retrieve block details*
    
    ```tsx
    // Example Response
    {
      "blockNumber": 1655720,
      "hash": "0x7351f3dc7eca4e9a6ecb278a95e4e0483064c5aeb88c8efd66f0e49638076ff",
      "timestamp": 1753888691,
      "stateRoot": "0x2da688aa3f35987385c603b0d0e9b62c77c49c136a3fa24e7a7e44dff1abd9c",
      "txnCount": 44,
      "eventCount": 298,
      "messageCount": 0,
      "l1VerificationTxHash": null,
      "status": "Accepted on L2",
      "confirmations": 2,
      "ethGasPrice": "0x0106ccd935",
      "strkGasPrice": "0x7bf0d51cca6d",
      "l1AcceptTime": null,
      "prevBlockHash": "0x3c94786e16fb4b8479c6f89e95c935a94b564befbcbf585e77fd616789aaa7a",
      "nextBlockHash": "0x519e614f8c593ca2f340001ca4b7c33a5d82c93b5a29fa03a4e6e2afa38defc",
      "timeToMine": 28,
      "sequencerAddress": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
      "totalFee": "0x0e1796bd383bcb4a",
      "version": "0.13.6"
    }
    ```
    

## Transactions

- **GET** `/txns`
    
    *Get all transactions*
    
    params:
    
    `to:`Only transactions from this contract address will be retrieved.
    
    `block:` Block number to query for
    
    `type:` The transaction's type.
    
    - `"0"` indicates a contract deployment `DEPLOY`.
    - `"1"` indicates a contract call `INVOKE`.
    - `"2"` indicates a class declaration `DECLARE`.
    - `"3"` indicates an interaction with the L1 `L1_HANDLER`.
    - `"4"` indicates an account creation `DEPLOY_ACCOUNT`.
    
    `rejected:` If true, then only rejected transactions will be retrieved. Otherwise, only transactions which haven't been rejected will be retrieved.
    
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
        {
          "actualFee": "97577660347534",
          "blockNumber": 562038,
          "classAlias": null,
          "classHash": null,
          "contractAddress": "0x025b74dbfb6aec63a080b2477e03a4920fbd89c3ba6adab7cea1afd25f8685f9",
          "contractAlias": null,
          "hash": "0x5e6a6feff3b5fbc8e8f821b1e2613a406070657a6a8f0700eb9b9c263a30ffd",
          "index": 112,
          "l1VerificationHash": "0xdbbd21edf5bafc86054945b558bb70ef0d3b740929a28cdd4f0f64ed2c548cdc",
          "status": "Accepted on L1",
          "timestamp": 1708479424,
          "type": "INVOKE"
        }
    	]
    }
    ```
    
- **GET** `/txns/{txnHash}`
    
    *Retrieve transaction details*
    
    ```tsx
    // Example Response
    {
      "actualFee": "259678351695557",
      "nonce": "0x1",
      "blockNumber": 29416,
      "classAlias": null,
      "classHash": null,
      "contractAddress": "0x025b74dbfb6aec63a080b2477e03a4920fbd89c3ba6adab7cea1afd25f8685f9",
      "contractAddressSalt": null,
      "contractAlias": null,
      "hash": "0x219575288903c605d0303c414540d646b77c51b389a80fc258d9245bf63e01d",
      "index": 127,
      "l1VerificationHash": "0x7a1e98165e8e84d8efda31629bad50c3bff33b5e46c01591b6358246a21c14a8",
      "maxFee": "0x5de1f17a188b0",
      "senderAddress": "0x025b74dbfb6aec63a080b2477e03a4920fbd89c3ba6adab7cea1afd25f8685f9",
      "signature": [
        "0x3aea73a0d8b4d2e780ff235223a290178570147f5910086ea0976a2c302d5d0",
        "0xa88a2d2ba0b9840656a51b4bd59d943b70ac61472dea4ce4e798d02d84fe06"
      ],
      "status": "Accepted on L1",
      "timestamp": 1680261032,
      "type": "INVOKE",
      "version": "0x1",
      "revertError": null
    }
    ```
    
- GET `/meta-txns`
    
    **Overview:**
    List meta-transactions (transactions using the "execute from outside" pattern) for a specific contract.
    
    **Params:**
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    `to`: (required): Target contract address (hex string) - the account contract receiving the meta-transaction
    
    Response:
    
    `/meta-txns?to=0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b`
    
    ```tsx
    {
      "items": [
           {
          "actualFee": "15860160027199296",
          "blockNumber": 3145013,
          "blockId": "0x7a418e1449e39c08c72ce82bd150274de425ef9df42dccf883f944b12b5864",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x15f0ad18c6fbce78f401e15d859ec0e349fe2f7b6087da15819ecc0fd506c58",
          "l1VerificationHash": null,
          "senderAddress": "0x063a5eb7b0435bfe0a371b1b29967927a85a55fd2096dfcbb37a513aa1300ec8",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207549,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "execute_from_outside_v3,claim_reward_token",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        {
          "actualFee": "93763200054210430",
          "blockNumber": 3145009,
          "blockId": "0x2cbcad32ef6864a0969b3e19e527f233e5d116acecb66a60187428561c666c6",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x68a1cbfbe45056345f21bf9bdf214aeb6f17f2199a8cdf9a27312d4d0a9981c",
          "l1VerificationHash": null,
          "senderAddress": "0x06443f5bcb3ff337f2258d3de9ce69a029ac76d00f39729b2376362bd4a1b099",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207539,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "submit_random,execute_from_outside_v3,request_random",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        {
          "actualFee": "77688000040504380",
          "blockNumber": 3145005,
          "blockId": "0x67cda4ad2215a60d74e9a78af67547ad8d2c9a5e506f53895129740aa39d153",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x656e6c22d965a570e7a6cd8157e229d94335fbf395623ad63888e3787b111e7",
          "l1VerificationHash": null,
          "senderAddress": "0x047e89a34922a3bc9afe1b32cb96c0e4d521f5cfddf3de421bc26fc7ef556fae",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207516,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "submit_random,execute_from_outside_v3,request_random",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        {
          "actualFee": "38510400025358270",
          "blockNumber": 3145002,
          "blockId": "0x28816c1a916c93c980e07e04d62a13b450360238b0215cc7024eb40b0d998d0",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x50048f14c86743984ae3980e05440b46f0dbcf90ba26f37632d1a6d5d022ef4",
          "l1VerificationHash": null,
          "senderAddress": "0x07802e6c18bb157a871f3b1d5c150f120f67d6e4b2b4c98211246c16e18f97ec",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207506,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "execute_from_outside_v3,select_stat_upgrades",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        {
          "actualFee": "87139200043654780",
          "blockNumber": 3144998,
          "blockId": "0xa633afe222d94c9f4ef1dd68ad40821b9d866a66da4db3bd17741ec6d322a7",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x2a6e00cf631c2485ca1d9b89f42a231a033fc6952204a147523b3acd1b68a80",
          "l1VerificationHash": null,
          "senderAddress": "0x000dbbb924ca0e02ff254473f10cbfb0320e73d6a6adfb009c0515585b713877",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207488,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "submit_random,execute_from_outside_v3,request_random",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        {
          "actualFee": "81480960041768700",
          "blockNumber": 3144996,
          "blockId": "0x26c7c0ec8f09c9ac9170cb0682e44ffcc2b082ce9df10f7b66e1cff451ba626",
          "classAlias": null,
          "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
          "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
          "contractAlias": null,
          "hash": "0x41f8ceb585870d9e6cc61c4dd0df8ebdd10c7ab6adc0c26a92edacb1546c138",
          "l1VerificationHash": null,
          "senderAddress": "0x004ff7e942621210c8e9aabe42c68a35d3243992915e09cb7d800ef6c62c5d8b",
          "senderAlias": null,
          "status": "Accepted on L2",
          "timestamp": 1761207478,
          "type": "INVOKE",
          "executionStatus": "Succeeded",
          "finalityStatus": "Accepted on L2",
          "operations": "submit_random,execute_from_outside_v3,request_random",
          "name": "execute_from_outside_v3",
          "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
          "revertError": null
        },
        
        ...etc
      ],
      "lastPage": 1345
    }
    ```
    

## Classes

- **GET** `/classes`
    
    *Get all classes*
    
    params:
    
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
        {
          "hash": "0x012947dcb10e60f397a3012b42ac8a568692fd62a3fd54d01a1d24255163464a",
          "transactionHash": "0x299f7cdca613822f573bca25252413d1f4309c2c18fa3b32e99aba661e90f4",
          "version": "2.11.4",
          "type": 0,
          "isAccount": false,
          "isProxy": false,
          "isErcToken": false,
          "creationTimestamp": 1753874302,
          "classAlias": null,
          "verifiedTimestamp": null
        },
    	]
    }
    ```
    
- **GET** `/classes/{classHash}`
    
    *Retrieve class details*
    
    ```tsx
    // Example Response
    {
      "hash": "0x03f85b23fd3c13e55134f583f22f3046d0e2cc2e6a6c61431137cee9d55deaf7",
      "version": "2.11.2",
      "transactionHash": "0xbd3768c039e3282bdc61b8c2913f93b2d26d59d69f0f2eef0da0f3738df300",
      "declaredBy": "0x07f4070e691d452f79a715027dec6db9efc5f9e16e5e53f6e3bf2b37f547ef02",
      "creationTimestamp": 1749034910,
      "type": 0,
      "isAccount": false,
      "isProxy": false,
      "isErcToken": false,
      "contractsCount": null,
      "classAlias": "Staking",
      "contractAlias": null,
      "verifiedTimestamp": 1751798118,
      "abi": null,
      "byteCode": null,
      "code": null,
      "license": null
    }
    ```
    
- **GET** `/classes/{classHash}/contracts`
    
    *Get contracts of the given class*
    
    ```tsx
    // Example Response
    {
      "items": [
        {
          "address": "0x00ca1702e64c81d9a07b86bd2c540188d92a2c73cf5cc0e508d949015e7e84a7",
          "creationTimestamp": 1732436860,
          "txnCount": "0",
          "accountCallCount": "21401",
          "contractAlias": "Starknet: Staking"
        }
      ],
      "lastPage": 1
    }
    ```
    

## Contracts

- **GET** `/contracts`
    
    *Get all contracts*
    
    params:
    
    `type:`Contract type, not specified = all types (types**: account** ┃ erc20 ┃ erc721┃ erc1155┃ unknown┃ proxy).
    
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
        {
          "address": "0x07b7196ce28756a07a1e874947cce4696425060108fd2ca1cee054e46a00865b",
          "blockHash": "0x5123420d1ff254b138eb0efb446db8d3b9a5ae8cd842697d1559ff1ed039c1e",
          "blockNumber": 1655799,
          "classAlias": "Ready",
          "contractAlias": null,
          "classHash": "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f",
          "creationTimestamp": 1753890591,
          "isAccount": true,
          "isErcToken": false,
          "isProxy": false,
          "type": "Ready",
          "verifiedTimestamp": 1732798981,
          "version": "2.6.3"
        }
    	]
    }
    ```
    
- **GET** `/contracts/{contractAddress}`
    
    *Retrieve contract details*
    
    ```tsx
    // Example Response
    {
      "address": "0x07faf54d35eb92d381cb5d3b9ba6b35ccf297980e35be22ecfe07eafd2a4ac48",
      "blockHash": "0x701838987e597a6cb3489d93cb41e8827cc62048ca5fb690a1cf62d8a9a2bc5",
      "blockNumber": 29410,
      "classAlias": "Ready",
      "classHash": "0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003",
      "contractAlias": null,
      "creationTimestamp": 1680260250,
      "isAccount": true,
      "isErcToken": false,
      "isProxy": false,
      "nonce": "0x64",
      "verifiedTimestamp": null,
      "type": "Ready",
      "version": "2.0.0",
      "tokenName": null,
      "tokenSymbol": null
    }
    ```
    

## Events

- **GET** `/events`
    
    *Get all events*
    
    params:
    
    `contract:`The contract address to get contract events. You cannot mix this query parameter with the `blockHash` and `transactionHash` query parameters.
    
    `txnHash:` The transaction hash.
    
    `blockHash:` The block hash.
    
    `p:` Which page of items to retrieve. Start with `1` unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
           {
          "blockNumber": 1655808,
          "transactionNumber": 32,
          "number": 3,
          "data": [
            "0x7162c947255d60a03b935f7f708a5d50a27294fe6aeff3f5ce22865ddf5aab",
            "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
            "0x116cc1b1ef3500",
            "0x0"
          ],
          "fromAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "keys": [
            "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9"
          ],
          "classHash": "0x04ad3c1dc8413453db314497945b6903e1c766495a1e60492d44da9c2a986e4b",
          "transactionHash": "0x3b3fd52c420eb1c0e7a603a650ddae85ead91ad6bc6f8d1df41c020da5576ad",
          "blockHash": "0x799392942244b1be078d86cea0091f11dc51391aaca601c1fdde77b3505f28e",
          "timestamp": 1753890838,
          "selector": "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
          "name": "Transfer",
          "nestedName": "Transfer",
          "nestedEventNames": [],
          "dataDecoded": [
            {
              "name": "from",
              "value": "0x7162c947255d60a03b935f7f708a5d50a27294fe6aeff3f5ce22865ddf5aab",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "value": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "value",
              "value": "0x116cc1b1ef3500",
              "type": "core::integer::u256"
            }
          ],
          "keyDecoded": [],
          "eventId": "0x3b3fd52c420eb1c0e7a603a650ddae85ead91ad6bc6f8d1df41c020da5576ad_3",
          "classAlias": null,
          "contractAlias": "StarkGate: STRK Token",
          "abiVerified": false
        },
    	]
    }
    ```
    

## Messages

- **GET** `/message/{messageHash}`
    
    *Retrieve details of a specific message using its message hash.*
    
    params:
    
    `messageHash:` The hash of the message.
    
    ```tsx
    {
        "metadata": {
            "hash": "0xfccbe5f6486f30a8da921c94bd3f9b847c58306439235504f5bbf935d5643886",
            "count": 4,
            "type": "l2l1",
            "from_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
            "to_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
            "selector": null,
            "payload": [
                "0",
                "634620463854586859851242826670858498842198099023",
                "4543560",
                "35000000000000000000",
                "0"
            ],
            "l1ContractAlias": "L1 StarkGate: ETH Bridge",
            "l2ContractAlias": "StarkGate: ETH Bridge",
            "metaInfo": [
                {
                    "timestamp": 1744696813,
                    "txHash": "0x3254fb74139e2097351ea3b31cb4e0c7e7e0d1605bcf4b7274aa1a565ce10cd",
                    "blockHash": "0x32c315cba601b0cf81675642b0b673d98c8d6d3d62c2cd014d701cd47216dc6",
                    "status": "sent"
                },
                {
                    "timestamp": 1750542105,
                    "txHash": "0x25f5a6d626efc443ca290c6853bba69806c1b772d5f9619a30695f30754f96",
                    "blockHash": "0x3d7f87d70ff4fcbe793352e3b6dd119c86b8cc5e3b29bef519b2f1d2465ecfc",
                    "status": "sent"
                },
                {
                    "timestamp": 1753489750,
                    "txHash": "0x443aeb2716a469389e3fd70dc0d403d9caa3d50402839d49d0770315fb188a4",
                    "blockHash": "0x54022fdd175a702efb0a62125aae1e3b5cd549be4624c802a4d83097b605f1f",
                    "status": "sent"
                },
                {
                    "timestamp": 1755169126,
                    "txHash": "0x13543f15d70134579c3a7bd409abaf3ab66d8c409dc9ea6774084703edc98d2",
                    "blockHash": "0x40cf5c0a4ada05199a0e6cd189771579783dc0aaedfd1c17def98875e80d0dc",
                    "status": "pending"
                }
            ],
            "displayInfo": [
                {
                    "status": "sent"
                },
                {
                    "status": "consumed"
                },
                {
                    "status": "consumed"
                },
                {
                    "status": "consumed"
                }
            ],
            "l1_transaction_hash": null
        },
        "l1l2": null,
        "l2l1": {
            "hash": "0xfccbe5f6486f30a8da921c94bd3f9b847c58306439235504f5bbf935d5643886",
            "from_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
            "to_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
            "payload": [
                "0",
                "634620463854586859851242826670858498842198099023",
                "4543560",
                "35000000000000000000",
                "0"
            ]
        }
    }
    ```
    
- **GET** `/messages`
    
    *Retrieve a list of messages, possibly with filters.*
    
    params:
    
    `cursor:` Pagination cursor.
    
    `limit:` Number of messages to retrieve.
    
    ```tsx
    // Example Response
    {
      "items": [
        {
          "id": "22935500",
          "hash": "0xc40c2d29a4348657835df5146d9076b283343948076b1629f7b520e4be3a4dd6",
          "type": "l1l2",
          "block_number": 1655940,
          "tx_hash": "0x77b2382eba41c9baf1c46ce481227165007da624802f27fab933d4b5250de17",
          "from_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
          "to_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
          "l2_blocks_hash": "0x7a406a676b29cf50e63ade18fe6470a0c6e800f34400eee0113b68595feeda",
          "timestamp": 1753893931,
          "verified_block_number": null,
          "l2_block_number": 1655940,
          "block_hash": "0x7a406a676b29cf50e63ade18fe6470a0c6e800f34400eee0113b68595feeda",
          "l1ContractAlias": "L1 StarkGate: ETH Bridge",
          "l2ContractAlias": "StarkGate: ETH Bridge"
        },
      ],
     "lastPage": 590166
    }
    }
    
    ```
    

## Statistics

- **GET** `/stats`
    
    *Retrieve current statistics.*
    
    ```tsx
    {
      "blocksCount": "1655947",
      "contractsCount": "6129425",
      "classesCount": "67619",
      "transactionsCount": "207772621",
      "tpsAtBlockHash": "0x94673f37c8baba79ba4c44b3d54e4042fbdb299a8252f5f3012148b038ed2",
      "tps": "1.1935483870967742",
      "maxRecordedTps": "992",
      "latestAvgFee": [
        {
          "avgFee": "0.001845481628252343",
          "unit": "USD"
        },
        {
          "avgFee": "0.000000492078570239",
          "unit": "ETH"
        }
      ],
      "activeAccounts": "32478",
      "accountsGrowth": "2911",
      "totalTvl": {
        "value": "525915619",
        "unit": "USD"
      }
    }
    
    ```
    

## Class Verify

- **GET** `/class-verify/job/{job_id}`
    
    *Query the status of a created verification job by its job id. The job id should be the one returned from the verify class endpoint. This endpoint allows you to track the current status of a submitted verification.*
    
    ```tsx
    // Example Response
    {
    	"status": 0,
    	"job_id": "1985c0c9-c4f0-4000-8881-93ab2a614101",
    	"class_hash": "",
    	"created_timestamp": 0,
    	"updated_timestamp": 0,
    	"status_description": "string",
    	"address": "string",
    	"contract_file": "string",
    	"name": "string",
    	"version": "string",
    	"license": "string"
    }
    ```
    
- **GET** `/class-verify/{class_hash}`
    
    *Retrieve contract details*
    
    ```tsx
    // Example Response
    {
      "project_dir_path": "string",
      "compiler_version": "string",
      "license": "string",
      "contract_file": "string",
      "name": "string",
      "account_contract": false,
      "files": {
        "my_cairo_project/src/lib.cairo": "mod b;",
        "my_cairo_project/src/b.cairo": "#[starknet::contract]\n mod a { ... }"
      }
    }
    ```
    

## Tokens

- **GET** `/tokens`
    
    List all deployed tokens on the network.
    
    params:
    
    `type:` Token type, default is erc20 (**Allowed:** erc20 ┃ erc721 ┃ erc1155)
    
    `attribute:` Order by a specific attribute, default ordering by the holders field (**Allowed:** holders ┃ transfers)
    
    `p:` Which page of items to retrieve. Start with 1 unless you know which page you want. 
    
    `ps:` The number of items to to return in a page.
    
    ```tsx
    // Example Response
    {
    	"lastPage": 1,
    	"items": [
           {
          "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "decimals": "18",
          "holders": "4508740",
          "name": "Ether",
          "symbol": "ETH",
          "transfers": "226884481",
          "type": "erc20"
        },
    	]
    }
    ```
    
- GET `tokens/{address}/holders`
    
    ### **Overview**
    
    The Token Holders service provides detailed information about ERC20 token holders on the Starknet network, including holder addresses, balances, aliases, and pagination support.
    
    ---
    
    Retrieves a paginated list of token holders for a specific ERC20 token.
    
    ### **Parameters**
    
    - `address` — Token contract address *(required)*
    - `p` — Page number *(optional, default: 1)*
    - `ps` — Page size *(optional, default: 25)*
    
    ---
    
    ### **Example Request**
    
    ```bash
    GET /tokens/0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8/holders?ps=10&p=1
    
    ```
    
    ---
    
    ### **Example Response**
    
    ```json
    {
      "items": [
        {
          "holder": "0x062da0780fae50d68cecaa5a051606dc21217ba290969b302db4dd99d2e9b470",
          "balance": "66101348.043955",
          "lastTransferTime": 1760089468,
          "decimals": "6",
          "balanceSeparated": "66,101,348.043955",
          "contractAlias": "Extended: Core"
        },
        {
          "holder": "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b",
          "balance": "12473263.493965",
          "lastTransferTime": 1760089579,
          "decimals": "6",
          "balanceSeparated": "12,473,263.493965",
          "contractAlias": "Ekubo: Core"
        },
        {
          "holder": "0x03976cac265a12609934089004df458ea29c776d77da423c96dc761d09d24124",
          "balance": "8948929.519816",
          "lastTransferTime": 1760088317,
          "decimals": "6",
          "balanceSeparated": "8,948,929.519816",
          "contractAlias": null},
        {
          "holder": "0x02eef0c13b10b487ea5916b54c0a7f98ec43fb3048f60fdeedaf5b08f6f88aaf",
          "balance": "5245095.746357",
          "lastTransferTime": 1760078593,
          "decimals": "6",
          "balanceSeparated": "5,245,095.746357",
          "contractAlias": null},
        {
          "holder": "0x03f7f4e5a23a712787f0c100f02934c4a88606b7f0c880c2fd43e817e6275d83",
          "balance": "2617161.73573",
          "lastTransferTime": 1759856203,
          "decimals": "6",
          "balanceSeparated": "2,617,161.73573",
          "contractAlias": "dojo.stark"
        },
        {
          "holder": "0x0123b911db94d6dbeeed051ff3605ba463dfafa78ae10c0e56989f3eda8255cf",
          "balance": "2591286.843474",
          "lastTransferTime": 1759945378,
          "decimals": "6",
          "balanceSeparated": "2,591,286.843474",
          "contractAlias": null},
        {
          "holder": "0x000d8d6dfec4d33bfb6895de9f3852143a17c6f92fd2a21da3d6924d34870160",
          "balance": "1329326.730266",
          "lastTransferTime": 1760088700,
          "decimals": "6",
          "balanceSeparated": "1,329,326.730266",
          "contractAlias": null},
        {
          "holder": "0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff",
          "balance": "1096745.725527",
          "lastTransferTime": 1760089252,
          "decimals": "6",
          "balanceSeparated": "1,096,745.725527",
          "contractAlias": "Nostra: Interest Rate Model"
        },
        {
          "holder": "0x05c03e7e0ccfe79c634782388eb1e6ed4e8e2a013ab0fcc055140805e46261bd",
          "balance": "1000550.002504",
          "lastTransferTime": 1759739283,
          "decimals": "6",
          "balanceSeparated": "1,000,550.002504",
          "contractAlias": null},
        {
          "holder": "0x0331bd9913654dd0b0081fada980204e375216122948a515f44f435bc668d5f9",
          "balance": "990195.719734",
          "lastTransferTime": 1759995769,
          "decimals": "6",
          "balanceSeparated": "990,195.719734",
          "contractAlias": "pragmaxi.stark"
        }
      ],
      "lastPage": 0,
      "hasMore": true
      
      }
    
    ```
    

## Token Transfers

- **GET** `/contracts/{contractAddress}/transfers`
    - *It's highly recommended to set the `timestampFrom` and `timestampTo` parameters, and to keep them in three calendrical month time ranges. For every extra quarter you query, you can expect a noticeable increase in response time.*
    
    *Retrieve the ERC20, ERC721, or ERC1155 token transfers associated with a specific contract address.*
    
    params:
    
    `timestampFrom:` Retrieve transfers from this Unix timestamp (seconds since epoch).
    
    Examples: `1720812089`
    
    `timestampTo:` Retrieve transfers up to this Unix timestamp (seconds since epoch). (exclusive)
    
    Examples: `1720813089`
    
    `type:` Filter by token type.
    
    Allowed: `erc20`, `erc721`, `erc1155`
    
    Default: `erc20`
    
    Examples: `erc20`
    
    `id:` Filter transfers before or after a specific transfer ID.
    
    Examples: `253`
    
    `order_by:` Results order, either ascending (`asc`) or descending (`desc`; default).
    
    Allowed: `asc`, `desc`
    
    `ps:` Number of items per page (algorithm: less than 25 → 10; 25–49 → 25; 50–99 → 50; 100+ → 100).
    
    Examples: `10`
    
    `from:` Only ERC transfers from the specified contract will be retrieved.
    
    Examples: `0x025b74DBFB6AEc63a080b2477e03a4920FbD89C3ba6AdAB7cea1Afd25F8685F9`
    
    `to:` Only ERC transfers to the specified contract will be retrieved.
    
    Examples: `0x025b74DBFB6AEc63a080b2477e03a4920FbD89C3ba6AdAB7cea1Afd25F8685F9`
    
    `symbol:` The ERC token's symbol.
    
    Examples: `ETH`
    
    `tokenAddress:` The ERC token's contract address.
    
    Examples: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`, etc.
    
    `invocationType:` Transaction type.
    
    Allowed: `ALL`, `VALIDATE`, `EXECUTE`, `FEE_TRANSFER`
    
    Default: `ALL`
    
    Examples: `VALIDATE`
    
    ```tsx
    // Example Response
    {
    "items": [
    	{
    	"blockNumber": 1643556,
    	"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    	"timestamp": 1753642806,
    	"transferFrom": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
    	"transferTo": "0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
    	"transferValue": "0.00577306594404176",
    	"txHash": "0x36ff4c434ffed203e9c9c7d3acd25690861d8b1928028f0791e0942bd95d5b9",
    	"callName": "transfer",
    	"tokenName": "Starknet Token",
    	"tokenSymbol": "STRK",
    	"tokenDecimals": 18,
    	"blockHash": "0x26e33072da06ad179ce6379c9673cc9384ec7255dca84f8edd21e12768c78c6",
    	"fromAlias": null,
    	"toAlias": "StarkWare: Sequencer",
    	"invocationType": "fee_transfer",
    	"id": "1255164560",
    	"txOperation": "approve, transfer"
    	},
    	// more items
    	"hasMore": true
    }
    ```
    

## Balances

- **GET** `/contracts/{contractAddress}/token-balances`
    
    *Retrieve the ERC-20 tokens balances of a contract.*
    
    ```tsx
    
    {
      "erc20TokenBalances": [
        {
          "name": "Tether USD",
          "address": "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
          "balance": "120196",
          "usdBalance": "0.12",
          "usdFormattedBalance": "$0.12",
          "decimals": "0x6",
          "symbol": "USDT",
          "formattedBalance": "0.120196",
          "iconLogo": "https://coin-images.coingecko.com/coins/images/32210/small/usdt_%281%29.png?1696752003",
          "isVerified": true
        }    
      ],
      "verfiedTokensCount": 4,
      "totalTokensCount": 5,
      "totalUsdValue": "0.22"
    }
    ```
    

## Event Activities

- **GET** `/event-activity`
    
    *List event activities such as token transfers, with detailed filtering options.*
    
    params:
    
    - `token_type:` Token standards (ERC20, ERC721, ERC1155)
    - `from_block:` Starting block number for the query.
    - `to_block:` Ending block number for the query.
    - `from_timestamp:` Lower time boundary (seconds since Unix epoch).
    - `to_timestamp:` Upper time boundary (seconds since Unix epoch).
    - `from_address:` Address sending tokens.
    - `to_address:` Address receiving tokens.
    - `sort:` Order of results (`asc` or `desc`).
    - `page_size:` Number of items per page.
    - `last_id:` ID of the last transfer for pagination.
    
    response:
    
    ```tsx
    // Example Response
    {
      "hasMore": false,
      "items": [
        {
          "blockHash": "0x61a4a7b548fde072087b1544d9307a2e00fdd604218fcb1c579468192bffe86",
          "blockNumber": 192179,
          "timestamp": 1726677511,
          "tokenAddress": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "tokenName": "Ether",
          "tokenSymbol": "ETH",
          "tokenDecimals": "0x12",
          "txHash": "0x21bd605123b087472e0a3217f622b864e46c8caadd5f5ac4899520e641efa60",
          "callName": "transfer",
          "invocationType": "FEE_TRANSFER",
          "eventId": "192179_0_1",
          "data": [
            "0x2dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
            "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
            "0x2c7c67f30f79",
            "0x0"
          ],
          "keys": [
            "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9"
          ],
          "id": "32894032",
          "transferFrom": "0x02dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
          "transferTo": "0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
          "transferDataLen": 1,
          "transferValues": [
            "48912831549305"
          ],
          "selector": "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
          "name": "Transfer",
          "nestedName": "Transfer",
          "nestedEventNames": [],
          "dataDecoded": [
            {
              "name": "from",
              "value": "0x2dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "value": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "value",
              "value": "0x2c7c67f30f79",
              "type": "core::integer::u256"
            }
          ],
          "keyDecoded": [],
          "fromAlias": null,
          "toAlias": null,
          "abiVerified": false
        }
      ]
    }
    
    ```
    

## Staking

- **GET** `/staking/overview`
    
    *Get an overview of staking statistics and metrics.*
    
    params: None
    
    response:
    
    ```tsx
    {
        "overview": {
            "tokenInfoStrk": {
                "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "price": 0.119393,
                "decimals": 18,
                "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
                "name": "Starknet",
                "symbol": "strk"
            },
            "tokenInfoBtc": {
                "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
                "price": 112649,
                "decimals": 8,
                "logoUrl": "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872",
                "name": "Lombard Staked Bitcoin",
                "symbol": "LBTC"
            },
            "totalStakeStrk": "573308919158317718685138261",
            "totalStakeBtc": "4012490000593076",
            "circulatingSupply": "4077130043",
            "totalValidators": 164,
            "totalDelegators": 69161,
            "maxAPRStrk": 668,
            "maxAPRBtc": 252588167,
            "mintingCurve": 160,
            "securityLockup": 604800,
            "minimumStake": "20000000000000000000000",
            "totalSupply": "10000000000",
            "averageCommission": 647,
            "epochData": {
                "id": 3940,
                "nextId": 3941,
                "progress": 76.47887323943662,
                "estimatedEndTimestamp": 1758544346.9176686,
                "durationSeconds": 2494.5357026807474
            }
        },
        "lastUpdated": 1758543761802
    }
    ```
    
- GET `/staking/validators`
    
    **Overview:**
    
    Returns a paginated list of staking validators with detailed information including stake amounts, delegators, commission rates, APR calculations, and staking power metrics for both STRK and BTC assets.
    
    **Params**: 
    
    - **`p`** *(optional, default: `1`)* — Page number (must be a positive integer).
    - **`ps`** *( optional, default: `25`)* — Page size (must be a positive integer).
    - **`search`** *(optional)* — Search term to filter validators by address or name. Empty strings are ignored.
    - **`sortBy`** *(string, optional, default: `"rank"`)* — Field to sort by. Must be one of: `"rank"`, `"stakeStrk"`, `"stakeBtc"`, `"delegators"`, `"commission"`, `"stakingPower"`.
    - **`sortOrder`** *(optional, default: `"ASC"`)* — Sort direction. Must be either `"ASC"` or `"DESC"`.
    - **`tokenAddress`** *(optional)* — Filter validators by staked token address (must be a valid hex string).
    
    Response: 
    `staking/validators?p=1&ps=10`
    
    ```tsx
    {
      "items": [
        {
          "stakerState": "active",
          "address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "isVerified": true,
          "totalStakeStrk": "94316184.12303925",
          "totalStakeBtc": "255.6972182289891",
          "totalStakePercentageStrk": 1547,
          "totalStakePercentageBtc": 4372,
          "totalSelfStake": "1764536.9999999998",
          "totalDelegatedStakeStrk": "92551647.12303925",
          "totalDelegatedStakeBtc": "255.6972182289891",
          "totalDelegators": 34899,
          "revenueShare": 0,
          "aprStrk": 1213,
          "aprBtc": 490,
          "rank": "1",
          "name": "Ready (prev. Argent)",
          "imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
          "startTime": 1758101432,
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "liveness": 99.9,
          "livenessAttestedEpochs": 1026,
          "livenessTotalEpochs": 1027,
          "livenessLastEpoch": 4696,
          "poolInfos": [
            {
              "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
              "poolContract": "0x01e93567ac481ffddf47f588b2386f35b71655c0b99bd0b62bcd93206199adfa",
              "tokenInfo": {
                "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
                "price": 115616,
                "decimals": 18,
                "logoUrl": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png",
                "name": "Solv BTC Token",
                "symbol": "SolvBTC"
              }
            },
            {
              "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
              "poolContract": "0x024332bca859beefdf0a379b8433a27010c5f38362ad6f9adc01784e8d2f2914",
              "tokenInfo": {
                "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
                "price": 115730,
                "decimals": 8,
                "logoUrl": "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872",
                "name": "Lombard Staked Bitcoin",
                "symbol": "LBTC"
              }
            },
            {
              "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
              "poolContract": "0x04a8ae152b45b16f22c35a356432435a7d881d4dbd3b1e9c06255fca009fe517",
              "tokenInfo": {
                "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
                "price": 115486,
                "decimals": 8,
                "logoUrl": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238",
                "name": "Bridged Wrapped Bitcoin (StarkGate)",
                "symbol": "wbtc"
              }
            },
            {
              "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
              "poolContract": "0x060585bd7db73e127a3afb7be71008b0773981de3201f9f8586a72f6cd4be548",
              "tokenInfo": {
                "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
                "price": 115639,
                "decimals": 18,
                "logoUrl": "https://coin-images.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
                "name": "tBTC",
                "symbol": "tbtc"
              }
            },
            {
              "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
              "poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
              "tokenInfo": {
                "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "price": 0.133977,
                "decimals": 18,
                "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
                "name": "Starknet",
                "symbol": "strk"
              }
            }
          ],
          "stakingPowerStrk": 1160.25,
          "stakingPowerBtc": 1093,
          "stakingPower": 2253.25
        },
        {
        ...
        
        }
      ],
      "pagination": {
        "prev": null,
        "next": "/staking/validators?p=2&ps=10&sortBy=rank&sortOrder=ASC",
        "totalPages": 18,
        "pageSize": 10,
        "prevPage": null,
        "nextPage": 2,
        "currentPage": 1
      }
    }
    ```
    
- GET `/staking/validator-details`
    
    **Overview:**
    
    Returns detailed information about a specific validator, including comprehensive staking metrics, pool information, social links, operational details, liveness statistics, and commitment parameters. This endpoint provides more extensive information than the validators list endpoint.
    
    **Params:**
    **`validator`** *( required)* — The validator’s address (must be a valid hexadecimal string).
    
    **Response:** 
    
    `staking/validator-details?validator=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7`
    
    ```tsx
    {
      "validatorDetails": {
        "address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        "isVerified": true,
        "totalStakeStrk": "94316196.33822665",
        "totalStakeBtc": "255.6972182289889",
        "totalStakePercentageStrk": 1545,
        "totalStakePercentageBtc": 4372,
        "totalSelfStake": "1764536.9999999998",
        "totalDelegatedStakeStrk": "92551659.33822665",
        "totalDelegatedStakeBtc": "255.6972182289889",
        "totalDelegators": 34634,
        "revenueShare": 0,
        "aprStrk": 1213,
        "aprBtc": 488,
        "rank": "1",
        "startTime": 1758101432,
        "startingTime": "2025-09-17T09:30:32.000Z",
        "poolInfos": [
          {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
            "tokenInfo": {
              "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
              "price": 0.133493,
              "decimals": 18,
              "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
              "name": "Starknet",
              "symbol": "strk"
            },
            "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
          },
          {
            "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
            "poolContract": "0x024332bca859beefdf0a379b8433a27010c5f38362ad6f9adc01784e8d2f2914",
            "tokenInfo": {
              "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
              "price": 115764,
              "decimals": 8,
              "logoUrl": "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872",
              "name": "Lombard Staked Bitcoin",
              "symbol": "LBTC"
            },
            "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
          },
          {
            "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
            "poolContract": "0x04a8ae152b45b16f22c35a356432435a7d881d4dbd3b1e9c06255fca009fe517",
            "tokenInfo": {
              "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
              "price": 115484,
              "decimals": 8,
              "logoUrl": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238",
              "name": "Bridged Wrapped Bitcoin (StarkGate)",
              "symbol": "wbtc"
            },
            "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
          },
          {
            "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
            "poolContract": "0x060585bd7db73e127a3afb7be71008b0773981de3201f9f8586a72f6cd4be548",
            "tokenInfo": {
              "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
              "price": 115459,
              "decimals": 18,
              "logoUrl": "https://coin-images.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
              "name": "tBTC",
              "symbol": "tbtc"
            },
            "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
          },
          {
            "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
            "poolContract": "0x01e93567ac481ffddf47f588b2386f35b71655c0b99bd0b62bcd93206199adfa",
            "tokenInfo": {
              "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
              "price": 115601,
              "decimals": 18,
              "logoUrl": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png",
              "name": "Solv BTC Token",
              "symbol": "SolvBTC"
            },
            "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
          }
        ],
        "rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        "operationalAddress": "0x06012516a3ae0e8e8367abdb1db76ba56f7cb221aa3c1e4c02f52ab9d4d1ebc6",
        "stakerState": "active",
        "name": "Ready (prev. Argent)",
        "imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
        "description": "Official Starknet Validator by Ready",
        "website": "https://www.ready.co",
        "liveness": 99.9,
        "livenessAttestedEpochs": 1025,
        "livenessTotalEpochs": 1026,
        "livenessLastEpoch": 4696,
        "socials": {
          "twitter": {
            "value": "ready_co",
            "link": "https://x.com/ready_co",
            "iconName": "TwitterX"
          }
        },
        "stakingPowerStrk": 1158.75,
        "stakingPowerBtc": 1093,
        "stakingPower": 2251.75
      }
    }
    ```
    
- GET `/staking/validator-pool-info`
    
    **Overview:**
    
    Returns a list of all staking pools associated with a specific validator, including the pool contract addresses and token information for each pool. This endpoint is useful for understanding which tokens a validator accepts for staking and their pool infrastructure.
    
    **Params:
    `validator`** *( required)* — The validator’s address (must be a valid hexadecimal string).
    
    **Response:** 
    
    `validator-pool-info?validator=0x04b00f97e2d2168b91fe64ceeace4a41fc274a85bbdd0adc402c3d0cf9f91bbb`
    
    ```tsx
    [
      {
        "poolContract": "0x045e3a70f03d4af1fe14b18e016ddc005413af87a35b6484f3213b5dc4155b0f",
        "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
        "tokenName": "Solv BTC",
        "tokenSymbol": "SolvBTC",
        "tokenDecimals": 18,
        "iconLogo": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png"
      },
      {
        "poolContract": "0x01f170bafce432964d6cbaf2cb75355b2043f5640897e0623b7dbb029bf6b3ef",
        "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        "tokenName": "Starknet Token",
        "tokenSymbol": "STRK",
        "tokenDecimals": 18,
        "iconLogo": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507"
      },
      {
        "poolContract": "0x01a36f1cabf234c02cebd9e0011774856d5b7b2047c73efe7433b4813f26f247",
        "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
        "tokenName": "Lombard Staked Bitcoin",
        "tokenSymbol": "LBTC",
        "tokenDecimals": 8,
        "iconLogo": "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872"
      },
      {
        "poolContract": "0x061b67fdeb5ac7e7c0717e6011d53e546a8924b09753ae91ae88ca16b1fdebff",
        "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
        "tokenName": "Starknet tBTC",
        "tokenSymbol": "tBTC",
        "tokenDecimals": 18,
        "iconLogo": "https://coin-images.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155"
      },
      {
        "poolContract": "0x02948b1055db6c104ce426854983543e2116af081a65155551a003b0d969a19d",
        "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
        "tokenName": "Wrapped BTC",
        "tokenSymbol": "WBTC",
        "tokenDecimals": 8,
        "iconLogo": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238"
      }
    ]
    ```
    
- GET `/staking/delegators`
    
    **Overview:**
    
    Returns detailed information about a validator’s delegations, including delegator addresses, staked amounts, rewards, and asset type (STRK or BTC). Supports filtering by specific delegator and pagination for large datasets.
    
    **Params:**
    
    - **`validator`** *( required)* — Validator’s address (must be a valid hex string).
    - **`p`** *( optional, default: `1`)* — Page number.
    - **`ps`** *( optional, default: `25`)* — Page size.
    - **`delegator`** *( optional )* — Specific delegator address (hex string) or Starknet ID (`.stark` domain). When provided, returns only that delegator without pagination.
    - **`asset`** *( optional, default: `"strk"`)* — Asset type to filter by. Must be either `"strk"` or `"btc"`.
    
    **Response: 
    `staking/delegators?validator=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7`**
    
    ```tsx
    {
      "items": [
        {
          "address": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "delegatedStake": "12736221.177654454",
          "share": 1350.37799439353,
          "startTime": 1734401823
        },
        {
          "address": "0x03651b83fb30ad6bb33a96eeb522631a56ccb2f59695c6b812e32417abfd8e2d",
          "delegatedStake": "4278570",
          "share": 453.642151379188,
          "startTime": 1759328875
        },
        {
          "address": "0x03ed2ac6684e5dd954b7ef13455802758e0eb7240ba0191b508ec05226aa4436",
          "delegatedStake": "4253542.555559999",
          "share": 450.988576998195,
          "startTime": 1736586667
        },
        {
          "address": "0x012438dc4f6d7124c80756a8993b9c3274a7a2873c07ccb392f20356b8c71483",
          "delegatedStake": "2651424.298326577",
          "share": 281.121454811286,
          "startTime": 1737821756
        },
        {
          "address": "0x01f2b38a7abc0eba7b2b4d2c01a0f89e2b8744cc1cffebfe92c68d19e2f13cb2",
          "delegatedStake": "1426586",
          "share": 151.256036986056,
          "startTime": 1737290250
        },
        {
          "address": "0x04aa36e70eee7e11e5988dd3578d956cf799c311dd1e7f9d47b8790da6238bad",
          "delegatedStake": "1392841.3681784745",
          "share": 147.678209025542,
          "startTime": 1740256335
        },
        {
          "address": "0x00087390c688a36f26e7768e12ab5031f2bd08ddd6b64c457414c4d593c35b41",
          "delegatedStake": "1318442",
          "share": 139.789898341895,
          "startTime": 1738595055
        },
        {
          "address": "0x01bab4684d26a590ab65ad96ced4220b65f9a04f125af5b0683694e0de2ae6b1",
          "delegatedStake": "1229607",
          "share": 130.371026962492,
          "startTime": 1732787475
        },
        {
          "address": "0x016d1b482c6b09534074de866e94994d7110bd221b2544dedaa37f760832d9ae",
          "delegatedStake": "1137719.3439720776",
          "share": 120.628492899546,
          "startTime": 1758556570
        },
        {
          "address": "0x036177b6741a43c219602ce857c18e445920d5a6ea5f4ee3a0240e8ae319bbf5",
          "delegatedStake": "1115447.9670754836",
          "share": 118.267134938932,
          "startTime": 1759767185
        },
        {
          "address": "0x04d549e3a9f052ad1da7761860d04d1a7bdc287b35ec55beb34be6a660aa1170",
          "delegatedStake": "1110533",
          "share": 117.746017781077,
          "startTime": 1738594406
        },
        {
          "address": "0x04c68d0fd46f39b6cd61710146828292de7a154d2f49b60357d3fa128d645d49",
          "delegatedStake": "1100000",
          "share": 116.629239796733,
          "startTime": 1736418517
        },
        {
          "address": "0x03c061744ffd1c38255b78fa921132a9fd55d6ef8261c1548bf55d168728de6f",
          "delegatedStake": "1000000",
          "share": 106.026581633393,
          "startTime": 1733141154
        },
        {
          "address": "0x06bbe106a697f47911d58e8b3a21905aa6d361a4d70668eaeebcb143073b3d43",
          "delegatedStake": "976400",
          "share": 103.524354306845,
          "startTime": 1732878816
        },
        {
          "address": "0x00149389fa8c1583232f2dff1ee54b0f6c127ce40b9d08713b6c8a939d428d94",
          "delegatedStake": "900000",
          "share": 95.4239234700541,
          "startTime": 1742086037
        },
        {
          "address": "0x020996edb1bcba79c736138505acc3103eca4b4f675e79713a135571c1d147ba",
          "delegatedStake": "891725.5058186203",
          "share": 94.546607137257,
          "startTime": 1738585323
        },
        {
          "address": "0x046c35e051a35d45efa2f5a264fb40ffd92c56f6f417f97e63b24a891bcb79a1",
          "delegatedStake": "858964.3359142615",
          "share": 91.0730522819871,
          "startTime": 1732647748
        },
        {
          "address": "0x025bad68b60fedd10fb1c1eb18573e1047f79d280f82e557299f72aaafbb446b",
          "delegatedStake": "857855.00827305",
          "share": 90.955434064278,
          "startTime": 1747326243
        },
        {
          "address": "0x0032525dbea1b2528a9daccfb98c9e6c6890310c23f323387c48682eba28aa2f",
          "delegatedStake": "823402.7899379771",
          "share": 87.3025831245229,
          "startTime": 1743652691
        },
        {
          "address": "0x06c7251de1c6fcf9130ca27ba197b7e0cd2f70e445867bfb544ffcf71baf43c7",
          "delegatedStake": "803021.3882468137",
          "share": 85.1416127743117,
          "startTime": 1733696629
        },
        {
          "address": "0x0427c1be7fbcf425ddd5e8ebbebfb27b19d43e6c37f1f899635474884313ce01",
          "delegatedStake": "799999.9999999999",
          "share": 84.8212653067148,
          "startTime": 1732717542
        },
        {
          "address": "0x00ff464254f6abfab77340fef9024524dec7725984dd6a1f3ec8314fe8f82ab7",
          "delegatedStake": "778799",
          "share": 82.5733957495052,
          "startTime": 1734545218
        },
        {
          "address": "0x00a195c791b5b4210b97658a3da6bb80cb83aa5009e3b519a5b1fcdf3b978862",
          "delegatedStake": "770288.6988588054",
          "share": 81.6710776108336,
          "startTime": 1750167738
        },
        {
          "address": "0x07aab100ae28793134bdf010f860a1efd31037441526018233d30f2030ca03b1",
          "delegatedStake": "685889.8479218361",
          "share": 72.7225559522004,
          "startTime": 1732726394
        },
        {
          "address": "0x05c3a74bb326814b929326364c5ae194ad993356a2a874b09ec02d5c018771c0",
          "delegatedStake": "600000",
          "share": 63.6159489800361,
          "startTime": 1759773380
        }
      ],
      "pagination": {
        "prev": null,
        "next": "/staking/delegators?p=2&ps=25&validator=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        "totalPages": 1375,
        "pageSize": 25,
        "prevPage": null,
        "nextPage": 2,
        "currentPage": 1
      }
    }
    ```
    
- GET `/staking/wallet-info`
    
    **Overview:** 
    
    Returns comprehensive staking information for a specific wallet address, including an overview of total staked amounts and rewards across all validators, as well as detailed information about each individual staking position. This endpoint provides a complete picture of a wallet's staking portfolio across both STRK and BTC assets.
    
    **Params:** 
    **`address`** *(required)* — The wallet address to query (must be a valid hexadecimal string).
    
    **Response:** 
    
    `staking/wallet-info?address=0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18`
    
    ```tsx
    {
      "overview": {
        "totalStakedStrk": "12736221.177654454",
        "totalStakedBtc": "0",
        "totalRewardsClaimedStrk": "911083.4789124725",
        "totalRewardsClaimedBtc": "0",
        "totalRewardsUnclaimedStrk": "4.95992173511402e+21",
        "totalRewardsUnclaimedBtc": "0"
      },
      "staked": [
        {
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "amount": "12736221177654455077713510",
          "rewardAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "rewardsClaimed": "911083478912472488513493",
          "rewardsUnclaimed": "4959921735114019219571",
          "startTime": 1734401823,
          "status": "active",
          "validatorRowInfo": {
            "address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
            "name": "Ready (prev. Argent)",
            "imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
            "isVerified": true,
            "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
            "poolInfos": [
              {
                "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
                "poolContract": "0x01e93567ac481ffddf47f588b2386f35b71655c0b99bd0b62bcd93206199adfa",
                "tokenInfo": {
                  "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
                  "price": 115446,
                  "decimals": 18,
                  "logoUrl": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png",
                  "name": "Solv BTC Token",
                  "symbol": "SolvBTC"
                }
              },
              {
                "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
                "poolContract": "0x024332bca859beefdf0a379b8433a27010c5f38362ad6f9adc01784e8d2f2914",
                "tokenInfo": {
                  "tokenAddress": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
                  "price": 115766,
                  "decimals": 8,
                  "logoUrl": "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872",
                  "name": "Lombard Staked Bitcoin",
                  "symbol": "LBTC"
                }
              },
              {
                "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
                "poolContract": "0x060585bd7db73e127a3afb7be71008b0773981de3201f9f8586a72f6cd4be548",
                "tokenInfo": {
                  "tokenAddress": "0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f",
                  "price": 115467,
                  "decimals": 18,
                  "logoUrl": "https://coin-images.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
                  "name": "tBTC",
                  "symbol": "tbtc"
                }
              },
              {
                "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
                "poolContract": "0x04a8ae152b45b16f22c35a356432435a7d881d4dbd3b1e9c06255fca009fe517",
                "tokenInfo": {
                  "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
                  "price": 115624,
                  "decimals": 8,
                  "logoUrl": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238",
                  "name": "Bridged Wrapped Bitcoin (StarkGate)",
                  "symbol": "wbtc"
                }
              },
              {
                "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                "poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
                "tokenInfo": {
                  "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                  "price": 0.133744,
                  "decimals": 18,
                  "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
                  "name": "Starknet",
                  "symbol": "strk"
                }
              }
            ],
            "startTime": 1758101432,
            "totalStakeStrk": "94311984.92772803",
            "totalStakeBtc": "255.69749640689918",
            "totalStakePercentageStrk": 1545,
            "totalStakePercentageBtc": 0,
            "totalSelfStake": "1764536.9999999998",
            "totalDelegatedStakeStrk": "92547447.92772803",
            "totalDelegatedStakeBtc": "255.69749640689918",
            "aprStrk": 1214,
            "aprBtc": 489,
            "totalDelegators": 34898,
            "revenueShare": 0,
            "rank": "1",
            "liveness": 100
          }
        }
      ]
    }
    
    ```
    
     Non-staking addresses return **404 Not Found** with response `{"error":"address not found"}`.
    
- GET `/staking/delegators-over-time`
    
    **Overview:**
    
    Returns historical data showing how delegator counts and delegation amounts have changed over time. This endpoint has two modes: it can provide delegator trends for a specific validator or network-wide delegator statistics. The time-series data helps visualize staking growth patterns and delegator behavior. 
    
    **Params:**
    
    - **`address`** *(optional)* — Validator address to retrieve specific delegator data for. If omitted, returns network-wide statistics. Must be a valid hex string.
    - **`timerange`** *(optional, default: `"1m"`)* — Time period to query. Must be one of: `"max"`, `"1y"`, `"1m"`, `"1w"`.
    
    **Response:**
    `/staking/delegators-over-time`
    
    ```tsx
    [
      {
        "date": "2025-09-14",
        "delegationCount": 68300,
        "delegationChange": 5
      },
      {
        "date": "2025-09-15",
        "delegationCount": 68302,
        "delegationChange": 2
      },
      {
        "date": "2025-09-16",
        "delegationCount": 68325,
        "delegationChange": 23
      },
      {
        "date": "2025-09-17",
        "delegationCount": 68372,
        "delegationChange": 47
      },
      {
        "date": "2025-09-18",
        "delegationCount": 68439,
        "delegationChange": 67
      },
      {
        "date": "2025-09-19",
        "delegationCount": 68536,
        "delegationChange": 97
      },
      {
        "date": "2025-09-20",
        "delegationCount": 68672,
        "delegationChange": 136
      },
      {
        "date": "2025-09-21",
        "delegationCount": 68965,
        "delegationChange": 293
      },
      {
        "date": "2025-09-22",
        "delegationCount": 69801,
        "delegationChange": 836
      },
      {
        "date": "2025-09-23",
        "delegationCount": 70170,
        "delegationChange": 369
      },
      {
        "date": "2025-09-24",
        "delegationCount": 70202,
        "delegationChange": 32
      },
      {
        "date": "2025-09-25",
        "delegationCount": 70268,
        "delegationChange": 66
      },
      {
        "date": "2025-09-26",
        "delegationCount": 70250,
        "delegationChange": -18
      },
      {
        "date": "2025-09-27",
        "delegationCount": 70241,
        "delegationChange": -9
      },
      {
        "date": "2025-09-28",
        "delegationCount": 70261,
        "delegationChange": 20
      },
      {
        "date": "2025-09-29",
        "delegationCount": 70216,
        "delegationChange": -45
      },
      {
        "date": "2025-09-30",
        "delegationCount": 70398,
        "delegationChange": 182
      },
      {
        "date": "2025-10-01",
        "delegationCount": 70451,
        "delegationChange": 53
      },
      {
        "date": "2025-10-02",
        "delegationCount": 70494,
        "delegationChange": 43
      },
      {
        "date": "2025-10-03",
        "delegationCount": 70466,
        "delegationChange": -28
      },
      {
        "date": "2025-10-04",
        "delegationCount": 70415,
        "delegationChange": -51
      },
      {
        "date": "2025-10-05",
        "delegationCount": 70388,
        "delegationChange": -27
      },
      {
        "date": "2025-10-06",
        "delegationCount": 70367,
        "delegationChange": -21
      },
      {
        "date": "2025-10-07",
        "delegationCount": 70370,
        "delegationChange": 3
      },
      {
        "date": "2025-10-08",
        "delegationCount": 70444,
        "delegationChange": 74
      },
      {
        "date": "2025-10-09",
        "delegationCount": 70175,
        "delegationChange": -269
      },
      {
        "date": "2025-10-10",
        "delegationCount": 70256,
        "delegationChange": 81
      },
      {
        "date": "2025-10-11",
        "delegationCount": 70240,
        "delegationChange": -16
      },
      {
        "date": "2025-10-12",
        "delegationCount": 70242,
        "delegationChange": 2
      },
      {
        "date": "2025-10-13",
        "delegationCount": 70273,
        "delegationChange": 31
      }
    ]
    ```
    
- GET `/staking/stake-over-time`
    
    **Overview:**
    
    Returns historical time-series data showing how staking amounts have changed over time. This endpoint has two modes: it can provide stake history for a specific validator or network-wide staking statistics. The data includes breakdowns by asset type (STRK/BTC) and stake source (own stake vs delegated stake).
    
    **Params:**
    
    - **`address`** *(optional)* — Validator address to retrieve specific stake history for. If omitted, returns network-wide statistics. Must be a valid hex string.
    - **`timerange`** *(optional, default: `"1m"`)* — Time period to query. Must be one of: `"max"`, `"1y"`, `"1m"`, `"1w"` .
    
    Response: 
    `/stake-over-time?timerange=1w`
    
    ```tsx
    [
      {
        "date": "2025-10-07",
        "ownStakeStrk": "36005639.05767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "565848031.23065",
        "delegatedStakeBtc": "525.2081915587773",
        "totalStakeStrk": "601853670.2883292",
        "totalStakeBtc": "525.2081915587773",
        "totalStakeChangeStrk": "661359.4653761912",
        "totalStakeChangeBtc": "14.93427547230884",
        "ownStakeChangeStrk": "0",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "661359.4653761912",
        "delegatedStakeChangeBtc": "14.93427547230884"
      },
      {
        "date": "2025-10-08",
        "ownStakeStrk": "35985639.05767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "566969224.3599876",
        "delegatedStakeBtc": "527.2619060039684",
        "totalStakeStrk": "602954863.4176669",
        "totalStakeBtc": "527.2619060039684",
        "totalStakeChangeStrk": "1101193.1293377038",
        "totalStakeChangeBtc": "2.0537144451910803",
        "ownStakeChangeStrk": "-20000",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "1121193.1293377038",
        "delegatedStakeChangeBtc": "2.0537144451910803"
      },
      {
        "date": "2025-10-09",
        "ownStakeStrk": "35985639.05767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "567653651.022925",
        "delegatedStakeBtc": "568.2021237266287",
        "totalStakeStrk": "603639290.0806043",
        "totalStakeBtc": "568.2021237266287",
        "totalStakeChangeStrk": "684426.6629374154",
        "totalStakeChangeBtc": "40.94021772266024",
        "ownStakeChangeStrk": "0",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "684426.6629374154",
        "delegatedStakeChangeBtc": "40.94021772266024"
      },
      {
        "date": "2025-10-10",
        "ownStakeStrk": "35985639.05767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "569954452.1086876",
        "delegatedStakeBtc": "574.0121527084931",
        "totalStakeStrk": "605940091.1663669",
        "totalStakeBtc": "574.0121527084931",
        "totalStakeChangeStrk": "2300801.085762638",
        "totalStakeChangeBtc": "5.810028981864462",
        "ownStakeChangeStrk": "0",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "2300801.085762638",
        "delegatedStakeChangeBtc": "5.810028981864462"
      },
      {
        "date": "2025-10-11",
        "ownStakeStrk": "35985772.95767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "571203161.3168433",
        "delegatedStakeBtc": "573.782582304897",
        "totalStakeStrk": "607188934.2745225",
        "totalStakeBtc": "573.782582304897",
        "totalStakeChangeStrk": "1248843.1081556422",
        "totalStakeChangeBtc": "-0.22957040359603623",
        "ownStakeChangeStrk": "133.9",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "1248709.2081556423",
        "delegatedStakeChangeBtc": "-0.22957040359603623"
      },
      {
        "date": "2025-10-12",
        "ownStakeStrk": "36006772.95767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "571155566.1886666",
        "delegatedStakeBtc": "576.0591779783537",
        "totalStakeStrk": "607162339.1463459",
        "totalStakeBtc": "576.0591779783537",
        "totalStakeChangeStrk": "-26595.128176701695",
        "totalStakeChangeBtc": "2.276595673456704",
        "ownStakeChangeStrk": "20999.999999999996",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "-47595.12817670169",
        "delegatedStakeChangeBtc": "2.276595673456704"
      },
      {
        "date": "2025-10-13",
        "ownStakeStrk": "35966572.95767932",
        "ownStakeBtc": "0",
        "delegatedStakeStrk": "573275729.502912",
        "delegatedStakeBtc": "584.7898991453732",
        "totalStakeStrk": "609242302.4605913",
        "totalStakeBtc": "584.7898991453732",
        "totalStakeChangeStrk": "2079963.3142454252",
        "totalStakeChangeBtc": "8.730721167019494",
        "ownStakeChangeStrk": "-40200",
        "ownStakeChangeBtc": "0",
        "delegatedStakeChangeStrk": "2120163.314245425",
        "delegatedStakeChangeBtc": "8.730721167019494"
      }
    ]
    ```
    
- GET `/staking/wallet-info/stake-over-time`
    
    **Overview:** 
    
    Returns historical time-series data showing how a specific wallet's staking amounts have changed over time. This endpoint provides a complete view of a delegator's staking journey, including their total staked amounts across all validators and daily changes in both STRK and BTC assets. Ideal for personal portfolio tracking and visualizing individual staking behavior.
    
    **Params:**
    
    - **`address`** *(required)* — Wallet address to retrieve stake history for. Must be a valid hex string.
    - **`timerange`** *(optional, default: `"1m"`)* — Time period to query. Must be one of: `"max"`, `"1y"`, `"1m"`, `"1w"`.
    
    **Response:** 
    `/staking/wallet-info/stake-over-time?address=0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18`
    
    ```tsx
    [
      {
        "date": "2025-09-14",
        "totalStakeStrk": "12615228.283518454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-15",
        "totalStakeStrk": "12615228.283518454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-16",
        "totalStakeStrk": "12615228.283518454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-17",
        "totalStakeStrk": "12626783.528718455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "11555.245200000001",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-18",
        "totalStakeStrk": "12626783.528718455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-19",
        "totalStakeStrk": "12634936.212824455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "8152.684106",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-20",
        "totalStakeStrk": "12634936.212824455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-21",
        "totalStakeStrk": "12634936.212824455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-22",
        "totalStakeStrk": "12634936.212824455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-23",
        "totalStakeStrk": "12634936.212824455",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-24",
        "totalStakeStrk": "12648797.447524454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "13861.2347",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-25",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "87423.73013",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-26",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-27",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-28",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-29",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-09-30",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-01",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-02",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-03",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-04",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-05",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-06",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-07",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-08",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-09",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-10",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-11",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-12",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      },
      {
        "date": "2025-10-13",
        "totalStakeStrk": "12736221.177654454",
        "totalStakeBtc": "0",
        "totalStakeChangeStrk": "0",
        "totalStakeChangeBtc": "0"
      }
    ]
    ```
    
- GET `/staking/wallet-info/activity`
    
    **Overview:** 
    
    Returns a paginated list of all staking-related activities for a specific wallet address. Provides a complete transaction history including stakes, withdrawals, reward claims, and stake movements. Supports filtering by operation type, destination validator, date range, and search terms. The response includes metadata about available filters, making it ideal for interactive activity dashboards.
    
    **Params:**
    
    - **`address`** *(required)* — Wallet address to query activity for (must be a valid hex string).
    - **`p`** *(optional, default: `1`)* — Page number.
    - **`ps`** *(optional, default: `25`)* — Page size.
    - **`destination`** *(optional)* — Filter by destination validator address.
    - **`sort`** *(optional, default: `"DESC"`)* — Sort order by timestamp. Must be `"ASC"` or `"DESC"`.
    - **`start`** *(optional)* — Start date filter (ISO 8601 format, e.g., `"2024-01-01"`).
    - **`end`** *(optional)* — End date filter (ISO 8601 format, e.g., `"2024-12-31"`).
    - **`operation`** *(optional)* — Filter by operation type (see available operation types).
    - **`search`** *(optional)* — Search term to filter activities by destination names or addresses.
    
    **Response:**
    `staking/wallet-info/activity?address=0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18&p=1&ps=10`
    
    ```tsx
    {
      "items": [
        {
          "timestamp": "2025-10-12T18:11:57.000Z",
          "name": "delegator_claim_rewards",
          "amount": "4433882725066115659691",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x6bbc6b138244c1871c2a81895b798dd1e3fea3e91bcd10bf58e710198455553",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "timestamp": "2025-10-11T16:48:50.000Z",
          "name": "delegator_claim_rewards",
          "amount": "4968693243870593589359",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x5858ac8d46e84d9e96f105f8cbfc1d60f94ade62a1363ba66eb9b7673e86dba",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "timestamp": "2025-10-10T16:23:17.000Z",
          "name": "delegator_claim_rewards",
          "amount": "6401473851436190251823",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x78315d9f52223858024b933999320f866932f4b7b39619866727fd6234c2863",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "timestamp": "2025-10-09T14:58:45.000Z",
          "name": "delegator_claim_rewards",
          "amount": "5872590174852203905097",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x57e1fa82b12b72e6a95e893cd876ad9d4f62e949ae65354ba7e7a7b6545bd0c",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "timestamp": "2025-10-08T15:45:25.000Z",
          "name": "delegator_claim_rewards",
          "amount": "5875470497361825783698",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x2d600d9af2aa132dfc745c7e289cdbbb7293960e713d85fd2a5adcecc00e737",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "timestamp": "2025-10-07T22:45:35.000Z",
          "name": "delegator_claim_rewards",
          "amount": "0",
          "delegatorAddress": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
          "destination": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
          "txnHash": "0x2e8f32adc4518c00b385cd84dc7efa03857c8a817b18aea6ab452f38bf03ea7",
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132298,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
    { 
    ...
    }
      ],
      "pagination": {
        "prev": null,
        "next": "/staking/wallet-info/activity?p=2&ps=10&address=0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18&sort=DESC",
        "totalPages": 28,
        "pageSize": 10,
        "prevPage": null,
        "nextPage": 2,
        "currentPage": 1
      },
      "meta": {
        "operationsAvailable": [
          "delegator_claim_rewards",
          "delegator_stake"
        ],
        "destinationsAvailable": [
          {
            "value": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
            "name": "wallet",
            "iconSrc": null
          },
          {
            "value": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
            "name": "Ready (prev. Argent)",
            "iconSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png"
          }
        ]
      }
    }
    ```
    
- **GET** `/staking/validator-details/activity`
    
    **Overview:**
    
    Returns a paginated list of all staking-related activities for a specific validator. Provides a full transaction history including the validator’s own stake operations, delegator interactions, reward claims, and withdrawals. Supports filtering by operation type, delegator, date range, and search terms. Ideal for validator monitoring, analytics, and building validator-specific activity dashboards.
    
    **Params:**
    
    - **`address`** *(required)* — Validator address to query activity for (must be a valid hex string).
    - **`p`** *(optional, default: `1`)* — Page number.
    - **`ps`** *(optional, default: `25`)* — Page size.
    - **`sort`** *(optional, default: `"DESC"`)* — Sort order by timestamp. Must be `"ASC"` or `"DESC"`.
    - **`start`** *(optional)* — Start date filter (ISO 8601 format, e.g., `"2024-01-01"`).
    - **`end`** *(optional)* — End date filter (ISO 8601 format, e.g., `"2024-12-31"`).
    - **`operation`** *(optional)* — Filter by operation type (see list below).
    - **`search`** *(optional)* — Search term to filter activities by delegator addresses or names.
    
    **Operation Types:**
    
    - `"validator_stake"` — Validator stakes their own tokens.
    - `"validator_withdrawal_initiated"` — Validator initiates a withdrawal/unstaking.
    - `"validator_withdrawal_completed"` — Validator completes the unstaking process.
    - `"validator_claim_rewards"` — Validator claims their staking rewards.
    - `"delegator_stake"` — A delegator stakes tokens to this validator.
    - `"delegator_withdrawal_initiated"` — A delegator initiates withdrawal from this validator.
    - `"delegator_withdrawal_cancelled"` — A delegator cancels a pending withdrawal.
    - `"delegator_withdrawal_completed"` — A delegator completes withdrawal from this validator.
    - `"delegator_move_stake"` — A delegator moves stake to or from this validator.
    - `"delegator_claim_rewards"` — A delegator claims rewards from this validator.
    
    **Response:**
    
    `staking/validator-details/activity?address=0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e&p=1&ps=10`
    
    ```tsx
    {
      "items": [
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T22:00:43.000Z",
          "name": "delegator_stake",
          "amount": "954955187488333",
          "delegatorAddress": "0x076d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "Karnot",
          "destinationIcon": "https://framerusercontent.com/images/uGXghZXK5r0SWNIiJdjpAL6kdE.png",
          "source": "0x076d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
          "destination": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "txnHash": "0xb7b5d55d8fc56cff435ebfd9adbf4d37915f9392dfd191192dcbb05be9b2e5",
          "tokenInfo": {
            "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
            "price": 115338,
            "decimals": 18,
            "logoUrl": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png",
            "name": "Solv BTC Token",
            "symbol": "SolvBTC"
          }
        },
        {
          "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
          "timestamp": "2025-10-13T22:00:00.000Z",
          "name": "delegator_stake",
          "amount": "19070",
          "delegatorAddress": "0x04c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "Karnot",
          "destinationIcon": "https://framerusercontent.com/images/uGXghZXK5r0SWNIiJdjpAL6kdE.png",
          "source": "0x04c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
          "destination": "0x01b192e624a13b3911dad66c5ea32959af2f8a31f9bc101c88737b589cb81341",
          "txnHash": "0x7d771e26f7b8d60c0674eb174f74dac3e2a79143fbd653e86057a77ee9a68ae",
          "tokenInfo": {
            "tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
            "price": 115696,
            "decimals": 8,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238",
            "name": "Bridged Wrapped Bitcoin (StarkGate)",
            "symbol": "wbtc"
          }
        },
        {
          "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          "timestamp": "2025-10-13T21:30:30.000Z",
          "name": "delegator_stake",
          "amount": "505928224105854126385",
          "delegatorAddress": "0x056f71331dab1e0d790c364fc365118f479648e963e89101725ccbb24083e787",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "Karnot",
          "destinationIcon": "https://framerusercontent.com/images/uGXghZXK5r0SWNIiJdjpAL6kdE.png",
          "source": "0x056f71331dab1e0d790c364fc365118f479648e963e89101725ccbb24083e787",
          "destination": "0x07d695337550e96e1372dd03274965cca0284ded266efc1774d001d37fbca104",
          "txnHash": "0x48c8c1c338132d2c99b63a8f7a91ec491cf691ff0bbfd106b22cc3d97241a36",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:30:18.000Z",
          "name": "delegator_stake",
          "amount": "953544261689019",
          "delegatorAddress": "0x076d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "Karnot",
          "destinationIcon": "https://framerusercontent.com/images/uGXghZXK5r0SWNIiJdjpAL6kdE.png",
          "source": "0x076d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
          "destination": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "txnHash": "0x71dd39b9da6c9afef96e093dbaf3176e758e156bac1991eabe06d66f91112c3",
          "tokenInfo": {
            "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
            "price": 115338,
            "decimals": 18,
            "logoUrl": "https://raw.githubusercontent.com/solv-finance/solv-resources/refs/heads/main/SolvBTC/SolvBTC.png",
            "name": "Solv BTC Token",
            "symbol": "SolvBTC"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "20482673839310204649",
          "delegatorAddress": "0x0472f5bef8f656bca4fbff5f509ab9d52179091c3f900586216a54b9c4515ea8",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x0472f5bef8f656bca4fbff5f509ab9d52179091c3f900586216a54b9c4515ea8",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "28117139870928743768",
          "delegatorAddress": "0x02421c00f63b6e46f350088275484123512e07ffac333fe5070907cc22694325",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x02421c00f63b6e46f350088275484123512e07ffac333fe5070907cc22694325",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "36436803543875110448",
          "delegatorAddress": "0x06427a04f1dd6d758013e3c236974fc522592d559f571f97ead8c9d55b115d6a",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x06427a04f1dd6d758013e3c236974fc522592d559f571f97ead8c9d55b115d6a",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "5604186901670608095",
          "delegatorAddress": "0x04ee7a2dfcd28c4f10af12999004714f0a56753cfe1f35d683edd8016fc18710",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x04ee7a2dfcd28c4f10af12999004714f0a56753cfe1f35d683edd8016fc18710",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "9144482448303761906",
          "delegatorAddress": "0x02e57d9d68e839a510b2b5839bff6b9d3bae46d0548b7867779e41e11e86b2d4",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x02e57d9d68e839a510b2b5839bff6b9d3bae46d0548b7867779e41e11e86b2d4",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        },
        {
          "tokenAddress": "0x0593e034dda23eea82d2ba9a30960ed42cf4a01502cc2351dc9b9881f9931a68",
          "timestamp": "2025-10-13T21:26:59.000Z",
          "name": "delegator_claim_rewards",
          "amount": "1771034516595643146",
          "delegatorAddress": "0x04c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
          "stakerAddress": "0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e",
          "destinationName": "wallet",
          "destinationIcon": null,
          "source": "0x069698e75bfad32b58cd5185e29022c0394a4c92853dd9e853c7cd5afbb5f96e",
          "destination": "0x04c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
          "txnHash": "0x2c53223f51d3bbbe940c04bf5af3742a68f1e190e6cbf516a430b7d5f6a0998",
          "tokenInfo": {
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "price": 0.132316,
            "decimals": 18,
            "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
            "name": "Starknet",
            "symbol": "strk"
          }
        }
      ],
      "pagination": {
        "prev": null,
        "next": "/staking/validator-details/activity?p=2&ps=10&address=0x072543946080646d1aac08bb4ba6f6531b2b29ce41ebfe72b8a6506500d5220e&sort=DESC",
        "totalPages": 42888,
        "pageSize": 10,
        "prevPage": null,
        "nextPage": 2,
        "currentPage": 1
      },
      "meta": {
        "operationsAvailable": [
          "delegator_claim_rewards",
          "delegator_move_stake",
          "delegator_stake",
          "delegator_withdrawal_cancelled",
          "delegator_withdrawal_completed",
          "delegator_withdrawal_initiated",
          "validator_stake"
        ],
        "destinationsAvailable": [
          {
            "value": "0x0003d8b6cd42ea7a3fbb5ead8e3b1e07f7275aca7b61ce1b94c6207eb24e2b0b",
            "name": "wallet",
            "iconSrc": null
          },
          {
            "value": "0x0007e17ab90d2abf29b1a2b418567067d7f1ce49602feb29ac11901e35fb965e",
            "name": "wallet",
            "iconSrc": null
          },
          {
            "value": "0x000874f47c038abf34c771cb9911146a007a10ca534e22d9c8473b2747556039",
            "name": "wallet",
            "iconSrc": null
          },
          {
            "value": "0x0008ecbc226d3b3eae40e05bb681291909fac2742d7f185b53d58986a19ca645",
            "name": "wallet",
            "iconSrc": null
          },
    {
    ......
    
    }
        ]
      }
    }
    ```
    
- **GET** `/staking/attestations`
    
    **Overview:**
    
    Returns a paginated list of attestations made by validators in the staking system. Attestations are cryptographic confirmations made by validators at each epoch to prove their liveness and participation in consensus. This endpoint has two modes: it can return all attestations from all validators, or filter attestations for a specific validator. Useful for monitoring validator liveness, analyzing participation rates, and building validator performance dashboards.
    
    **Params:**  
    
    - **`validator`** *(optional)* — Validator address to filter attestations for. If omitted, returns attestations from all validators. Must be a valid hex string.
    - **`p`** *(optional, default: `1`)* — Page number.
    - **`ps`** *(optional, default: `25`)* — Page size.
    
    **Response: 
    `/staking/attestations?validator=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7`**
    
    ```tsx
    {
      "items": [
        {
          "epochId": 4699,
          "blockNumber": 2967699,
          "transactionHash": "0x4040aa040b202dd066be094aa54f509ca97a5b4ad00c1842c0b5dd8e931f54f"
        },
        {
          "epochId": 4698,
          "blockNumber": 2965872,
          "transactionHash": "0x13412c42b2f2c6e9a48fe737c7fee61269d6f234e40c9dab2f38c91f23c4380"
        },
        {
          "epochId": 4697,
          "blockNumber": 2964956,
          "transactionHash": "0x56aeaa194350cfa4fa762a6a4471ddf71ba35927189978d3788e812bc7e957e"
        },
        {
          "epochId": 4696,
          "blockNumber": 2963688,
          "transactionHash": "0x1a2d02e86288111d536ca9d977d8b308e0cd478db18c14c0ff111da9b39f568"
        },
        {
          "epochId": 4695,
          "blockNumber": 2963452,
          "transactionHash": "0x4de145ea9fd0704266976ec214fb65ad90040444e0f67be3371467f0e38d799"
        },
        {
          "epochId": 4694,
          "blockNumber": 2961873,
          "transactionHash": "0x68c1e2933eaa3d5614948b949080484c9271356ef7a01bf58443d6cd34cc19b"
        },
        {
          "epochId": 4693,
          "blockNumber": 2961241,
          "transactionHash": "0xc1ace71f2f516f34fc63782f218c88cceac4532a2195f13493b08a135dd711"
        },
        {
          "epochId": 4692,
          "blockNumber": 2959649,
          "transactionHash": "0x3537e10982bb51a20d65e61e03a314fcce2739e406f50757774c6a96bb85755"
        },
        {
          "epochId": 4691,
          "blockNumber": 2958282,
          "transactionHash": "0x6bb2e88d51a96820ae5e3faa2c944b10b754999280b56b5b14d91e3fa9527ce"
        },
        {
          "epochId": 4690,
          "blockNumber": 2957339,
          "transactionHash": "0x633e6ad7c464a4b00a62f5160029721cd55a425b9365d548a1e749cb0157c8b"
        }
      ],
      "pagination": {
        "prev": null,
        "next": "/staking/attestations?p=2&ps=10&validator=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        "totalPages": 470,
        "pageSize": 10,
        "prevPage": null,
        "nextPage": 2,
        "currentPage": 1
      }
    }
    ```
    

## Daily-Stats

- **GET**  `/daily-stats/today`
    
    **Params:**
    
    - `hours` — Time window for stats aggregation.
        
        Accepts: **1h**, **4h**, or **24h** *(default: 24h)*
        
    
    **Example:**
    
    `/daily-stats/today?hours=4h` → returns stats for the last 4 hours
    
    Response example:  
    
    **24h stats response**
    
    ```tsx
    {
      "date": "2025-10-09",
      "timeRange": "24h",
      "transactionStats": { 
        "transactions_per_block": 12.6508660667285,
        "transactions_per_second": 5.8421619243859,
        "transactions_count": 504681,
        "max_transactions_per_second": 45
      },
      "userOperationsStats": {
        "user_operations_count": "16699384",
        "user_operations_per_block": 436.939323373191,
        "user_operations_per_second": 198.530392914462,
        "max_user_operations_per_second": 2453
      },
      "networkStats": {
        "classes_count": 38,
        "events_count": 35413518,
        "messages_count": 189,
        "contracts_count": 6926
      },
      "blockCreationTime": {
        "proofGenerationTime": 21221.6246176564,
        "l1BlockCreationTime": 2.41535702984917,
        "l2BlockCreationTime": 2.16549684147197
      },
      "accountStats": {
        "lastUpdated": "2025-10-09T15:07:31.000Z",
        "totalAccountContracts": {
          "total": 5935627,
          "argentx": 3245699,
          "braavos": 973853,
          "okx": 762158,
          "cartridge": 25535,
          "xverse": 115,
          "cex": 733075,
          "others": 300501
        },
        "accountsGrowth": {
          "total": 4235,
          "argentx": 3509,
          "braavos": 90,
          "okx": 60,
          "cartridge": 48,
          "xverse": "0",
          "cex": 77,
          "others": 451
        },
        "activeAccounts": {
          "total": 29627,
          "argentx": 27473,
          "braavos": 1121,
          "okx": 82,
          "cartridge": 211,
          "xverse": 4,
          "cex": 155,
          "others": 581
        }
      },
      "tvlStats": {
        "lastUpdated": "2025-10-09T15:07:31.000Z",
        "totalValueLocked": 842484712.881205
      },
      "blockFeeTracker": {
        "lastUpdated": "2025-10-09T15:07:31.000Z",
        "l1BlockVerificationCost": 0.000001415683440285,
        "totalBlockFee": 0.000109558007736473,
        "totalGasUsed": {
          "l1Gas": "115",
          "l1DataGas": "12474",
          "l2Gas": "1003998907"
        }
      }. 
    }
    ```
    
    4**h stats response**
    
    ```tsx
    {
      "date": "2025-10-09",
      "timeRange": "4h",
      "transactionStats": {
        "transactions_per_block": 12.7689681753111,
        "transactions_per_second": 8.06250869141983,
        "transactions_count": 115955,
        "max_transactions_per_second": 45
      },
      "userOperationsStats": {
        "user_operations_count": "3470998",
        "user_operations_per_block": 463.913124832932,
        "user_operations_per_second": 285.185933777011,
        "max_user_operations_per_second": 2453
      },
      "networkStats": {
        "classes_count": 24,
        "events_count": 8376633,
        "messages_count": 46,
        "contracts_count": 2123
      },
      "blockCreationTime": {
        "proofGenerationTime": "0",
        "l1BlockCreationTime": "0",
        "l2BlockCreationTime": 1.58392070484582
      }
    }
    ```
    
    ### **Notes**
    
    - **transactionStats**, **userOperationsStats**, **networkStats**, and **blockCreationTime**
        
        → Real-time values calculated dynamically for the selected range (**1h**, **4h**, or **24h**).
        
        → Represent network activity from *now − X hours → now*.
        
    - **accountStats.totalAccountContracts** and **tvlStats**
        
        → Represent **all-time cumulative values**, not limited to the current day.
        
        → Updated **hourly** and include a `lastUpdated` timestamp.
        
    - **accountStats.accountsGrowth**, **accountStats.activeAccounts**, and **blockFeeTracker**
        
        → Updated **hourly** and represent **daily cumulative values** (from **00:00 UTC → now**).
        
    - **Availability:**
        - `1h` and `4h` → include **only real-time** objects (`transactionStats`, `userOperationsStats`, `networkStats`, `blockCreationTime`).
        - `24h` → includes **all objects** (real-time + hourly cumulative + all-time).
    - All timestamps are in **UTC**.
    - Hourly objects refresh **every hour**; real-time objects are **continuously updated**.
- **GET** `/daily-stats`
    
    ### **Overview**
    
    The **Daily-Stats** service provides historical and real-time metrics about the Starknet network — including transactions, user operations, account growth, gas usage, fees, and total value locked (TVL).
    
    It supports querying individual metrics or all available metrics across specified time ranges.
    
    ---
    
    Retrieves aggregated metrics for the Starknet network over a specified time range.
    
    ---
    
    ### **Parameters**
    
    - **`metrics`** *(string, optional, default: `"*"`)*
        
        The metric to return.
        
        - `"*"` — returns all available metrics snapshot for 1d ago
        - See **Metric Categories** below for supported values.
    - **`timerange`** *(string, optional, default: `"1m"`)*
        
        Defines how far back to aggregate data.
        
        Accepts:
        
        - `"max"` — all available data
        - `"1y"` — last 1 year
        - `"1m"` — last 1 month *(default)*
        - `"1w"` — last 1 week
        - `"1d"` — last 1 day
    
    ---
    
    ### **Examples**
    
    ```bash
    # Get all metrics for the last month
    GET /daily-stats/
    
    # Get transaction metrics for the last week
    GET /daily-stats/?metrics=transactions_count&timerange=1w
    
    # Get TVL data for the last year
    GET /daily-stats/?metrics=tvl&timerange=1y
    
    # Get user operations count for all time
    GET /daily-stats/?metrics=user_operations_count&timerange=max
    
    ```
    
    ---
    
    ### **Metric Categories**
    
    ### **Standard Metrics** *(numeric series)*
    
    Each item in the response contains `{ date, value, commulative_value? }`.
    
    - **Transaction & Operations Metrics:**
        
        `transactions_per_block`, `transactions_per_second`, `transactions_count`, `max_transactions_per_second`,
        
        `user_operations_count`, `user_operations_per_block`, `user_operations_per_second`, `max_user_operations_per_second`
        
    - **Account Call Metrics:**
        
        `account_calls_count`, `account_calls_per_block`, `account_calls_per_second`, `max_account_calls_per_second`
        
    - **Network Metrics:**
        
        `classes_count`, `events_count`, `messages_count`, `contracts_count`,
        
        `cairo_1_classes`, `cairo_1_contracts`, `account_contracts_count`, `active_account_contracts`
        
    - **Block Metrics:**
        
        `l1_block_creation_time`, `l2_block_creation_time`, `proof_generation_time`
        
    
    ---
    
    ### **Special Metrics** *(structured data per day)*
    
    - **`account_contracts`** — Daily and cumulative account contracts by wallet type (ArgentX, Braavos, OKX, Cartridge, etc.)
    - **`active_accounts`** — Active accounts by wallet type per day
    - **`fee_per_block`** — Fees per block in USD, ETH, and STRK
    - **`gas_per_block`** — Average L1, L1 data, and L2 gas usage per block
    - **`tvl`** — Total value locked by token and protocol
    - **`eth_transfer_fee`, `usdc_transfer_fee`, `swap_fee`, `nft_mint_fee`** — L1 vs L2 cost comparison
    - **`starkgate_eth_deposit_fee`, `starkgate_eth_withdrawal_fee`** — Bridge deposit and withdrawal costs
    - **`l1_block_verification_cost`** — Average block verification cost on L1
    
    ---
    
    ## **Response Examples**
    
    ### **1. transactions_count**
    
    ```json
    {
      "items": [
        { "date": "2025-10-03", "value": 285671, "commulative_value": "234297810" },
        { "date": "2025-10-09", "value": 566253, "commulative_value": "236766700" }
      ]
      ...
    }
    
    ```
    
    ---
    
    ### **2. account_contracts**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "value": 3436,
          "argentx_value": 2872,
          "braavos_value": 29,
          "okx_value": 27,
          "cartridge_value": 70,
          "xverse_value": 0,
          "cex_value": 54,
          "others_value": 384,
          "commulative_value": 5905805,
          "argentx_commulative_value": 3220775
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **3. active_accounts**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "value": 42071,
          "argentx_value": 39823,
          "braavos_value": 1125,
          "okx_value": 59,
          "cartridge_value": 259,
          "xverse_value": 4,
          "cex_value": 171,
          "others_value": 630
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **4. fee_per_block**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "fee_per_block_usd": 0.257081927047261,
          "fee_per_block_eth": 0.000058259024335732,
          "fee_per_block_strk": 1.64507165009702
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **5. gas_per_block**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_gas_per_block": 124,
          "l1_data_gas_per_block": 12444,
          "l2_gas_per_block": 546958633
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **6. tvl (Total Value Locked)**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "tvl_total": "781437009.26",
          "tvl_strk": "353727394.74",
          "tvl_usdc": "109967092.64",
          "tvl_eth": "104115088.78",
          "tvl_wbtc": "34319927.04",
          ...etc
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **7. eth_transfer_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_value_eth": 0.000882886290308206,
          "l1_value_usd": 3.89594764869463,
          "l2_value_eth": 0.000001994813164636,
          "l2_value_usd": 0.00880259184411586,
          "l2_vs_l1": 0.0022594225174112
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **8. usdc_transfer_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_value_eth": 0.00148877811203525,
          "l1_value_usd": 6.56959072610243,
          "l2_value_eth": 0.000002052070064617,
          "l2_value_usd": 0.00905525165693802,
          "l2_vs_l1": 0.00137835856668506
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **9. swap_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_value_eth": 0.00170606557020074,
          "l1_value_usd": 7.52842378424761,
          "l2_value_eth": 0.000003076856131792,
          "l2_value_usd": 0.0135773661270038,
          "l2_vs_l1": 0.00180348058452992
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **10. nft_mint_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_value_eth": 0.000278687706821344,
          "l1_value_usd": 1.22977639139882,
          "l2_value_eth": 0.000001313664295234,
          "l2_value_usd": 0.00579685898215088,
          "l2_vs_l1": 0.00471375042055996
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **11. starkgate_eth_deposit_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "starkgate_eth_deposit_fee_eth": 0.000102501700840235,
          "starkgate_eth_deposit_fee_usd": 0.452313355365739
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **12. starkgate_eth_withdrawal_fee**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "starkgate_eth_withdrawal_fee_eth": 0.000084363284356855,
          "starkgate_eth_withdrawal_fee_usd": 0.372273239412868,
          "starkgate_eth_initiate_withdrawal_fee_eth": 0.000038625020222715,
          "starkgate_eth_initiate_withdrawal_fee_usd": 0.170442171737583,
          "starkgate_eth_withdrawal_fee_total_eth": 0.00012298830457957,
          "starkgate_eth_withdrawal_fee_total_usd": 0.542715411150452
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **13. l1_block_verification_cost**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-03",
          "l1_block_verification_cost_eth": 0.000001690258647003,
          "l1_block_verification_cost_usd": 0.00745867194197721
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **14. All Metrics (`metrics=*`)**
    
    ```json
    {
      "items": [
        {
          "date": "2025-10-10",
          "transactions_per_block": 15.1263,
          "transactions_per_second": 5,
          "transactions_count": 236929217,
          "max_transactions_per_second": 75,
          "classes_count": 69141,
          "events_count": 1714988557,
          "messages_count": 2124208,
          "contracts_count": 6474504,
          "cairo_1_classes": 60607,
          "cairo_1_contracts": 4165153,
          "account_contracts_count": 5940126,
          "daily_account_contracts": 1474,
          "active_account_contracts": 13225,
          "l1_block_creation_time": 0.1423,
          "l2_block_creation_time": 2.7074,
          "proof_generation_time": 20412.98,
          "user_operations_count": 517262851,
          "user_operations_per_block": 683.04,
          "user_operations_per_second": 252.31,
          "max_user_operations_per_second": 2540,
          "fee_per_block": 0.00012555,
          "eth_transfer_fee": 0.000002205,
          "usdc_transfer_fee": 0.000002458,
          "swap_fee": 0.000003373,
          "nft_mint_fee": 0.000001536,
          "starkgate_eth_deposit_fee": 0.000112518,
          "starkgate_eth_total_withdrawal_fee": 0.000251875,
          "block_verification_cost_eth": 0.0000013746,
          "last_updated": 1760083682
        },
        ...
      ]
    }
    
    ```
    
    ---
    
    ### **Notes**
    
    - All timestamps are in **UTC**.
    - `commulative_value` appears only for metrics with cumulative tracking.
    - Special metrics include detailed per-token or per-wallet breakdowns.
    - For `"*"` (all metrics), the latest available daily snapshot is returned.

---

- to be exposed soon
    
    ## NFTs
    
    - **get** `/nft-contract/{contractAddress}`
        
        *Get details of a specific NFT contract.*
        
        ```tsx
        // Example Response
        {
          "contract_address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
          "contract_type": 6,
          "name": "Pxls",
          "description": "Four hundred pxls, one unique collaborative rtwrk every day",
          "symbol": "PXLS",
          "image_url": "<https://cdn-dev.voyager.online/0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a/contract_image/0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a_original.jpeg>",
          "external_url": "<https://pxls.wtf/>",
          "banner_url": "<https://cdn-dev.voyager.online/0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a/contract_banner/0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a_banner.jpeg>",
          "created_at_block_number": 3395,
          "creator_address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
          "latest_activity": {
            "token_id": "305",
            "transaction_hash": "0x66dbc299d1490cab75f15bf5be67eb6355a80833691feaefcf8afd61aa26b76",
            "timestamp": 1705605527,
            "type": "Transfer"
          },
          "stats": {
            "total_supply": "400",
            "total_owners": "400",
            "total_sales_volume": "0",
            "average_price": "0"
          },
          "is_verified": false
        }
        }
        
        ```
        
    - **get** `/nft/{contractAddress}/{tokenId}`
        
        *Get details of a specific NFT token by ID.*
        
        ```tsx
        // Example Response
        {
          "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
          "token_id": "1",
          "contract_type": 6,
          "name": "mfer #1",
          "collection_name": "collection mfer",
          "description": "mfers by sartoshi",
          "external_url": null,
          "attributes": [],
          "image_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/1/token_image/1_original.png>",
          "image_small_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/1/token_image/1_small.png>",
          "image_large_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/1/token_image/1_large.png>",
          "minted_by_address": "0x020a1dbc9750d49d57fcd564d7db866f6a1e45e45d28d365099b1ce92c87f2ab",
          "minted_at_timestamp": 1662454997,
          "minted_at_block_number": 4802,
          "minted_at_transaction_hash": "0x5d72c4157af51748f922453d435b7ba21f455c5bdca78f82beeaf30a0450dc9",
          "balance": {
            "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
            "token_id": "1",
            "owner_address": "0x020a1dbc9750d49d57fcd564d7db866f6a1e45e45d28d365099b1ce92c87f2ab"
          },
          "latest_activity": {
            "token_id": "1",
            "transaction_hash": "0x5d72c4157af51748f922453d435b7ba21f455c5bdca78f82beeaf30a0450dc9",
            "timestamp": 1662454997,
            "type": "Mint"
          },
          "is_verified": false
        }
        }
        
        ```
        
    - **get** `/nft-events`
        
        *Get NFT events for a specific contract.*
        
        params:
        
        `contract_address:` The address of the NFT contract.
        
        `cursor:` Pagination cursor.
        
        `limit:` Number of items per page (max 25).
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "transaction_hash": "0x677e52c82793f8dd155b3422afd647521fd8d87c63e024170916af7ceecf997",
              "block_number": 69515,
              "token_id": "59",
              "from_address": "0x0411f475ea06286ce6cb6d11787ccae6d2b0748a18b20b9e15172cbe52aabdef",
              "to_address": "0x036e32229ba08f835345d4f741659bff2b58c27c35ac06ebf0b7d1567bd1bea5",
              "nft_contract_address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
              "quantity": "1",
              "payment_contract_address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
              "total_price": "4100000000000000",
              "marketplace_contract_address": "0x079b882cb8200c1c1d20e849a2ef19124b0b8985358c1313ea6af588cfe4fec8",
              "timestamp": 1685665993,
              "type": "Sale",
              "name": "mfer #3",
              "image_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/3/token_image/3_original.png>",
              "image_small_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/3/token_image/3_small.png>",
              "image_large_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/3/token_image/3_large.png>"
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nft-balances`
        
        *Get NFT balances for a specific contract.*
        
        params:
        
        `contract_address:` The address of the NFT contract.
        
        `token_id:` Token ID to filter.
        
        `p:` Pagination page number.
        
        `ps:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "contract_address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
              "token_id": "68",
              "owner_address": "0x000000000000000000000000000000000000000000000000000000000000dead",
              "balance": 1,
              "last_transfer_time": 1677836927
            }
          ],
          "pagination": {
            "prev": "/nft-balances?contract_address=...&p=1&ps=25",
            "next": "/nft-balances?contract_address=...&p=2&ps=25"
          }
        }
        }
        
        ```
        
    - **get** `/nft-holders`
        
        *Get holders of a specific NFT contract.*
        
        params:
        
        `contract_address:` Contract address.
        
        `token_id:` Token ID.
        
        `p:` Pagination page number.
        
        `ps:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "contract_address": "0x023b12a73d3744ab66e98d2aef1ae57b136c1334fac2c1268b5e4cb3bcad0ec9",
              "owner_address": "0x03db5177bd2f5295e84518158b64edb7453d61476ea41bf454db27e77219aa1e",
              "balance": 1
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nft-items`
        
        *Get all NFT tokens owned by an address.*
        
        params:
        
        `contract_address:` The NFT contract address.
        
        `owner_address:` Owner's wallet address.
        
        `cursor:` Pagination cursor.
        
        `limit:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
              "token_id": "3",
              "contract_type": 6,
              "name": "mfer #3",
              "description": "mfers by sartoshi",
              "external_url": null,
              "attributes": [],
              "image_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/3/token_image/3_original.png>",
              "minted_by_address": "0x0022e4484f3d06478f2d65bbeee215c8f9594a629c93d785d834a76bb4b9db48",
              "minted_at_timestamp": 1662454997,
              "minted_at_block_number": 4802,
              "minted_at_transaction_hash": "0x31bf97b563724a6177ded959627ccf9aac7bd42a0b5489084ba456958a65b1d",
              "balance": {
                "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
                "token_id": "3",
                "owner_address": "0x0022e4484f3d06478f2d65bbeee215c8f9594a629c93d785d834a76bb4b9db48",
                "balance": 1
              }
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nft-contract-balance`
        
        *Get the balance of a specific NFT contract for an owner.*
        
        params:
        
        `owner_address:` Owner's address.
        
        `cursor:` Pagination cursor.
        
        `limit:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
              "token_id": "3",
              "owner_address": "0x0022e4484f3d06478f2d65bbeee215c8f9594a629c93d785d834a76bb4b9db48",
              "balance": 1,
              "last_transfer_time": 1662454997,
              "token_name": "mfer #3",
              "token_description": "mfers by sartoshi",
              "image_url": "<https://cdn-dev.voyager.online/0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492/3/token_image/3_original.png>"
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nft-transfers`
        
        *Get NFT transfer events for a specific contract.*
        
        params:
        
        `contract_address:` Contract address.
        
        `type:` NFT transfer type (erc721 or erc1155).
        
        `cursor:` Pagination cursor.
        
        `limit:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "type": "Sale",
              "timestamp": 1685665993,
              "id": "0x677e52c82793f8dd155b3422afd647521fd8d87c63e024170916af7ceecf997",
              "from_address": "0x0411f475ea06286ce6cb6d11787ccae6d2b0748a18b20b9e15172cbe52aabdef",
              "to_address": "0x036e32229ba08f835345d4f741659bff2b58c27c35ac06ebf0b7d1567bd1bea5",
              "token_id": "59",
              "quantity": "1",
              "transaction_hash": "0x677e52c82793f8dd155b3422afd647521fd8d87c63e024170916af7ceecf997",
              "nft_contract_address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
              "total_price": "4100000000000000"
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nft-stats`
        
        *Get overall NFT statistics.*
        
        params:
        
        `timeframe:` day/week/month/all
        
        `attribute:` sales/owners/supply/sales_volume/traders
        
        `sort:` desc/asc
        
        `p:` Pagination page number.
        
        `ps:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "total_supply": "1000",
              "contract_address": "0x003b524d6ba1b56ff44c8469b9f7e3bf51f23565f8bf50c68a139d7c76777492",
              "transfers": 500,
              "sales": 150,
              "sales_volume": "3000000000000000000",
              "average_price": "20000000000000000",
              "mints": "100",
              "burns": "5",
              "traders": 200,
              "total_owners": 150
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/marketplace-stats`
        
        *Get marketplace statistics.*
        
        params:
        
        `timeframe:` day/week/month/all
        
        `attribute:` sales/sales_volume/traders
        
        `sort:` desc/asc
        
        `p:` Pagination page number.
        
        `ps:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "marketplace_contract_address": "0x079b882cb8200c1c1d20e849a2ef19124b0b8985358c1313ea6af588cfe4fec8",
              "sales": 1000,
              "sales_volume": "5000000000000000000",
              "average_price": "5000000000000000",
              "traders": 300,
              "marketplace_contract_alias": "ExampleMarketplace"
            }
          ],
          "pagination": {
            "prev": null,
            "next": null
          }
        }
        }
        
        ```
        
    - **get** `/nfts`
        
        *Retrieve a list of NFTs (ERC721 and ERC1155 tokens) or the largest NFT marketplaces.*
        
        params:
        
        `period:` day/week/month/all
        
        `filter:` erc721/erc1155/marketplace
        
        `attribute:` sales/sales_volume/traders/mints/transfers/owners
        
        `sort:` desc/asc
        
        `p:` Pagination page number.
        
        `ps:` Items per page.
        
        ```tsx
        // Example Response
        {
          "items": [
            {
              "address": "0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a",
              "logo": "https://nft-api.voyager.online/0x045963ea13d95f22b58a5f0662ed172278e6b420cded736f846ca9bde8ea476a/image_url/contract_small.jpeg",
              "collection_name": "mock_nft_contract",
              "sales": 15,
              "sales_volume": "200000000000000",
              "traders": 6,
              "rank": 1,
              "average_price": "13333333333333",
              "mints": "15",
              "transfers": 19,
              "total_owners": 0
            }
          ],
          "pagination": {
            "prev": "/nfts?filter=erc721&period=month&attribute=sales_volume&sort=asc&p=9&ps=10",
            "next": "/nfts?filter=erc721&period=month&attribute=sales_volume&sort=asc&p=11&ps=10"
          }
        }
        }
        
        ```
        
    
    ## Staking
    
    - **get** `/staking/validators`
        
        *Get list of active staking validators.*
        
        params:
        
        - `ps:` Number of validators per page.
        - `p:` Page number.
        - `sortBy:` Attribute to sort by (`stake`, `delegators`, `commission`).
        - `sortOrder:` Order (`asc` or `desc`).
        - `search:` Search term for validators.
        
        response:
        
        ```tsx
        // Example Response
        {
          "items": [
            {
        			"stakerState": "active",
        			"address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        			"isVerified": true,
        			"totalStakeStrk": "81364707339983107329998193",
        			"totalStakeBtc": "0",
        			"totalStakePercentageStrk": 1491,
        			"totalStakePercentageBtc": 0,
        			"totalSelfStake": "1764537000000000000000000",
        			"totalDelegatedStakeStrk": "79600170339983107329998193",
        			"totalDelegatedStakeBtc": "0",
        			"totalDelegators": 34298,
        			"revenueShare": 0,
        			"aprStrk": 684,
        			"aprBtc": 266158217,
        			"rank": "1",
        			"name": "Ready (prev. Argent)",
        			"imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
        			"startTime": 1732533292,
        			"stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        			"liveness": 99.93,
        			"livenessAttestedEpochs": 1454,
        			"livenessTotalEpochs": 1455,
        			"livenessLastEpoch": 3768,
        			"poolInfos": [
        				{
        					"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        					"poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
        					"tokenInfo": {
        							"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        							"price": 0.131896,
        							"decimals": 18,
        							"logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
        							"name": "Starknet",
        							"symbol": "strk"
        						}
        					}
        				],
        				"stakingPowerStrk": 1118.25,
        			"stakingPowerBtc": 0,
        			"stakingPower": 1118.25
        		},
            // More validators...
          ],
          "pagination": {
        		"prev": null,
        		"next": "/staking/validators?p=2&ps=25&sortBy=rank&sortOrder=ASC",
        		"totalPages": 7,
        		"pageSize": 25,
        		"prevPage": null,
        		"nextPage": 2,
        		"currentPage": 1
        	}
        }
        
        ```
        
    - **get** `/staking/validator-details`
        
        *Get details of a specific validator.*
        
        params:
        
        - `validator:` Validator address or ID.
        
        response:
        
        ```tsx
        // Example Response
        {
        "validatorDetails": {
        	"address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        	"isVerified": true,
        	"totalStakeStrk": "81364707339983107329998193",
        	"totalStakeBtc": "0",
        	"totalStakePercentageStrk": 1488,
        	"totalStakePercentageBtc": 0,
        	"totalSelfStake": "1764537000000000000000000",
        	"totalDelegatedStakeStrk": "79600170339983107329998193",
        	"totalDelegatedStakeBtc": "0",
        	"totalDelegators": 34298,
        	"revenueShare": 0,
        	"aprStrk": 684,
        	"aprBtc": 266158217,
        	"rank": "2",
        	"startTime": 1732533292,
        	"startingTime": "2024-11-25T11:14:52.000Z",
        	"poolInfos": [
        		{
        		"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        		"poolContract": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
        		"tokenInfo": {
        			"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        			"price": 0.131896,
        			"decimals": 18,
        			"logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
        			"name": "Starknet",
        			"symbol": "strk"
        		},
        		"rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7"
        		}
        	],
        	"rewardAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        	"operationalAddress": "0x06012516a3ae0e8e8367abdb1db76ba56f7cb221aa3c1e4c02f52ab9d4d1ebc6",
        	"stakerState": "active",
        	"name": "Ready (prev. Argent)",
        	"imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
        	"description": "Official Ready STRK Staker",
        	"website": "https://www.ready.co",
        	"liveness": 99.93,
        	"livenessAttestedEpochs": 1454,
        	"livenessTotalEpochs": 1455,
        	"livenessLastEpoch": 3768,
        	"socials": {
        		"twitter": {
        			"value": "ready_co",
        			"link": "https://x.com/ready_co",
        			"iconName": "TwitterX"
        		}
        	},
        	"stakingPowerStrk": 1116,
        	"stakingPowerBtc": 0,
        	"stakingPower": 1116
        	}
        }
        ```
        
    - **get** `/staking/validator-details/activity`
        
        *Get activity data of a specific validator.*
        
        params:
        
        - `address:` Validator address.
        - `ps:` Number of records per page.
        - `P:` Page number.
        - `start:` Start date/time for filtering.
        - `end:` End date/time for filtering.
        - `sort:` Sorting order (`DESC` or `ASC`).
        
        response:
        
        ```tsx
        // Example Response
        {
          "items": [
            "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        		"timestamp": "2025-09-17T07:29:13.000Z",
        		"name": "delegator_stake",
        		"amount": "10000000000000000000",
        		"delegatorAddress": "0x031d94dee51cb17f1c6153531615592cc8b183b318cc7af3957d225de0409e6e",
        		"stakerAddress": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
        		"destinationName": "Ready (prev. Argent)",
        		"destinationIcon": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
        		"source": "0x031d94dee51cb17f1c6153531615592cc8b183b318cc7af3957d225de0409e6e",
        		"destination": "0x02cb02c72e8a0975e69e88298443e984d965a49eab38f5bdde1f5072daa09cfe",
        		"txnHash": "0x25a15065fa1a3b5fbbad2aa15a613dd7b71f76dc2ec5ae2d3d8d7a5c3ed26cb",
        		"tokenInfo": {
        				"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        				"price": 0.131896,
        				"decimals": 18,
        				"logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
        				"name": "Starknet",
        				"symbol": "strk"
        			}    // More activity items...
          ],
          "pagination": {
            "prev": null,
        		"next": "/staking/validator-details/activity?p=2&ps=25&address=0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7&sort=DESC",
        		"totalPages": 5597,
        		"pageSize": 25,
        		"prevPage": null,
        		"nextPage": 2,
        		"currentPage": 1
          }
        }
        
        ```
        
    - **get** `/staking/delegators`
        
        *Get list of delegators for a specific validator.*
        
        params:
        
        - `validator:` Validator address.
        - `delegator:` delegator address.
        - `asset:` strk | btc (default: strk).
        - `ps:` Items per page.
        - `p:` Page number.
        
        response:
        
        ```tsx
        // Example Response
        {
          "delegators": [
            {
              "address": "0x05634f501aa6a67b86581fd5260783d93834859fda4ab489daca2b61d013b805",
              "delegatedStake": "500000000000000000",
              "share": 0.005,
              "withdrawalTime": 1697882454
            }
            // More delegators...
          ]
        }
        
        ```
        
    - **get** `/staking/wallet-info`
        
        *Get staking info for a specific wallet.*
        
        params:
        
        - `address:` Wallet address.
        
        response:
        
        ```tsx
        // Example Response
        {
          "overview": {
        		"totalStakedStrk": "110000000000000000000000000",
        		"totalStakedBtc": "0",
        		"totalRewardsClaimedStrk": "629125340774570577838431",
        		"totalRewardsClaimedBtc": "0",
        		"totalRewardsUnclaimedStrk": "1650713665979883332610904",
        		"totalRewardsUnclaimedBtc": "0"
          },
          "staked": [
            {
        			"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        			"poolContract": "0x01f170bafce432964d6cbaf2cb75355b2043f5640897e0623b7dbb029bf6b3ef",
        			"amount": "1000000000000000000000000",
        			"rewardAddress": "0x030ee272216112cf8e3ef1baf77c2ac3f340e436a1214b6a04645cd31f6f170b",
        			"rewardsClaimed": "0",
        			"rewardsUnclaimed": "13062064431467393996377",
        			"startTime": 1755174988,
        			"status": "active",
        			"validatorRowInfo": {
        				"address": "0x04b00f97e2d2168b91fe64ceeace4a41fc274a85bbdd0adc402c3d0cf9f91bbb",
        				"name": "Braavos",
        				"imgSrc": "https://assets.braavos.app/images/icons/braavos.svg",
        				"isVerified": true,
        				"stakerAddress": "0x04b00f97e2d2168b91fe64ceeace4a41fc274a85bbdd0adc402c3d0cf9f91bbb",
        				"poolInfos": [
        						{
        							"tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
        							"poolContract": "0x02948b1055db6c104ce426854983543e2116af081a65155551a003b0d969a19d",
        							"tokenInfo": {
        								"tokenAddress": "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
        								"price": 115384,
        								"decimals": 8,
        								"logoUrl": "https://coin-images.coingecko.com/coins/images/32207/small/wrapped_bitcoin_wbtc.png?1696750238",
        								"name": "Bridged Wrapped Bitcoin (StarkGate)",
        								"symbol": "wbtc"
        							}
        						},
        					],
        					"startTime": 1757943012,
        					"totalStakeStrk": "41677423964102554735523240",
        					"totalStakeBtc": "1500",
        					"totalStakePercentageStrk": 762,
        					"totalStakePercentageBtc": 0,
        					"totalSelfStake": "30000000000000000000000",
        					"totalDelegatedStakeStrk": "41647423964102554735523240",
        					"totalDelegatedStakeBtc": "1500",
        					"aprStrk": 616,
        					"aprBtc": 239710192,
        					"totalDelegators": 16290,
        					"revenueShare": 1000,
        					"rank": "3",
        					"liveness": 100
        					}
        			},
        		
        	    // More stakes...
        	  ],
        	}
        	
        ```
        
    - **get** `/staking/wallet-info/activity`
        
        *Get activity for a wallet (staking, delegations, withdrawals, etc.).*
        
        params:
        
        - `address:` Wallet address.
        - `validator:`Validator address for specific activity.
        - `ps:` Items per page.
        - `p:` Page number.
        - `start:` Start date/time.
        - `end:` End date/time.
        - `sort:` Sorting order (`DESC` or `ASC`).
        
        response:
        
        ```tsx
        // Example Response
        {
          "items": [
            {
        			"timestamp": "2025-08-15T13:29:24.000Z",
        			"name": "delegator_stake",
        			"amount": "1000000000000000000000000",
        			"delegatorAddress": "0x05d1aca66f359073f81e4f4c07207a697d523c8dd392ab7f28cc6874bf799c8a",
        			"stakerAddress": "0x04ee3fab423424352d4fc7dd1a3bb6d26a34c26f0793e94f89d02a210d961448",
        			"destinationName": "NodeStake",
        			"destinationIcon": "https://raw.githubusercontent.com/nodestake/brand-kit/refs/heads/main/logo.png",
        			"source": "0x05d1aca66f359073f81e4f4c07207a697d523c8dd392ab7f28cc6874bf799c8a",
        			"destination": "0x0351900dd8ee9ac14e0ec50cc0d6faa456dda7e97c0c2212d5f0661445d947ad",
        			"txnHash": "0x21891bb4c7f3a0279110e1d955ac4353f7261951b7189213606c329c6b4d975",
        			"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        			"tokenInfo": {
        					"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        					"price": 0.131696,
        					"decimals": 18,
        					"logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
        					"name": "Starknet",
        					"symbol": "strk"
        			}
        		},
            // More activity...
          ],
          "pagination": {
        		"prev": null,
        		"next": "/staking/wallet-info/activity?p=2&ps=25&address=0x05d1aca66f359073f81e4f4c07207a697d523c8dd392ab7f28cc6874bf799c8a&sort=DESC",
        		"totalPages": 8,
        		"pageSize": 25,
        		"prevPage": null,
        		"nextPage": 2,
        		"currentPage": 1
          }
        }
        
        ```
        
    - **get** `/staking/delegators-over-time`
        
        *Get historical data of delegator counts over time.*
        
        params:
        
        - `validator:` Validator address.
        - `timerange:` Time range (`1w`, `1m`, `1y`, `max`).
        
        response:
        
        ```tsx
        // Example Response
        [
          {
            "date": "2024-12-02",
            "delegationCount": 32763,
            "delegationChange": 3235
          }
          // More records...
        ]
        
        ```
        
    - **get** `/staking/stake-over-time`
        
        *Get historical data of total validator stake (own + delegated).*
        
        params:
        
        - `validator:` Validator address.
        - `timerange:` Time range (`1w`, `1m`, `1y`, `max`).
        
        response:
        
        ```tsx
        // Example Response
        [
          {
            "date": "2024-12-02",
        		"ownStakeStrk": "35691959857679316201196507",
        		"ownStakeBtc": "0",
        		"delegatedStakeStrk": "425169346790743944643803691",
        		"delegatedStakeBtc": "0",
        		"totalStakeStrk": "460861306648423260845000198",
        		"totalStakeBtc": "0",
        		"ownStakeChangeStrk": "11550000000000000000000",
        		"ownStakeChangeBtc": "0",
        		"delegatedStakeChangeStrk": "-764019386782853312190272",
        		"delegatedStakeChangeBtc": "0",
        		"totalStakeChangeStrk": "-752469386782853312190272",
        		"totalStakeChangeBtc": "0"
          }
          // More records...
        ]
        
        ```
        
    - **get** `/staking/wallet-info/stake-over-time`
        
        *Get historical stake data for a specific wallet.*
        
        params:
        
        - `address:` Wallet address.
        - `timerange:` Time range (`1w`, `1m`, `1y`, `max`).
        
        response:
        
        ```tsx
        // Example Response
        [
          {
            "date": "2024-12-02",
        		"totalStakeStrk": "29879954806078716406890",
        		"totalStakeBtc": "0",
        		"totalStakeChangeStrk": "0",
        		"totalStakeChangeBtc": "0"
          }
          // More records...
        ]
        
        ```
        
    - **get** `/staking/validator-pool-info`
        
        *Get historical data of delegator counts over time.*
        
        params:
        
        - `validator:` Validator address.
        
        response:
        
        ```tsx
        // Example Response
        [
        	{
        		"poolContract": "0x0712174ab962df1803ab93de4efc8a9423e825baf29b7067e5e2d24e9fc4e67e",
        		"tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        		"tokenName": "Starknet Token",
        		"tokenSymbol": "STRK",
        		"tokenDecimals": 18,
        		"iconLogo": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507"
        	}
          // More records...
        ]
        
        ```
        
    - **get** `/staking/attestatons`
        
        *Get historical data of delegator counts over time.*
        
        params:
        
        - `validator:` Validator address.
        - `ps:` Number of records per page.
        - `P:` Page number.
        
        response:
        
        ```tsx
        // Example Response
        [
          items: [
        	  {			  
        			"epochId": 3770,
        			"blockNumber": 2242632,
        			"transactionHash": "0x4ee21f7146c6e928255621403e0ffba278deb64a12f66eba2443db4675693b5"
        	  }
          // More records...
        ]
        
        ```
        
    

# 🚀 Voyager API – Usage Guide

To interact with the API, you need to include your **API key** in every request.

---

## 🔑 Authentication

All requests must include the header:

```
x-api-key: YOUR_API_KEY

```

Replace `YOUR_API_KEY` with the key provided to you.

---

## 🌍 Base URL

```
https://api.voyager.online/beta

```

---

## 📌 Example Endpoints

### 1. Get Block by Number

**Request:**

```
GET /blocks/0x19402ac841080ad4849ac0209265cb6e82856036ffce993e7f583b322c61092
Host: https://api.voyager.online/beta
x-api-key: YOUR_API_KEY

```

**Curl Example:**

```bash
curl -X GET "https://api.voyager.online/beta/blocks/0x19402ac841080ad4849ac0209265cb6e82856036ffce993e7f583b322c61092" \
  -H "x-api-key: YOUR_API_KEY"

```

**Response (sample):**

```json
{
    "blockNumber": 483249,
    "hash": "0x19402ac841080ad4849ac0209265cb6e82856036ffce993e7f583b322c61092",
    "timestamp": 1703664798,
    "stateRoot": "0x17c8b7b9018634b80f1680e2682779256799b0a7dab1b2bf7ec2d637d802ac9",
    "txnCount": 130,
    "eventCount": 738,
    "messageCount": 0,
    "l1VerificationTxHash": "0xca936a77272c3c7eb494654ed8910fcb16bc9edb7f2fa83d98146df396ae74e0",
    "status": "Accepted on L1",
    "confirmations": 1426574,
    "ethGasPrice": "0x043ec6fbec",
    "strkGasPrice": null,
    "l1AcceptTime": 19492,
    "prevBlockHash": "0x51b4e567a96cc66c4be585b2e0a02c38988bbc4fa9cf4c667f58275b1153839",
    "nextBlockHash": "0x4e1b608bc2596010e111363904729f92602e2c69b89abcd7b2b76d74462501f",
    "timeToMine": 41,
    "sequencerAddress": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
    "totalFee": "0x5a166d429e58d4",
    "version": "0.12.3"
}
```