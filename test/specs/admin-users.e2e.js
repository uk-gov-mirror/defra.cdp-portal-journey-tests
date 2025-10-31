import { browser, expect } from '@wdio/globals'

import BannerComponent from 'components/banner.component'
import PageHeadingComponent from 'components/page-heading.component'
import AdminPage from 'page-objects/admin.page'
import UsersPage from 'page-objects/users.page'
import FormComponent from 'components/form.component'
import LinkComponent from 'components/link.component'
import EntityTableComponent from 'components/entity-table.component'
import GovUkSummaryListComponent from 'components/govuk-summary-list.component'
import LoginStubPage from 'page-objects/login-stub.page'
import AdminTeamPage from 'page-objects/admin-team.page'
import { createPermission, deletePermission } from 'helpers/permissions.js'
import TabsComponent from 'components/tabs.component.js'
import { describeWithAnnotations } from 'helpers/test-filters.js'

const mockUserName = 'A Stub'

async function onTheAdminUsersPage() {
  await expect(browser).toHaveTitle('Users | Core Delivery Platform - Portal')
  await expect(await AdminPage.navIsActive()).toBe(true)
  await expect(await UsersPage.subNavIsActive()).toBe(true)
  await expect(await PageHeadingComponent.title('Users')).toExist()
}

async function onTheAdminPlatformTeamPage() {
  await expect(browser).toHaveTitle(
    'Platform Team | Core Delivery Platform - Portal'
  )
  await expect(await AdminPage.navIsActive()).toBe(true)
  await expect(await AdminTeamPage.subNavIsActive()).toBe(true)
  await expect(await PageHeadingComponent.title('Platform')).toExist()
  await expect(await PageHeadingComponent.caption('Team')).toExist()
}

async function onTheUsersPage(userName = mockUserName) {
  await expect(browser).toHaveTitle(
    `${userName} | Core Delivery Platform - Portal`
  )
  await expect(await AdminPage.navIsActive()).toBe(true)
  await expect(await UsersPage.subNavIsActive()).toBe(true)
  await expect(await PageHeadingComponent.caption('User')).toExist()
  await expect(await PageHeadingComponent.title(userName)).toExist()
}

