import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { MobilePageUI } from '../pageUI/MobilePageUI';
import { PageUrl } from '../constants/PageUrl'; 

export class MobilePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async goToMobilePage() {
       await this.navigateTo(PageUrl.MOBILE);
    }

    async selectSortBy(option: 'Name' | 'Price') {
        // Dùng .first() để chỉ chọn cái dropdown ở trên cùng
        await this.page.locator(MobilePageUI.SORT_BY_DROPDOWN).first().selectOption({ label: option });
        // Chờ web load lại sau khi sort
        await this.page.waitForLoadState('networkidle'); 
    }

   /* async getProductNames(): Promise<string[]> {
        // Lấy tất cả tên sản phẩm trên màn hình gom thành 1 mảng
        const names = await this.page.locator(MobilePageUI.PRODUCT_NAMES).allInnerTexts();
        // Trả về mảng đã được xóa khoảng trắng dư thừa
        return names.map(name => name.trim());
    }*/

    // Nếu gọi hàm allInnerTexts ở BasePage thì sẽ viết như thế này
     async getProductNames(): Promise<string[]> {
         return await this.getAllInnerTexts(MobilePageUI.PRODUCT_NAMES, "Lấy danh sách tên sản phẩm trên màn hình");
     }

    async getProductPrices(): Promise<number[]> {
        const pricesText = await this.page.locator(MobilePageUI.PRODUCT_PRICES).allInnerTexts();
        // Xóa dấu $ và dấu phẩy, ép kiểu về dạng số (ví dụ: "$130.00" -> 130)
        return pricesText.map(price => parseFloat(price.replace('$', '').replace(',', '')));
    }

    async clickListView() {
        await this.page.locator(MobilePageUI.VIEW_AS_LIST).first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async isListViewDisplayed(): Promise<boolean> {
        return await this.page.locator(MobilePageUI.LIST_VIEW_PRODUCTS).isVisible();
    }

    async isProductDescriptionVisible(): Promise<boolean> {
        // Lấy đoạn mô tả của sản phẩm đầu tiên xem có hiển thị không
        return await this.page.locator(MobilePageUI.PRODUCT_DESC).first().isVisible();
    }

    async isListViewIconActive(): Promise<boolean> {
        // Kiểm tra xem icon List có đang ở trạng thái Active (in đậm) không
        return await this.page.locator(MobilePageUI.VIEW_AS_LIST_ACTIVE).first().isVisible();
    }



    // Click menu Mobile
    async clickMobileMenu() {
        await this.clickElement(MobilePageUI.MENU_MOBILE);
        //hoặc dùng getByRole thì sẽ viết như sau
        //await this.getByRole('link', 'Mobile').click();
    }

    // Click menu TV
    async clickTVMenu() {
        await this.clickElement(MobilePageUI.MENU_TV);
    }

    // Lấy giá trị của Sony Xperia ở trang List
    async getSonyXperiaPriceInList(): Promise<string> {
        return await this.getElementText(MobilePageUI.LIST_PAGE_SONY_PRICE);
    }

    // Click vào tên sản phẩm để vào trang Detail
    async clickSonyXperiaDetail() {
        await this.clickElement(MobilePageUI.LIST_PAGE_SONY_NAME_LINK);
    }

    // Lấy giá trị của Sony Xperia ở trang Detail
    async getSonyXperiaPriceInDetail(): Promise<string> {
        return await this.getElementText(MobilePageUI.DETAIL_PAGE_SONY_PRICE);
    }

    async clickAddToCartSonyXperia() {
        await this.page.locator(MobilePageUI.ADD_TO_CART_SONY_XPERIA_BUTTON).click();
}
}