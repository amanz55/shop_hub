/**
 * Creates a simple reactive signal that holds a value and notifies subscribers on change.
 * This is our custom, store-like primitive, built from scratch.
 * @param initialValue The starting value of the signal.
 */
export function createSignal<T>(initialValue: T) {
	let value = initialValue;
	const subscribers = new Set<(value: T) => void>();

	/**
	 * Sets a new value for the signal and notifies all subscribers.
	 */
	const set = (newValue: T) => {
		if (value !== newValue) {
			value = newValue;
			subscribers.forEach((callback) => callback(value));
		}
	};

	/**
	 * Updates the value based on the current value.
	 */
	const update = (updater: (currentValue: T) => T) => {
		set(updater(value));
	};

	/**
	 * The core of the store contract. Allows Svelte components to subscribe.
	 */
	const subscribe = (callback: (value: T) => void) => {
		subscribers.add(callback);
		callback(value); // Immediately send the current value

		// Return the unsubscribe function
		return () => {
			subscribers.delete(callback);
		};
	};

	return {
		set,
		update,
		subscribe
	};
}

/**
 * A custom derived signal. It subscribes to a source signal
 * and creates a new signal whose value is derived from the source.
 * @param source The source signal to derive from.
 * @param derivedFn The function to calculate the new value.
 */
export function createDerived<T, R>(
	source: { subscribe: (cb: (value: T) => void) => () => void },
	derivedFn: (value: T) => R
) {
	// Helper to get the initial value without a long-running subscription
	const getInitialValue = (): T => {
		let initialValue: T;
		const unsub = source.subscribe((value) => {
			initialValue = value;
		});
		unsub(); // Immediately unsubscribe
		return initialValue!;
	};

	const derivedSignal = createSignal(derivedFn(getInitialValue()));

	source.subscribe((value) => {
		derivedSignal.set(derivedFn(value));
	});

	return {
		subscribe: derivedSignal.subscribe
	};
}