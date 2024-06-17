// priceCalculator.js

/**
 * 計算折扣後的價格
 * @param {number} price - 原價
 * @param {object} discount - 折扣資訊
 * @param {number} discount.discountPrice - 折扣金額
 * @param {number} discount.discountRate - 折扣百分比
 * @returns {number} - 折扣後的價格
 */
export function calculatePrice(price, discount, day) {
    if (discount) {
        if (discount.discountPrice !== null && !isNaN(discount.discountPrice)) {
            price -= Number(discount.discountPrice);
        }
        if (discount.discountRate !== null && !isNaN(discount.discountRate)) {
            price *= (Number(discount.discountRate) / 100);
        }
    }
    return price * day;
}

/**
 * 計算訂金
 * @param {number} price - 總價
 * @param {number} rate - 訂金比例
 * @returns {number} - 訂金金額
 */
export function calculateDeposit(price) {
    let rate = 0.4;
    return price * rate;
}


/**
 * 計算折扣後的價格
 * @param {number} price - 原價
 * @param {object} discount - 折扣資訊
 * @param {number} discount.discountPrice - 折扣金額
 * @param {number} discount.discountRate - 折扣百分比
 * @returns {number} - 折扣後的價格
 */
export function calculatePriceBooking(price, discount, day) {
    if (discount) {
        if (discount.discountPrice !== null && !isNaN(discount.discountPrice)) {
            price -= (Number(discount.discountPrice) * day);
        }
        if (discount.discountRate !== null && !isNaN(discount.discountRate)) {
            price *= (Number(discount.discountRate) / 100);
        }
    }
    return price;
}

