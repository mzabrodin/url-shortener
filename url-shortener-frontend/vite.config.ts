import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    const gatewayTarget = env.VITE_GATEWAY_URL!

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: Number(env.VITE_PORT!),
            proxy: {
                '^/': {
                    target: gatewayTarget,
                    changeOrigin: true,
                    bypass(req) {
                        const url = req.url ?? '/'

                        if (
                            url.startsWith('/@') ||
                            url.startsWith('/node_modules/') ||
                            /\.\w+(\?|$)/.test(url)
                        ) return url

                        if (req.headers.accept?.includes('text/html')) {
                            if (
                                url === '/' ||
                                /^\/stats(\/|$|\?)/.test(url) ||
                                /^\/not-found(\/|$|\?)/.test(url)
                            ) return url
                        }
                    },
                },
            },
        },
    }
})
