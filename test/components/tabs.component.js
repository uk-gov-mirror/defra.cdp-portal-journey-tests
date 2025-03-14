import { $ } from '@wdio/globals'

/** appTabs component */
class TabsComponent {
  activeTab() {
    return $('[data-testid*="app-tabs-list-item--selected"]')
  }

  tab(index) {
    return $(`[data-testid="app-tabs-list-item-${index}"]`)
  }
}

export default new TabsComponent()
