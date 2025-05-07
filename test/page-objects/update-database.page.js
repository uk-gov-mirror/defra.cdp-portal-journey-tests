import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class UpdateDatabase extends Page {
  /**
   * Check if the update database nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('update-database')
  }

  open() {
    return super.open('/update-database')
  }

  summary() {
    return $('[data-testid="update-database-summary"]')
  }
}

export default new UpdateDatabase()
