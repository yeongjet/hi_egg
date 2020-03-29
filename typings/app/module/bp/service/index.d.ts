// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../../../app/module/bp/service/test';

declare module 'egg' {
  interface Context {
    module: {
      bp: {
        service: IBpService;
      }
    }
  }

  interface IBpService {
    test: ExportTest;
  }
}
