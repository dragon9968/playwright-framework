import { test } from '../base/BaseTest'; // Đảm bảo đường dẫn chính xác

import { expect } from '@playwright/test';

// Cho các test case chạy độc lập không cần "vé thông hành" user.json
//test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Mobile Product List Feature', () => {

    test.beforeEach(async ({ mobilePage }) => {
        await mobilePage.goToMobilePage();
    });

    test('TC_01 Verify products are sorted by Name (A-Z)', async ({ mobilePage }) => {
        // 1. Thao tác UI: Chọn Sort by Name
        await mobilePage.selectSortBy('Name');

        // 2. Lấy danh sách tên sản phẩm thực tế hiển thị trên UI
        const actualNames = await mobilePage.getProductNames();

        // 3. Tạo một mảng kỳ vọng: Copy mảng thực tế và dùng hàm của JS để tự sắp xếp A-Z
        const expectedNames = [...actualNames].sort();

        // 4. So sánh: Mảng UI có giống y hệt mảng đã được sắp xếp chuẩn không?
        expect(actualNames).toEqual(expectedNames);
    });

    test('TC_02 Verify products are sorted by Price (Low to High)', async ({ mobilePage }) => {
        // 1. Thao tác UI: Chọn Sort by Price
        await mobilePage.selectSortBy('Price');

        // 2. Lấy danh sách giá thực tế trên UI (đã convert ra dạng số)
        const actualPrices = await mobilePage.getProductPrices();

        // 3. Tạo mảng kỳ vọng: Copy mảng thực tế và sắp xếp bé -> lớn
        const expectedPrices = [...actualPrices].sort((a, b) => a - b);

        // 4. So sánh
        expect(actualPrices).toEqual(expectedPrices);
    });

    test('TC_03: Verify View As List layout', async ({ page, mobilePage }) => {
        // 1. Click icon List
        await mobilePage.clickListView();

        // 2. Kiểm tra URL (Chỉ mang tính chất thủ tục)
        expect(page.url()).toContain('mode=list');

        // 3. KIỂM TRA UI SIÊU CHẶT CHẼ (Thực tế đập vào mắt người dùng)
        // a. Cấu trúc list hiển thị
        expect(await mobilePage.isListViewDisplayed()).toBeTruthy(); 
        
        // b. Nút List trên thanh công cụ phải chuyển sang trạng thái Active
        expect(await mobilePage.isListViewIconActive()).toBeTruthy();

        // c. Đoạn chữ mô tả sản phẩm (chỉ có ở List view) BẮT BUỘC phải hiển thị
        expect(await mobilePage.isProductDescriptionVisible()).toBeTruthy();
    });

    test.only('TC_04: Verify that cost of product in list page and details page are equal', async ({ mobilePage }) => {
    
    // Step 1: Click on Mobile menu (để chắc chắn đang ở trang List)
    await test.step('Step 1: Click on Mobile menu', async () => {   
    await mobilePage.clickMobileMenu();
    await mobilePage.clickTVMenu(); // Click sang trang TV rồi click lại để chắc chắn load lại trang List, tránh trường hợp đang ở trang List rồi mà giá vẫn hiển thị (do lỗi cache) nên dù có click hay không thì giá vẫn được lấy về, dẫn đến việc test case bị false positive (vẫn pass dù code bị lỗi)
    await mobilePage.clickMobileMenu();
    });

    // Step 2: In the list of all mobiles, get cost of Sony Xperia mobile
    const priceInList = await mobilePage.getSonyXperiaPriceInList();
    console.log(`Giá ở trang List: ${priceInList}`);
            // Truyền luôn vào step để nó in ra cả Terminal lẫn HTML Report
    await test.step(`Step 2: Lấy được giá của Sony Xperia trên List Page là: ${priceInList}`, async () => {
    });
    
    // Step 3: Click on Sony Xperia detail
    await test.step('Step 3: Click on Sony Xperia detail', async () => {
    await mobilePage.clickSonyXperiaDetail();
    });

    // Step 4: Get cost Sony Xperia mobile from detail page
    const priceInDetail = await mobilePage.getSonyXperiaPriceInDetail();
    await test.step('Step 4: Get cost Sony Xperia mobile from detail page', async () => {
    console.log(`Giá ở trang Detail: ${priceInDetail}`);
    });
    // Step 5: Compare value in Step 2 and 4
    // Playwright sẽ so sánh chuỗi, ví dụ: "$100.00" === "$100.00"
    await test.step(`Step 5: Compare value in Step 2 :${priceInList} and 4 :${priceInDetail}`, async () => {
    expect(priceInList).toEqual(priceInDetail);
    });
});
})