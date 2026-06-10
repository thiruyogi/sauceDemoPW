const { LoginPage } = require('../pageObjects/LoginPage')
const { InventoryPage } = require('../pageObjects/InventoryPage')

class POManager {

    constructor(page) {
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.inventoryPage = new InventoryPage(this.page)
    }

    getLoginPage() {
        return this.loginPage
    }

    getInventoryPage() {
        return this.inventoryPage
    }
}

module.exports = { POManager }