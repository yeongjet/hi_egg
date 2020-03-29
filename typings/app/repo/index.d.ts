// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPt from '../../../app/repo/pt';

declare module 'egg' {
  interface Context {
    repo: IRepo;
  }

  interface IRepo {
    pt: ExportPt;
  }
}
