// tests/helpers/DataGenerator.ts
export class DataGenerator {
  /**
   * Sinh email ngẫu nhiên không trùng lặp (kể cả khi chạy parallel nhiều browser)
   * Ví dụ output: long_m8x9k2a1b@qa.team
   */
  static generateRandomEmail(prefix = 'long', domain = 'qa.team'): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `${prefix}_${timestamp}${randomStr}@${domain}`;
  }

  /**
   * Sinh chuỗi ký tự ngẫu nhiên (dùng cho Firstname, Lastname, Coupon...)
   */
  static generateRandomString(length = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }
}