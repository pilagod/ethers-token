import { Provider } from "@ethersproject/abstract-provider"

import { Addressable, getAddress } from "./address"
import { Fungible } from "./fungible"

export type NativeConfig = {
    address: string
    decimals: number
    symbol: string
    provider: Provider
}

export class Native extends Fungible {
    public static address = "0x"
    public static provider: Provider

    public static async balanceOf<T extends typeof Native>(
        this: T,
        target: Addressable,
    ): Promise<InstanceType<T>> {
        const balance = await this.provider.getBalance(await getAddress(target))
        return this.raw(balance) as InstanceType<T>
    }

    public async transfer(recipient: Addressable) {
        const owner = this.mustGetOwner()
        return owner.sendTransaction({
            to: await getAddress(recipient),
            value: this,
        })
    }
}
