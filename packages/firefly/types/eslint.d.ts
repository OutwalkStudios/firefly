declare module "@outwalk/firefly/eslint" {
    const firefly: {
        readonly configs: {
            readonly language: Readonly<Record<string, any>>;
            readonly recommended: Readonly<Record<string, any>>;
            readonly plugins: Readonly<Record<string, any>>;
        };
    };

    export default firefly;
}