const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'png'], // Include 'png' for missing asset resolution
  },
};

// Merge the default config with your custom config
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Wrap with Reanimated config
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);