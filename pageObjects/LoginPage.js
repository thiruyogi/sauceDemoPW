const { expect } = require('@playwright/test')
const { createLogger } = require('../utils/logger')

class LoginPage {

    constructor(page) {
        this.page = page
        this.log = createLogger('LoginPage')
        this.usernameTxtbox = page.locator('#user-name')
        this.passwordTxtbox = page.locator('#password')
        this.signInButton = page.getByRole('button', { name: 'Login' })
        this.errorContainer = page.locator('[data-test="error"]')
        this.menuButton = page.getByRole('button', { name: 'Open Menu' })
        this.logoutButton = page.locator('#logout_sidebar_link')

    }

    async gotoUrl() {
        this.log.info('Navigating to login page')
        await this.page.goto('/')
    }

    async verifyErrorMessage(errorMessage) {
        this.log.info('Verifying error message', { expected: errorMessage })
        await expect(this.errorContainer).toContainText(errorMessage)
    }

    async login(username, password) {
        this.log.info('Submitting login', { username: username || '(empty)' })
        await this.usernameTxtbox.fill(username)
        await this.passwordTxtbox.fill(password)
        await this.signInButton.click()
    }

    async loginWithAssert(username, password) {
        await this.login(username, password)
        this.log.info('Asserting redirect to inventory page')
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html')
    }

    async lockedUserLogin(username, password) {
        await this.login(username, password)
        await this.verifyErrorMessage('Sorry, this user has been locked out.')
    }

    async logout() {
        await this.menuButton.click()
        await this.logoutButton.click()
    }

    async verifyLogout() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/')
    }


}

module.exports = { LoginPage }