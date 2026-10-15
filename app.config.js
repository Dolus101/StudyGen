const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }) => ({
  ...config,
  name: IS_DEV ? 'StudyGen Dev' : config.name,
  scheme: IS_DEV ? 'studygen-dev' : config.scheme,
  android: {
    ...config.android,
    package: IS_DEV ? 'com.gembie.studygen.dev' : config.android.package,
  },
});