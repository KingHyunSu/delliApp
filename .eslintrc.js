module.exports = {
  root: true,
  extends: ['@react-native', 'prettier', 'plugin:react-perf/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 0
  }
}
