import { browser, expect } from '@wdio/globals'

import PageHeadingComponent from 'components/page-heading.component'
import ServicesPage from 'page-objects/services.page'
import LoginStubPage from 'page-objects/login-stub.page'

const tenantService = 'cdp-portal-frontend'

describe('Services page', () => {
  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
    })

    it('Should be on the "Services" page', async () => {
      await ServicesPage.open()

      await expect(browser).toHaveTitle(
        'Services | Core Delivery Platform - Portal'
      )

      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title('Services')).toExist()
    })

    it('Should navigate to a "Service" page', async () => {
      await ServicesPage.open(`/${tenantService}`)
      await expect(browser).toHaveTitle(
        `${tenantService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title(tenantService)).toExist()
      await expect(PageHeadingComponent.caption('Service')).toExist()
    })
  })
})
