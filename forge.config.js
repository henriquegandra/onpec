require('dotenv').config();

module.exports = {
  packagerConfig: {
    icon: './src/img/logo',
    ignore: [
      ".gitignore",
      "test/",
    ]
  },
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'henriquegandra@live.com',
          name: 'https://github.com/henriquegandra/onpec.git',
        },
        /* authToken: process.env.GITHUB_TOKEN, */
        prerelease: false,
        draft: false,
      },
    },
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      description: "Versão Offline para onPEC",
      authors: "Henrique Gandra",
      /* config: {
        certificateFile: './RONCADOR.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD,
      }, */
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
