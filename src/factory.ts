import { Provider } from "@ethersproject/abstract-provider"

import { Native, NativeConfig } from "./native"
import { CallifyCtor, callify } from "./utils"

export type NativeCtor<T extends typeof Native> = CallifyCtor<T, NativeConfig>

export class Factory {
    public static use(provider: Provider) {
        return new Factory(provider)
    }
    public constructor(private provider: Provider) {}

    public createNativeCtor<T extends typeof Native>(
        NativeCls: T,
        NativeConfig?: Partial<NativeConfig>,
    ): NativeCtor<T>
    public createNativeCtor(
        NativeConfig: Partial<NativeConfig>,
    ): NativeCtor<typeof Native>
    public createNativeCtor<T extends typeof Native>(
        NativeClsOrConfig: T | Partial<NativeConfig>,
        NativeConfig?: Partial<NativeConfig>,
    ): NativeCtor<typeof Native> | NativeCtor<T> {
        if (typeof NativeClsOrConfig === "object") {
            return callify(Native, {
                ...NativeClsOrConfig,
                provider: this.provider,
            })
        }
        return callify(NativeClsOrConfig, {
            ...(NativeConfig ?? {}),
            provider: this.provider,
        })
    }
}
