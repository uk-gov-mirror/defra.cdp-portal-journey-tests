import { browser, expect } from '@wdio/globals'

import PageHeadingComponent from 'components/page-heading.component'
import AdminPage from 'page-objects/admin.page'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import { describeWithAnnotations } from 'helpers/test-filters.js'

describe('Admin', () => {
  describeWithAnnotations('When logged in as a non-admin user', [], () => {
    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await AdminPage.open()
    })

    it('Should show the "403" error page', async () => {
      await expect(browser).toHaveTitle(
        'Forbidden | Core Delivery Platform - Portal'
      )
      await expect(ErrorPage.title('403')).toExist()
      await expect(ErrorPage.message()).toHaveText('Forbidden')
    })

    after(async () => {
      await AdminPage.logOut()
    })
  })

  describeWithAnnotations('When logged in as admin user', [], () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await AdminPage.open()
    })

    it('Should be on the admin user page', async () => {
      await expect(browser).toHaveTitle(
        'Users | Core Delivery Platform - Portal'
      )
      await expect(await AdminPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title('Users')).toExist()
    })

    after(async () => {
      await AdminPage.logOut()
    })
  })
})
