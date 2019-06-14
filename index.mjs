function isBrowser(){
    return typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document
}

const env = import(`./components/${isBrowser() ? 'client' : 'server'}.mjs`).then(({ default: _ }) => _);

export default controller => env.then(f => f(controller))
