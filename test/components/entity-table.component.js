import { $ } from '@wdio/globals'

/** appEntityTable component */
class EntityTableComponent {
  content(content) {
    return $('[data-testid="app-entity-table"]*=' + content)
  }

  entityLink(content) {
    return $('[data-testid="app-entity-link"]*=' + content)
  }
}

export default new EntityTableComponent()
