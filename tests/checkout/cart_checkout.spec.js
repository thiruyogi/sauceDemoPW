const { test } = require('@playwright/test')
const { POManager } = require('../../pageObjects/POManager')
const dataset = require('../../testData/cartCheckoutSpecTestData.json')
const { createLogger } = require('../../utils/logger')

const log = createLogger('cart_checkout.spec')


test.beforeEach(async ({ page }, testInfo) => {
    log.info('Test started', { title: testInfo.title })

    const poManager = new POManager(page)

    page.inventoryPage = poManager.getInventoryPage()
    page.cartPage = poManager.getCartPage()
    page.checkoutPage = poManager.getCheckoutPage()

    await page.goto('/inventory.html')
    log.info('Navigated to inventory page')
})

test('Verify item can be removed from cart page @regression', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for remove-from-cart validation', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    for (const item of items_to_add) {
        log.info('Validating product in cart', { productName: item })
        await page.cartPage.verifyItemPresentInCart(item)
        log.info('Removing product from cart page', { productName: item })
        await page.cartPage.removeItemfromCart(item)
        log.info('Validating product removal from cart', { productName: item })
        await page.cartPage.verifyItemNotPresentInCart(item)
    }
    log.info('Completed remove-from-cart validation')
})

test('Verify user can move to checkout @regression', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for checkout navigation validation', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    for (const item of items_to_add) {
        log.info('Verifying product is displayed in cart', { productName: item })
        await page.cartPage.verifyItemPresentInCart(item)
    }
    log.info('Proceeding to checkout from cart page')
    await page.cartPage.proceedToCheckout()
    log.info('Verifying checkout page title is visible')
    await page.checkoutPage.verifyCheckoutPageTitle()
    log.info('Completed checkout navigation validation')
})

test('Checkout with valid information @regression', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for valid checkout flow', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    log.info('Proceeding to checkout page')
    await page.cartPage.proceedToCheckout()
    log.info('Entering valid checkout user details')
    await page.checkoutPage.enterUserDetails(dataset.firstName, dataset.lastName, dataset.zipCode)
    for (const item of items_to_add) {
        log.info('Verifying product in checkout overview', { productName: item })
        await page.checkoutPage.verifyItemPresentInList(item)
    }
    log.info('Completed valid checkout information validation')
})

test('Checkout with missing first name @regression', async ({ page }) => {

    let item_to_add = dataset.products[0]
    log.info('Preparing product for missing first name validation', { productName: item_to_add })
    if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item_to_add)) {
        log.info('Product is already added to cart', { productName: item_to_add })
        log.info('Removing product from cart', { productName: item_to_add })
        await page.inventoryPage.removeFromCart(item_to_add)
    }
    log.info('Adding product to cart', { productName: item_to_add })
    await page.inventoryPage.addToCart(item_to_add)
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    log.info('Proceeding to checkout page')
    await page.cartPage.proceedToCheckout()
    log.info('Submitting checkout details with missing first name')
    await page.checkoutPage.enterUserDetails("", dataset.lastName, dataset.zipCode)
    log.info('Verifying first name required error message')
    await page.checkoutPage.verifyErrorMessage('Error: First Name is required')
    log.info('Completed missing first name validation')
})

test('Checkout with missing all fields @regression', async ({ page }) => {
    let item_to_add = dataset.products[0]
    log.info('Preparing product for required field validations', { productName: item_to_add })
    if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item_to_add)) {
        log.info('Product is already added to cart', { productName: item_to_add })
        log.info('Removing product from cart', { productName: item_to_add })
        await page.inventoryPage.removeFromCart(item_to_add)
    }
    log.info('Adding product to cart', { productName: item_to_add })
    await page.inventoryPage.addToCart(item_to_add)
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    log.info('Proceeding to checkout page')
    await page.cartPage.proceedToCheckout()
    log.info('Submitting checkout details with missing last name and zip code')
    await page.checkoutPage.enterUserDetails(dataset.firstName, "", "")
    log.info('Verifying last name required error message')
    await page.checkoutPage.verifyErrorMessage('Error: Last Name is required')
    log.info('Submitting checkout details with missing zip code')
    await page.checkoutPage.enterUserDetails(dataset.firstName, dataset.lastName, "")
    log.info('Verifying postal code required error message')
    await page.checkoutPage.verifyErrorMessage('Error: Postal Code is required')
    log.info('Completed required field validation for checkout')
})

test ('Complete order successfully @regression', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for complete order validation', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    log.info('Proceeding to checkout page')
    await page.cartPage.proceedToCheckout()
    log.info('Entering valid checkout user details')
    await page.checkoutPage.enterUserDetails(dataset.firstName, dataset.lastName, dataset.zipCode)
    log.info('Verifying checkout page title is visible')
    for (const item of items_to_add) {
        log.info('Verifying product in checkout overview', { productName: item })
        await page.checkoutPage.verifyItemPresentInList(item)
    }
    log.info('Finishing order')
    await page.checkoutPage.finishOrder()
    log.info('Verifying checkout complete page title is visible')
    await page.checkoutPage.verifyCheckoutCompleteMessage()
    log.info('Completed complete order validation')
})

test('Cancel checkout from information page', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for checkout navigation validation', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Navigating to cart page')
    await page.cartPage.goToCartPage()
    for (const item of items_to_add) {
        log.info('Verifying product is displayed in cart', { productName: item })
        await page.cartPage.verifyItemPresentInCart(item)
    }
    log.info('Proceeding to checkout from cart page')
    await page.cartPage.proceedToCheckout()
    log.info('Verifying checkout page title is visible')
    await page.checkoutPage.verifyCheckoutPageTitle()
    log.info('Cancelling checkout from information page')
    await page.checkoutPage.cancelCheckout()
    log.info('Verifying user is redirected to cart page')
    for (const item of items_to_add) {
        log.info('Verifying product is displayed in cart', { productName: item })
        await page.cartPage.verifyItemPresentInCart(item)
    }
})

test('Cart badge update on add/remove sequence', async ({ page }) => {
    let items_to_add = dataset.products
    log.info('Preparing products for cart badge update validation', { products: items_to_add })
    for (const item of items_to_add) {
        if (await page.inventoryPage.verifyItemAlreadyAddedToCart(item)) {
            log.info('Product is already added to cart', { productName: item })
            log.info('Removing product from cart', { productName: item })
            await page.inventoryPage.removeFromCart(item)
        }
        log.info('Adding product to cart', { productName: item })
        await page.inventoryPage.addToCart(item)
    }
    log.info('Verifying cart badge count is 3')
    await page.inventoryPage.verifyCartCount('3')
    log.info('Removing product from cart')
    await page.inventoryPage.removeFromCart(items_to_add[0])
    log.info('Verifying cart badge count is 2')
    await page.inventoryPage.verifyCartCount('2')
    log.info('Adding product to cart')
    await page.inventoryPage.addToCart(items_to_add[0])
    log.info('Verifying cart badge count is 3')
    await page.inventoryPage.verifyCartCount('3')
})