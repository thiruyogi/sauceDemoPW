const { test } = require('@playwright/test')
const { POManager } = require('../../pageObjects/POManager')

const dataset = require('../../testData/loginSpecTestData.json')

let loginPage

test.beforeEach(async ({ page }) => {

    const poManager = new POManager(page)

    loginPage = poManager.getLoginPage()

    await loginPage.gotoUrl()
})

test('Valid login with standard user', async () => {

    await loginPage.loginWithAssert(
        dataset.validUsername,
        dataset.password
    )
})

test('Login with locked out user', async () => {

    await loginPage.lockedUserLogin(
        dataset.lockedUsername,
        dataset.password
    )
})

test('Login with invalid password', async () => {
    await loginPage.login(dataset.validUsername, dataset.invalidPassword)
    await loginPage.verifyErrorMessage('Username and password do not match any user in this service')
})

test('Login with blank username', async () => {
    await loginPage.login("", dataset.password)
    await loginPage.verifyErrorMessage('Username is required')
})

test('Login with blank password', async () => {
    await loginPage.login(dataset.validUsername, "")
    await loginPage.verifyErrorMessage('Password is required')
})

test('Login with blank username and password', async () => {
    await loginPage.login("", "")
    await loginPage.verifyErrorMessage('Username is required')
})