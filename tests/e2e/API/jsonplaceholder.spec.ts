import { test, expect } from '@playwright/test';

test.describe('Học và Thực hành Test API với JSONPlaceholder', () => {

  // KỊCH BẢN 1: TEST API GET USER
  test('1. Verify API GET - Lấy thông tin User số 1 thành công', async ({ request }) => {
    console.log('\n--- [GET API] Bắt đầu gọi API lấy thông tin User... ---');
    
    // Thực hiện bắn request GET
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

    // 🎯 CÁC BƯỚC VERIFY (ASSERTION):
    
    // Bước 1: Verify Status Code phải trả về là 200 OK
    expect(response.status()).toBe(200);
    console.log(`✅ Điểm kiểm tra 1: Status Code chính xác = ${response.status()}`);

    // Bước 2: Verify Header trả về đúng định dạng JSON
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
    console.log(`✅ Điểm kiểm tra 2: Kiểu dữ liệu trả về chuẩn JSON`);

    // Bước 3: Giải nén JSON và Verify chi tiết dữ liệu bên trong ruột
    const body = await response.json();
    
    expect(body.id).toBe(1); // ID bắt buộc phải là 1
    expect(body.name).toBe('Leanne Graham'); // Tên chuẩn của User 1 trên hệ thống
    expect(body.email).toBe('Sincere@april.biz'); // Email chuẩn
    expect(body.company.name).toBe('Romaguera-Crona'); // Tên công ty nằm trong object lồng nhau
    
    console.log(`✅ Điểm kiểm tra 3: Ruột JSON trả về chính xác tên User là: ${body.name}`);
  });


  // KỊCH BẢN 2: TEST API POST (TAO MỚI)
  test('2. Verify API POST - Tạo mới một bài viết thành công', async ({ request }) => {
    console.log('\n--- [POST API] Bắt đầu gửi dữ liệu tạo mới bài viết... ---');

    // Khai báo cục dữ liệu Payload muốn gửi đi (Y hệt cục JSON trên Postman)
    const payloadData = {
      title: 'Anh Tester Pro',
      body: 'Automation Leader',
      userId: 1
    };

    // Thực hiện bắn request POST kèm dữ liệu ở mục 'data'
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payloadData
    });

    // 🎯 CÁC BƯỚC VERIFY (ASSERTION):

    // Bước 1: Verify Status Code phải trả về là 201 Created
    expect(response.status()).toBe(201);
    console.log(`✅ Điểm kiểm tra 1: Status Code chính xác = ${response.status()}`);

    // Bước 2: Giải nén JSON và Verify xem Server có lưu đúng dữ liệu mình gửi lên không
    const body = await response.json();

    expect(body.title).toBe(payloadData.title); // Kiểm tra tiêu đề
    expect(body.body).toBe(payloadData.body);   // Kiểm tra nội dung
    expect(body.userId).toBe(payloadData.userId); // Kiểm tra mã User ID

    // Bước 3: Verify trường dữ liệu tự sinh từ Server
    // Thằng JSONPlaceholder mặc định cứ tạo mới thành công là nó nhả về id = 101
    expect(body.id).toBe(101); 
    
    console.log(`✅ Điểm kiểm tra 2: Dữ liệu map khớp hoàn toàn. Bài viết mới có ID tự sinh là: ${body.id}`);
  });

});