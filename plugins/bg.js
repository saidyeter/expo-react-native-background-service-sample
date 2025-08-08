const { withAndroidManifest, withInfoPlist, AndroidConfig } = require("expo/config-plugins");

module.exports = function withBackgroundActions(config) {
  const iosConfig = withInfoPlist(config, (config) => {
    const info = config.modResults;
    info.UIBackgroundModes = ["processing"];
    return config;
  });

  const { getMainApplicationOrThrow } = AndroidConfig.Manifest;
  const androidConfig = withAndroidManifest(iosConfig, async config => {
    const application = getMainApplicationOrThrow(config.modResults);
    const service = !!application.service ? application.service : [];

    config.modResults = {
      "manifest": {
        ...config.modResults.manifest,
        "application": [{
          ...application,
          "service": [
            ...service,
            {
              $: {
                "android:name": "com.asterinet.react.bgactions.RNBackgroundActionsTask",
                "android:foregroundServiceType": "dataSync",
              }
            }
          ]
        }]
      }
    }

    return config;
  })

  return androidConfig;
}