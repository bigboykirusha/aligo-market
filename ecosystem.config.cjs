module.exports = {
   apps: [
      {
         name: 'nuxt-app',
         script: '.output/server/index.mjs',
         instances: 'max',
         exec_mode: 'cluster',
         env: {
            NODE_ENV: 'production',
            PORT: 4000,
         },
      },
   ],
};