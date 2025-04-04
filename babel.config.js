module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // Reanimated plugin for animations if needed
      'react-native-reanimated/plugin',
    ],
  };
}; 