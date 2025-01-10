import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class TeamPage extends Page {
  navIsActive() {
    return super.navIsActive('teams')
  }

  teamDetails() {
    return $('[data-testid="team-details"]')
  }

  removeButton(name) {
    const rowItem = $$(
      '[data-testid="team-details"] .govuk-summary-list__row'
    ).find(async (row) => {
      const textContent = await row.getText()

      return textContent.includes(name)
    })

    return rowItem.$('a[data-testid="remove-link"]')
  }

  open(value) {
    return super.open('/teams/' + value)
  }
}

export default new TeamPage()
