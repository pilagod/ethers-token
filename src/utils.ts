interface CallableCtor<T extends new (...args: any[]) => any> {
    (...args: ConstructorParameters<T>): InstanceType<T>
}

export type CallifyCtor<
    T extends new (...args: any[]) => any,
    S = {},
> = CallableCtor<T> & T & S

export function callify<T extends new (...args: any[]) => any, S>(
    cls: T,
    staticProps?: S,
): CallifyCtor<T, S> {
    const __ctor__ = function (...args: any[]) {
        return Reflect.construct(cls, args, __ctor__)
    }
    Reflect.setPrototypeOf(__ctor__.prototype, cls.prototype)
    Reflect.setPrototypeOf(__ctor__, cls)

    Object.assign(__ctor__, staticProps)

    return __ctor__ as CallifyCtor<T, S>
}
