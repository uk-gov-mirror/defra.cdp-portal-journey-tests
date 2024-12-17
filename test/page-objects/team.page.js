import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class TeamPage extends Page {
  navIsActive() {
    return super.navIsActive('teams')
  }

  teamMembers() {
    return $('[data-testid="team-members"]')
  }

  removeButton(name) {
    const listItem = $$('[data-testid="team-members"] li').find(async (li) => {
      const textContent = await li.getText()

      return textContent.includes(name)
    })

    return listItem.$('a[data-testid="app-link"]*=Remove')
  }

  open(value) {
    return super.open('/teams/' + value)
  }
}

export default new TeamPage()
