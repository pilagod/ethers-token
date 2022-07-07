import { Provider } from "@ethersproject/abstract-provider"

import { ERC20, ERC20Config } from "./erc20"
import { Native, NativeConfig } from "./native"
import { CallifyCtor, callify } from "./utils"

export type ERC20Ctor<T extends typeof ERC20 = typeof ERC20> = CallifyCtor<
    T,
    ERC20Config
>
export type NativeCtor<T extends typeof Native = typeof Native> = CallifyCtor<
    T,
    NativeConfig
>

export class Factory {
    public static use(provider: Provider) {
        return new Factory(provider)
    }

    public constructor(private provider: Provider) {}

    public createERC20Ctor(
        ERC20Config: Partial<ERC20Config>,
    ): ERC20Ctor<typeof ERC20>
    public createERC20Ctor<T extends typeof ERC20>(
        ERC20Cls: T,
        ERC20Config?: Partial<ERC20Config>,
    ): ERC20Ctor<T>
    public createERC20Ctor<T extends typeof ERC20>(
        ERC20ClsOrConfig: T | Partial<ERC20Config>,
        ERC20Config?: Partial<ERC20Config>,
    ): ERC20Ctor<typeof ERC20> | ERC20Ctor<T> {
        if (typeof ERC20ClsOrConfig === "object") {
            return callify(
                ERC20,
                Object.assign({}, ERC20ClsOrConfig, {
                    provider: this.provider,
                }),
            )
        }
        return callify(
            ERC20ClsOrConfig,
            Object.assign({}, ERC20Config, { provider: this.provider }),
        )
    }

    public createNativeCtor(
        NativeConfig: Partial<NativeConfig>,
    ): NativeCtor<typeof Native>
    public createNativeCtor<T extends typeof Native>(
        NativeCls: T,
        NativeConfig?: Partial<NativeConfig>,
    ): NativeCtor<T>
    public createNativeCtor<T extends typeof Native>(
        NativeClsOrConfig: T | Partial<NativeConfig>,
        NativeConfig?: Partial<NativeConfig>,
    ): NativeCtor<typeof Native> | NativeCtor<T> {
        if (typeof NativeClsOrConfig === "object") {
            return callify(
                Native,
                Object.assign({}, NativeClsOrConfig, {
                    provider: this.provider,
                }),
            )
        }
        return callify(
            NativeClsOrConfig,
            Object.assign({}, NativeConfig, { provider: this.provider }),
        )
    }
}
