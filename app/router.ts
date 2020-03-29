import { Application } from 'egg';

export default (app: Application) => {
  const { router, module } = app;
  console.log('controllers:');
  console.log((app as any).module);
  router.get('/ping', module.bp.controller.ok.test.index);
};
