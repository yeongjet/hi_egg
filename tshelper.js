module.exports = {
  watchDirs: {
    // repo: {
    //   directory: 'app/module/bp/repo', // files directory.
    //   // pattern: '**/*.(ts|js)', // glob pattern, default is **/*.(ts|js). it doesn't need to configure normally.
    //   // ignore: '', // ignore glob pattern, default to empty.
    //   generator: 'class', // generator name, eg: class、auto、function、object
    //   interface: 'IBpRepo', // interface name
    //   declareTo: 'Context.module.bp.repo', // declare to this interface
    //   watch: true, // whether need to watch files
    //   // caseStyle: 'upper', // caseStyle for loader
    //   // interfaceHandle: val => `ReturnType<typeof ${val}>`, // interfaceHandle
    //   // trigger: ['add', 'unlink'], // recreate d.ts when receive these events, all events: ['add', 'unlink', 'change']
    // },
    controller: {
      directory: 'app/module/bp/controller', // files directory.
      generator: 'class', // generator name, eg: class、auto、function、object
      interface: 'IBpController', // interface name
      declareTo: 'Application.module.bp.controller', // declare to this interface
      watch: true,
    },
    service: {
      directory: 'app/module/bp/service', // files directory.
      generator: 'class', // generator name, eg: class、auto、function、object
      interface: 'IBpService', // interface name
      declareTo: 'Context.module.bp.service', // declare to this interface
      watch: true,
    },
  },
};
