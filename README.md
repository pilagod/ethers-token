# ethers-token ![Build Status](https://github.com/pilagod/ethers-token/actions/workflows/ci.yaml/badge.svg?branch=main) [![Coverage Status](https://coveralls.io/repos/github/pilagod/ethers-token/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/pilagod/ethers-token?branch=main)

A token util based on [ethers.js](https://github.com/ethers-io/ethers.js) to help developers code in a semantic manner.

## Installation

```bash
$ npm install ethers-token
```

## Usage

Use `Factory` to create token constructor:

```typescript
import { Factory } from "ethers-token"

// Use provider to create factory instance
const factory = Factory.use(provider)

// Create native token (e.g., ETH) constructor
const ETH = factory.createNativeCtor({
    // Address is served as placeholder for native token
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    symbol: "ETH",
})

// Access metadata on native token constructor
ETH.address // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
ETH.decimals // 18
ETH.symbol // ETH

// Create ERC20 token constructor
const DAI = factory.createERC20Ctor({
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    symbol: "DAI",
})

// Access metadata on ERC20 token constructor
DAI.abi // ERC20 abi (conforming to [ERC20](https://eips.ethereum.org/EIPS/eip-20))
DAI.address // 0x6B175474E89094C44Da98b954EedeAC495271d0F
DAI.decimals // 18
DAI.symbol // DAI
DAI.contract // DAI contract (with abi conforming to [ERC20](https://eips.ethereum.org/EIPS/eip-20))
```

Token constructor is a functional constructor, which means it can be instantiated without `new`. The instance created by token constructor represents specific amount of token, and you can directly treat it as a `BigNumber`. For example:

```typescript
// Auto translate decimals
DAI(100).eq(ethers.utils.parseUnits("100", 18))

// Support arithmetic
DAI(100).add(DAI(50)) // DAI(150)
DAI(100).sub(DAI(50)) // DAI(50)
DAI(100).mul(2) // DAI(200)
DAI(100).div(2) // DAI(50)

// Interact with contract directly
// Quote 100 USDC for DAI on UniswapV2
const USDC = factory.createERC20Ctor({
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    symbol: "USDC",
})
const [, daiAmountOut] = await UniswapV2Router.getAmountsOut(USDC(100), [
    USDC.address,
    DAI.address,
])

// Be careful that amount received from contract will be plain BigNumber
// Use `raw` on token constructor to convert plain BigNumber to token instance
DAI.raw(daiAmountOut)

// `raw` will not translate decimals
DAI.raw(1).eq(BigNumber.from(1))
```

Moreover, there are some helpful utils on token constructor and instance. Amounts returned from these utils are all wrapped as token instances:

> All the arguments related to address are typed as [Addressable](https://github.com/pilagod/ethers-token/blob/main/src/address.ts), which accepts address string, object with address property, or instance implements `getAddress` method.

```typescript
// Utils on native token constructor
await ETH.balanceOf(owner)

// Utils on native token instance
await ETH(100).from(owner).transfer(spender)

// Utils on ERC20 token constructor
await DAI.allowanceOf(owner, spender)
await DAI.approveMax(owner, spender)
await DAI.balanceOf(owner)

// Utils on ERC20 token instance
await DAI(100).from(owner).approve(spender)
await DAI(100).from(owner).transfer(spender)
await DAI(100).from(spender).transferFrom(owner, spender)
```

## Advanced Usage

Some ERC20 tokens implement additional methods to extend the ERC20 specification, `ethers-token` also supports token customization:

```typescript
import { ERC20 } from "ethers-token"

// Define custom ERC20 token class
class DAIMintable extends ERC20 {
    // Extend abi at need
    public static abi = [
        ...ERC20.abi,
        {
            name: "mint",
            type: "function",
            inputs: [
                // usr, wad
            ],
        },
    ]

    // Extend utils on token constructor by static function
    public static async mint(owner: Signer, amount: BigNumberish) {
        return this.contract
            .connect(owner)
            .mint(await owner.getAddress(), amount)
    }

    // Extend utils on token instance by class function
    public async mint() {
        // Access class static props and utils by `this.static<T>(): T`
        const { contract } = this.static<typeof ERC20>()
        const owner = this.mustGetOwner()
        // Token instance itself is a BigNumber
        // We can directly pass `this` as amount argument to contract method
        return contract.connect(owner).mint(owner.address, this)
    }
}

// Specify custom ERC20 token class at the first argument
const DAI = factory.createERC20Ctor(DAIMintable, {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    symbol: "DAI",
})

// Use extended utils on token constructor and instance
await DAI.mint(owner, DAI(100))
await DAI(100).from(owner).mint()
```

## License

© Cyan Ho (pilagod), 2022-NOW

Released under the [MIT License](https://github.com/pilagod/ethers-token/blob/main/LICENSE)
