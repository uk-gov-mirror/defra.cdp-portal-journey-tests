import { browser, expect } from '@wdio/globals'
import TestRunPage from 'page-objects/test-run.page'
import LoginStubPage from 'page-objects/login-stub.page'
import BannerComponent from 'components/banner.component.js'

describe('Run Test Suite', () => {
  const testSuiteName = 'cdp-env-test-suite'

  const waitForTestStatus = (regex, timeout = 20000) =>
    browser.waitUntil(
      async () => {
        const statusText =
          (await TestRunPage.latestTestRun().getText()) ?? 'no match'
        return statusText.match(regex)
      },
      {
        timeout,
        timeoutMsg: `Did not get status ${regex} after ${timeout}ms`
      }
    )

  describe('When logged out', () => {
    before(async () => {
      await TestRunPage.open(testSuiteName)
    })

    it('Should show the test run page without the run button', async () => {
      await expect(browser).toHaveTitle(
        `Test Suite - ${testSuiteName} | Core Delivery Platform - Portal`
      )
      await expect(TestRunPage.selectEnvironment()).not.toBeDisplayed()
      await expect(TestRunPage.startButton()).not.toBeDisplayed()
    })
  })

  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await TestRunPage.open(testSuiteName)
    })

    it('Should be on the test run page', async () => {
      await expect(browser).toHaveTitle(
        `Test Suite - ${testSuiteName} | Core Delivery Platform - Portal`
      )
      await expect(TestRunPage.selectEnvironment()).toBeDisplayed()
      await expect(TestRunPage.startButton()).toBeDisplayed()
    })

    it('should allow the test suite to be run in infra-dev', async () => {
      await expect(TestRunPage.selectEnvironment()).toBeDisplayed()
      await TestRunPage.selectEnvironment().selectByVisibleText('infra-dev')
      await TestRunPage.startButton().click()
      await BannerComponent.content(
        'Test run requested successfully'
      ).isDisplayed()
      // Depending on polling intervals the in-progress set can be missed
      await waitForTestStatus('In-progress|Finished')
      await waitForTestStatus('Finished')
    })
  })
})
