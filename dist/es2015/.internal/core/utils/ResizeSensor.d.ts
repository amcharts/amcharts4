export declare class ResizeSensor {
    private _sensor;
    private _element;
    private _disposed;
    constructor(element: Element, callback: () => void);
    isDisposed(): boolean;
    dispose(): void;
    /**
     * Deprecated: do not use.
     *
     * @ignore Exclude from docs
     */
    reset(): void;
}
