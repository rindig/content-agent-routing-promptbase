import path from 'path';
import {Config} from '@remotion/cli/config';

// ── Max Quality Render Defaults ──────────────────────────────
Config.setCrf(1);
Config.setVideoImageFormat('png');
Config.setStillImageFormat('png');
Config.setScale(2);
Config.setX264Preset('veryslow');
Config.setColorSpace('bt709');

// ── Webpack ──────────────────────────────────────────────────
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
