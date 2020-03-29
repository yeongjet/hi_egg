// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOkTest from '../../../../../app/module/bp/controller/ok/test';

declare module 'egg' {
  interface Application {
    module: {
      bp: {
        controller: IBpController;
      }
    }
  }

  interface IBpController {
    ok: {
      test: ExportOkTest;
    }
  }
}
