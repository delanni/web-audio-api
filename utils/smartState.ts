import { ChangeEvent, useEffect, useState } from 'react';

type SmartStateOptions<T> = {
    inputToValue?: (input: T) => T;
    valueToInput?: (value: T) => T;
    onUpdate?: (value: T) => void;
}

export default function useSmartState<T>(defaultValue: T, options: SmartStateOptions<T> = {}) {
    const [stateValue, setState] = useState<T>(defaultValue);

    const { inputToValue, valueToInput, onUpdate } = options;
    useEffect(() => {
        if (onUpdate) {
            onUpdate(stateValue);
        }
    })

    return {
        value: stateValue,
        get inputValue() {
            if (valueToInput) {
                return valueToInput(stateValue);
            } else {
                return stateValue;
            }
        },
        update: (ev: ChangeEvent) => {
            const input = (ev.target! as HTMLInputElement).value;

            if (typeof defaultValue === "number") {
                // @ts-ignore
                const value = inputToValue ? inputToValue(Number(input)) : Number(input);

                if (onUpdate) {
                    // @ts-ignore
                    onUpdate(value);
                }
                // @ts-ignore
                setState(value);
            } else {
                // @ts-ignore
                const value = inputToValue ? inputToValue(input) : input;

                if (onUpdate) {
                    // @ts-ignore
                    onUpdate(value);
                }
                // @ts-ignore
                setState(() => input);
            }
        }
    }
}