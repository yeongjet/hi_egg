import { Service } from 'egg';

/**
 * Test Service
 */
export default class TestService extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public sayHi(name: string) {
    return `hi, ${name}`;
  }
}
