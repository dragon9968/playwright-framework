// Hàm tạo độ trễ (chờ) trong quá trình thực thi
export const delay = (ms: number = 3000) =>
  new Promise(resolve => setTimeout(resolve, ms));
