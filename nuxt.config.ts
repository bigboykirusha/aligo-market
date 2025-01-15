export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'Aligo | Доска объявлений',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap',
        },
        { rel: 'icon', type: 'image/png', href: '/favicons/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'apple-mobile-web-app-title', content: 'Aligo' },
        { name: 'description', content: 'Aligo — удобная доска объявлений для поиска и размещения товаров.' },
        { name: 'keywords', content: 'Aligo, объявления, товары, услуги' },
        { property: 'og:title', content: 'Aligo | Доска объявлений' },
        { property: 'og:description', content: 'Aligo — удобная доска объявлений для поиска и размещения товаров.' },
        { property: 'og:image', content: '/favicons/favicon.png' },
        { property: 'og:url', content: 'https://aligo.ru' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Aligo | Доска объявлений' },
        { name: 'twitter:description', content: 'Aligo — удобная доска объявлений для поиска и размещения товаров.' },
        { name: 'twitter:image', content: '/favicons/favicon.png' },
        { name: 'author', content: 'Aligo Team' },
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
    '@nuxt/image',
    '@nuxtjs/robots',
  ],

  robots: {
    rules: [
      { UserAgent: '*' },
      { Disallow: '/*' },
      { Allow: '/$' },
    ]
  },

  plugins: [
    '~/plugins/vue-the-mask',
    '~/plugins/v-tooltip',
    '~/plugins/user-init',
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
    },
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
  },

  compatibilityDate: '2025-01-15'
})