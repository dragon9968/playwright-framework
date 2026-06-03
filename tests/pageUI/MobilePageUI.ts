export class MobilePageUI {

  // Toolbar (Lấy cái đầu tiên để tránh lỗi strict mode)
  public static readonly SORT_BY_DROPDOWN = '.toolbar select[title="Sort By"]';
  public static readonly VIEW_AS_GRID = '.toolbar strong[title="Grid"]';
  public static readonly VIEW_AS_LIST = '.toolbar a[title="List"]';

  // Product Data
  public static readonly PRODUCT_NAMES = 'h2.product-name a';
  public static readonly PRODUCT_PRICES = '.price-box .regular-price .price';

  // Element để kiểm tra xem đã chuyển sang list view thành công chưa
  public static readonly LIST_VIEW_PRODUCTS = 'ol.products-list';

  // Phần tử chỉ xuất hiện ở List View
  public static readonly PRODUCT_DESC = '.products-list .desc.std'; 
  // Trạng thái icon List lúc đang được Active (Nó là thẻ strong, không phải thẻ a)
  public static readonly VIEW_AS_LIST_ACTIVE = '.toolbar strong[title="List"]';

// Menu
    public static readonly MENU_MOBILE = "a:has-text('Mobile')";
    public static readonly MENU_TV = "a:has-text('TV')";
    // Trang danh sách (List Page)
    public static readonly LIST_PAGE_SONY_NAME_LINK = ".product-name a[title='Sony Xperia']";
    public static readonly LIST_PAGE_SONY_PRICE = ".item:has(a[title='Sony Xperia']) .price";

    // Trang chi tiết (Detail Page)
    public static readonly DETAIL_PAGE_SONY_PRICE = "span.price";



}
 
