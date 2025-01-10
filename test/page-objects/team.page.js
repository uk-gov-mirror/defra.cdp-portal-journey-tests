import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class TeamPage extends Page {
  navIsActive() {
    return super.navIsActive('teams')
  }

  teamMembers() {
    return $('[data-testid="team-details"]')
  }

  removeButton(name) {
    const listItem = $$(
      '[data-testid="team-details"] .govuk-summary-list__row'
    ).find(async (row) => {
      const textContent = await row.getText()

      return textContent.includes(name)
    })

    return listItem.$('a[data-testid="app-link"]*=Remove')
  }

  open(value) {
    return super.open('/teams/' + value)
  }
}

export default new TeamPage()
