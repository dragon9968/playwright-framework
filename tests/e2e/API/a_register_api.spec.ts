import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });
test('Verify chức năng Đăng ký tài khoản mới qua API thành công', async ({ request }) => {
  
  // 🌟 GIẢI PHÁP CHÍ MẠNG: Dùng Đếm thời gian (Date.now()) để tự động sinh Email ngẫu nhiên
  // Mỗi lần anh bấm chạy test, nó sẽ tạo ra 1 email khác nhau, không bao giờ lo bị trùng data
  const uniqueId = Date.now();
  const dynamicEmail = `long_api_${uniqueId}@gmail.com`;
  
  console.log(`\n🚀 --- BẮT ĐẦU TEST REGISTER API ---`);
  console.log(`👉 Email sử dụng cho lượt test này: ${dynamicEmail}`);

  // BƯỚC 1: Gọi GET vào trang tạo tài khoản để rút Form Key động
  console.log('--- [Register API] Bước 1: Gọi GET để nhặt Form Key mồi... ---');
  const registerPageResponse = await request.get('/index.php/customer/account/create/');
  const registerHtml = await registerPageResponse.text();

  const formKeyMatch = registerHtml.match(/name="form_key".*?value="([^"]+)"/) || registerHtml.match(/value="([^"]+)"\s+name="form_key"/);
  const formKey = formKeyMatch ? formKeyMatch[1] : '';
  console.log(`   -> Nhặt được mã Form Key: ${formKey}`);

  // BƯỚC 2: Bắn request POST gửi toàn bộ dữ liệu Form lên Server
  console.log('--- [Register API] Bước 2: Gửi request POST tạo tài khoản... ---');
  const response = await request.post('/index.php/customer/account/createPost/', {
    form: {
      'form_key': formKey,                 // Thẻ thông hành bảo mật
      'firstname': 'Long',
      'lastname': 'QA',
      'email': dynamicEmail,               // Email tự động đổi mới sau mỗi lượt chạy
      'password': '123456',          // Mật khẩu
      'confirmation': '123456',      // Confirm mật khẩu (phải khớp)
    },
  });

  // BƯỚC 3: KIỂM TRA KẾT QUẢ TRẢ VỀ (VERIFY)
  const finalUrl = response.url();
  console.log(`--- [Register API] Bước 3: Tiến hành Verify kết quả... ---`);
  console.log(`   -> Trang đích cuối cùng đạt được: ${finalUrl}`);

  // 1. Kiểm tra xem hệ thống có tự động đăng nhập và đá về đúng trang Dashboard như anh yêu cầu không
  expect(finalUrl).toBe('http://live.techpanda.org/index.php/customer/account/index/');

  // 2. Đọc nội dung HTML trang đích để verify dòng chữ chúc mừng Đăng ký thành công của Magento
  const htmlContent = await response.text();
  expect(htmlContent).toContain('Thank you for registering with Main Website Store.');

  console.log(`✅ KẾT QUẢ: Chức năng Đăng ký qua API hoạt động HOÀN HẢO!`);
});