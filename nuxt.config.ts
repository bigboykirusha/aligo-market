// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiToken: process.env.API_TOKEN,
      yandexApiKey: process.env.YANDEX_API_KEY,
      geonamesApiKey: process.env.GEONAMES_API_KEY,
    },
  },

  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    'nuxt-swiper',
    '@pinia/nuxt',
    'vue3-carousel-nuxt',
    "nuxt-rating",
    '@nuxt/image'
  ],
  plugins: [
    { src: '~/plugins/vue-the-mask', mode: 'client' },
    { src: '~/plugins/v-tooltip', mode: 'client' },
    { src: '~/plugins/user-init', mode: 'client' },
    { src: '~/plugins/fetchFavorites', mode: 'client' },
    { src: '~/plugins/echo.js', mode: 'client' },

  ],
  css: ['~/assets/scss/main.scss', '~/assets/scss/_reset.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_vars.scss" as *;'
        }
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'ru', iso: 'ru-RU', file: 'ru.json' },
      { code: 'ge', iso: 'ge-GE', file: 'ge.json' },
    ],
    defaultLocale: 'ru',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
  },
  devServer: {
    port: 4000
  },
  nitro: {
    routeRules: {
      '/api/**': {
        cache: {
          swr: true,
          maxAge: 60
        }
      }
    }
  }
})
