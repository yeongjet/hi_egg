import { Controller } from 'egg';
export default class TestController extends Controller {
  public async index() {
    const { ctx } = this;
    // console.log(ctx.repo.('ge'));
    console.log('ping');
    console.log(ctx['module']['bp']['service']);
    ctx.body = (ctx.module.bp.service as any).sayHi('egg');
  }
}
