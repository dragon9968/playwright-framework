import { test as setup, expect } from '@playwright/test';

setup('Đăng nhập hệ thống qua API', async ({ request }) => {
  
  // BƯỚC 1: Gọi GET vào trang login để Server phát Cookie mồi và sinh Form Key
  console.log('--- [API Auth] Bước 1: Gọi GET trang Login để nhặt Form Key... ---');
  const loginPageResponse = await request.get('/index.php/customer/account/login/');
  const loginHtml = await loginPageResponse.text();

  // Dùng đoạn RegExp để tự động bới tìm chuỗi 'form_key' nằm trong HTML của trang login
  const formKeyMatch = loginHtml.match(/name="form_key".*?value="([^"]+)"/) || loginHtml.match(/value="([^"]+)"\s+name="form_key"/);
  const formKey = formKeyMatch ? formKeyMatch[1] : '';
  
  console.log(`👉 Đã bóc tách thành công mã Form Key động: ${formKey}`);

  // BƯỚC 2: Gửi request POST đăng nhập chính thức (Có kèm Form Key giống hệt như UI anh vừa check)
  console.log('--- [API Auth] Bước 2: Gửi request POST đăng nhập kèm chìa khóa bảo mật... ---');
  const response = await request.post('/index.php/customer/account/loginPost/', {
    form: {
      'form_key': formKey, // 🔥 CHÍ MẠNG: Đã có chiếc vé thông hành này!
      'login[username]': 'anh_tester_pro@gmail.com',
      'login[password]': '123456', 
    },
  });

  const finalUrl = response.url();
  console.log(`[API Auth] Trang đích cuối cùng đạt được: ${finalUrl}`);

  // KIỂM TRA: Đích đến cuối cùng phải chuẩn khít với link thành công 100% như anh check trên UI
  expect(finalUrl).toBe('http://live.techpanda.org/index.php/customer/account/');

  // BƯỚC 3: Lưu lại trạng thái đăng nhập hợp lệ vào file JSON cho các test case sau dùng chung
  await request.storageState({ path: 'playwright/.auth/user.json' });
  console.log(`✅ [API Auth] ĐĂNG NHẬP THÀNH CÔNG! Đã đồng bộ Session Cookie.`);
});