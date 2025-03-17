import { $ } from '@wdio/globals'
import kebabCase from 'lodash/kebabCase.js'

/** appTabs component */
class TabsComponent {
  activeTab() {
    return $('[data-testid*="app-tabs-list-item--selected"]')
  }

  tab(textContent) {
    return $(
      `[data-testid="app-tabs-list-item-${kebabCase(textContent)}"].*=${textContent}`
    )
  }
}

export default new TabsComponent()