describe('Admin Users', () => {
  describeWithAnnotations('When logged in as admin', [], () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await AdminPage.open()
    })

    after(async () => {
      await LoginStubPage.logOut()
    })

    describeWithAnnotations('When creating a new user', [], () => {
      it('Should be on the "Admin Users" list page', async () => {
        await onTheAdminUsersPage()
      })

      it('Should be able to go to the Create user flow', async () => {
        await PageHeadingComponent.cta('Create new user').click()

        await expect(browser).toHaveTitle(
          'Find DEFRA user | Core Delivery Platform - Portal'
        )
        await expect(await AdminPage.navIsActive()).toBe(true)
        await expect(await UsersPage.subNavIsActive()).toBe(true)
        await expect(await PageHeadingComponent.title('DEFRA user')).toExist()
        await expect(await PageHeadingComponent.caption('Find')).toExist()
      })

      it('Should be able to find DEFRA AAD user', async () => {
        await FormComponent.inputLabel('AAD users name or email').click()
        await browser.keys('test')

        const aadUserSearchResult = FormComponent.inputLabel(
          'A Stub - a.stub@test.co'
        )
        await expect(aadUserSearchResult).toExist()
        await aadUserSearchResult.click()

        await FormComponent.submitButton('Next').click()
      })

      it('Should be on the Find GitHub user page', async () => {
        await expect(browser).toHaveTitle(
          'Find Defra GitHub User | Core Delivery Platform - Portal'
        )
        await expect(await AdminPage.navIsActive()).toBe(true)
        await expect(await UsersPage.subNavIsActive()).toBe(true)
        await expect(
          await PageHeadingComponent.title('DEFRA GitHub User')
        ).toExist()
        await expect(await PageHeadingComponent.caption('Find')).toExist()
      })

      it('Should be able to find GitHub user', async () => {
        await FormComponent.inputLabel('GitHub username').click()
        await browser.keys('test')

        const githubSearchResult = await FormComponent.inputLabel(
          '@cdp-test-441241 - Test Testing'
        )
        await expect(githubSearchResult).toExist()
        await githubSearchResult.click()
        await FormComponent.submitButton('Next').click()
      })

      it('Should be on the User Summary page', async () => {
        await expect(browser).toHaveTitle(
          'Create User Summary | Core Delivery Platform - Portal'
        )
        await expect(await AdminPage.navIsActive()).toBe(true)
        await expect(await UsersPage.subNavIsActive()).toBe(true)
        await expect(
          PageHeadingComponent.caption('Create User Summary')
        ).toExist()
        await expect(await PageHeadingComponent.title(mockUserName)).toExist()
      })

      it('User Summary page Should contain expected details', async () => {
        await expect(
          await GovUkSummaryListComponent.row('aad-user-email')
        ).toHaveText('a.stub@test.co')
        await expect(
          await GovUkSummaryListComponent.row('aad-user-name')
        ).toHaveText(mockUserName)
        await expect(
          await GovUkSummaryListComponent.row('github-user')
        ).toHaveText('@cdp-test-441241')

        await FormComponent.submitButton('Create').click()
      })

      it('Should be redirected to the "Admin Users" page', async () => {
        await onTheAdminUsersPage()

        await expect(EntityTableComponent.content('A Stub')).toExist()
        await expect(EntityTableComponent.content('a.stub@test.co')).toExist()
        await expect(EntityTableComponent.content('@cdp-test-441241')).toExist()
      })
    })

    describeWithAnnotations(
      'When adding and removing a user from the Platform team',
      [],
      () => {
        it('Should be able to navigate to the "Admin Teams" page', async () => {
          await expect(await AdminPage.navIsActive()).toBe(true)
          await LinkComponent.link('app-subnav-link-teams', 'Teams').click()
        })

        it('Should be on the "Admin Teams" list page', async () => {
          await expect(browser).toHaveTitle(
            'Teams | Core Delivery Platform - Portal'
          )
          await expect(await AdminPage.navIsActive()).toBe(true)
          await expect(await AdminTeamPage.subNavIsActive()).toBe(true)
          await expect(await PageHeadingComponent.title('Teams')).toExist()

          await expect(EntityTableComponent.content('Platform')).toExist()
          await expect(EntityTableComponent.content('@cdp-platform')).toExist()
        })

        it("Should be able to go to the Platform Team's page", async () => {
          await LinkComponent.link('app-entity-link', 'Platform').click()
          await onTheAdminPlatformTeamPage()
        })

        it('Should be able to add a user to the team', async () => {
          await LinkComponent.link(
            'admin-add-team-member',
            'Add member to team'
          ).click()

          await expect(browser).toHaveTitle(
            'Add Team Member | Core Delivery Platform - Portal'
          )
          await expect(await AdminPage.navIsActive()).toBe(true)
          await expect(await AdminTeamPage.subNavIsActive()).toBe(true)
          await expect(await PageHeadingComponent.title('Platform')).toExist()
          await expect(
            PageHeadingComponent.caption('Add Member to Team')
          ).toExist()
        })

        it('Should be able to find CDP user', async () => {
          await FormComponent.inputLabel('CDP users name or email').click()
          await browser.keys('test')

          const aadUserSearchResult = FormComponent.inputLabel(
            'A Stub - a.stub@test.co'
          )
          await expect(aadUserSearchResult).toExist()
          await aadUserSearchResult.click()
          await FormComponent.submitButton('Add').click()
        })

        it('Should be able to see the added user', async () => {
          await onTheAdminPlatformTeamPage()

          await expect(AdminTeamPage.teamMembers()).toHaveText(
            new RegExp(mockUserName, 'g')
          )
        })

        it('Clicking on the added user takes should go to user details page, showing the team', async () => {
          await LinkComponent.link('app-link', mockUserName).click()
          await onTheUsersPage()
          await expect(LinkComponent.link('app-link', 'Platform')).toExist()
        })

        it('Clicking on the team should take you to the Team page', async () => {
          await LinkComponent.link('app-link', 'Platform').click()
          await onTheAdminPlatformTeamPage()
        })

        it('Should be able to remove the user from the team', async () => {
          await expect(AdminTeamPage.teamMembers()).toHaveText(
            new RegExp(mockUserName, 'g')
          )
          await AdminTeamPage.removeButton(mockUserName).click()
        })

        it('Should be on the confirm remove member page', async () => {
          await expect(browser).toHaveTitle(
            'Remove Team Member | Core Delivery Platform - Portal'
          )
          await expect(await AdminPage.navIsActive()).toBe(true)
          await expect(await AdminTeamPage.subNavIsActive()).toBe(true)
          await expect(
            PageHeadingComponent.caption('Remove Member from Team')
          ).toExist()
          await expect(await PageHeadingComponent.title('Platform')).toExist()

          await FormComponent.submitButton('Remove team member').click()
        })

        it('Member should have been removed', async () => {
          await onTheAdminPlatformTeamPage()

          await expect(
            BannerComponent.content('Member removed from team')
          ).toExist()

          await expect(AdminTeamPage.teamMembers()).not.toHaveText(
            new RegExp(mockUserName, 'g')
          )
        })
      }
    )

    describeWithAnnotations('When deleting a user', [], () => {
      it('Should be able to go to the Admin Users page', async () => {
        await LinkComponent.link('app-subnav-link-users', 'Users').click()
        await onTheAdminUsersPage()
      })

      it('Should be able to go to the User page', async () => {
        await LinkComponent.link('app-entity-link', mockUserName).click()
        await onTheUsersPage()
      })

      it('Should be able to go to the Delete user flow', async () => {
        await LinkComponent.link('admin-delete-user', 'Delete user').click()

        await expect(browser).toHaveTitle(
          'Confirm User Deletion | Core Delivery Platform - Portal'
        )
        await expect(await AdminPage.navIsActive()).toBe(true)
        await expect(await UsersPage.subNavIsActive()).toBe(true)
        await expect(
          await PageHeadingComponent.caption('Delete User')
        ).toExist()
        await expect(await PageHeadingComponent.title(mockUserName)).toExist()
      })

      it('Should be able to Delete the user', async () => {
        await FormComponent.submitButton('Delete user').click()
      })

      it('Should be on the "Admin Users" list page', async () => {
        await onTheAdminUsersPage()
      })

      it('Should not have deleted the user', async () => {
        await expect(EntityTableComponent.content('A Stub')).not.toExist()
        await expect(
          EntityTableComponent.content('a.stub@test.co')
        ).not.toExist()
        await expect(
          EntityTableComponent.content('@cdp-test-441241')
        ).not.toExist()
      })
    })

    describeWithAnnotations(
      'When using testAsTenant permission to temporarily drop admin addPermissionToTeam',
      [],
      () => {
        it('Should be able to create the "testAsTenant" permission and assign to admin user', async () => {
          await LoginStubPage.loginAsAdmin()
          await createPermission('testAsTenant', 'User')

          // Add permission to team
          await LinkComponent.link(
            'add-permission',
            'Add permission to a user'
          ).click()

          await FormComponent.inputLabel('Search for a User').click()
          await browser.keys('Admin')
          await FormComponent.inputLabel('Admin User').click()

          await FormComponent.submitButton('Add permission').click()
        })

        it('Should be on the Forbidden 403 page', async () => {
          await expect(PageHeadingComponent.title('403')).toExist()
          await expect(PageHeadingComponent.caption('Error')).toExist()
        })

        it('Should be able to see "Exit Test as Tenant Mode" link in the nav bar and check that admin only tabs dont show on tenant service page', async () => {
          await expect(
            LinkComponent.link('nav-admin', 'Exit Test as Tenant Mode')
          ).toExist()

          await LinkComponent.link('nav-services', 'Services').click()
          await LinkComponent.link('app-link', 'tenant-backend').click()
          await expect(TabsComponent.activeTab()).toHaveText('About')
          await expect(TabsComponent.tab('Automations')).not.toExist()
          await expect(TabsComponent.tab('Proxy')).toExist()
          await expect(TabsComponent.tab('Resources')).toExist()
          await expect(TabsComponent.tab('Secrets')).not.toExist()
          await expect(TabsComponent.tab('Terminal')).not.toExist()
        })

        it('Should be able to see "Exit Test as Tenant Mode" link in the nav bar', async () => {
          await LinkComponent.link(
            'nav-admin',
            'Exit Test as Tenant Mode'
          ).click()

          await expect(LinkComponent.link('nav-admin', 'Admin')).toExist()
        })

        it('Remove permission and see not listed on users page', async () => {
          await LoginStubPage.loginAsAdmin()
          await deletePermission('testAsTenant')
          await LinkComponent.link('app-subnav-link-users', 'Users').click()
          await onTheAdminUsersPage()
          await LinkComponent.link('app-entity-link', 'Admin User').click()
          await onTheUsersPage('Admin User')
          await expect(
            LinkComponent.link('app-link', 'canGrantBreakGlass')
          ).toExist()
          await expect(LinkComponent.link('app-link', 'breakGlass')).toExist()
          await expect(LinkComponent.link('app-link', 'externalTest')).toExist()
          await expect(LinkComponent.link('app-link', 'admin')).toExist()
        })
      }
    )
  })
})
