const { expect } = require('@playwright/test')
const { createLogger } = require('../utils/logger')

class CheckoutPage {

    constructor(page) {
        this.page = page
        this.checkoutPageTitle = this.page.getByText('Checkout: Your Information', { exact: true })
        this.firstName = this.page.locator('#first-name')
        this.lastName = this.page.locator('#last-name')
        this.zipCode = this.page.locator('#postal-code')
        this.cancelButton = this.page.locator('#cancel')
        this.continueButton = this.page.locator('#continue')
        this.errorContainer = page.locator('[data-test="error"]')
        this.finishButton = this.page.locator('#finish')
        this.completeHeader = this.page.locator('.complete-header')
    }

    async verifyCheckoutPageTitle() {
        expect(await this.checkoutPageTitle).toBeVisible()
    }

    async enterUserDetails(firstName, lastName, zipCode) {
        await this.firstName.fill(firstName)
        await this.lastName.fill(lastName)
        await this.zipCode.fill(zipCode)
        await this.continueButton.click()
    }

    async verifyErrorMessage(errorMessage) {
        expect(await this.errorContainer.textContent()).toContain(errorMessage)
    }

    async verifyItemPresentInList(itemName) {
        expect(await this.page.locator('.cart_item_label').filter({ hasText: itemName })).toBeVisible()
    }

    async finishOrder() {
        await this.finishButton.click()
    }

    async verifyCheckoutCompleteMessage() {
        expect(await this.completeHeader.textContent()).toContain('Thank you for your order!')
    }

    async cancelCheckout() {
        await this.cancelButton.click()
    }
}

module.exports = { CheckoutPage }