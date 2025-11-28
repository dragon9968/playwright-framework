// src/helpers/AllureHelper.ts
import { allure } from "allure-playwright";

export class AllureHelper {
  static async step(name: string, action: () => Promise<void>) {
    return await allure.step(name, async () => {
      try {
        await action();
      } catch (e) {
        throw e;
      }
    });
  }
}
