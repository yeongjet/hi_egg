import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    console.log(ctx.service.pt);
    console.log(ctx.repo.pt.g('ge'));
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
