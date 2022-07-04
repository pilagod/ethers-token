import { Contract, ContractTransaction, ethers } from "ethers"
import { Provider } from "@ethersproject/abstract-provider"

import abi from "./abi"
import { Addressable, getAddress } from "./address"
import { Fungible } from "./fungible"
import { Owner } from "./types"

export type ERC20Config = {
    abi: object[]
    address: string
    decimals: number
    symbol: string
}

export class ERC20 extends Fungible {
    public static abi = abi.ERC20
    public static address = "0x"
    public static provider: Provider

    public static get contract(): Contract {
        return new Contract(this.address, this.abi, this.provider)
    }

    public static async allowanceOf<T extends typeof ERC20>(
        this: T,
        owner: Addressable,
        spender: Addressable,
    ): Promise<InstanceType<T>> {
        const allowance = await this.contract.allowance(
            await getAddress(owner),
            await getAddress(spender),
        )
        return this.raw(allowance) as InstanceType<T>
    }

    public static async approveMax<T extends typeof ERC20>(
        this: T,
        owner: Owner,
        spender: Addressable,
    ) {
        return this.contract
            .connect(owner)
            .approve(await getAddress(spender), ethers.constants.MaxUint256)
    }

    public static async balanceOf<T extends typeof ERC20>(
        this: T,
        target: Addressable,
    ): Promise<InstanceType<T>> {
        const balance = await this.contract.balanceOf(await getAddress(target))
        return this.raw(balance) as InstanceType<T>
    }

    public async approve(spender: Addressable): Promise<ContractTransaction> {
        const { contract } = this.ctor<typeof ERC20>()
        return contract
            .connect(this.mustGetOwner())
            .approve(await getAddress(spender), this)
    }

    public async transfer(
        recipient: Addressable,
    ): Promise<ContractTransaction> {
        const { contract } = this.ctor<typeof ERC20>()
        return contract
            .connect(this.mustGetOwner())
            .transfer(await getAddress(recipient), this)
    }

    public async transferFrom(
        owner: Addressable,
        recipient: Addressable,
    ): Promise<ContractTransaction> {
        const { contract } = this.ctor<typeof ERC20>()
        return contract
            .connect(this.mustGetOwner())
            .transferFrom(
                await getAddress(owner),
                await getAddress(recipient),
                this,
            )
    }
}
