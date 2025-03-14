import { $ } from '@wdio/globals'

/** appTabs component */
class TabsComponent {
  activeTab() {
    return $('[data-testid*="app-tabs-list-item--selected"]')
  }

  tab(value) {
    return $(
      `[data-testid="app-tabs-list-item-${value.toLowerCase()}"].*=${value}`
    )
  }
}

export default new TabsComponent()
