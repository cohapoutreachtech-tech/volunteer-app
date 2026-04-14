module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@': '.',
            '@src': './src',
            '@features': './src/features',
            '@core': './src/core',
            '@shared': './src/shared',
            '@hooks': './src/shared/hooks',
            '@components': './src/shared/components',
            '@constants': './src/shared/constants',
            '@types': './src/shared/types',
          },
        },
      ],
    ],
  };
};

