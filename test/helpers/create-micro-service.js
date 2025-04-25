import { browser } from '@wdio/globals'

import FormComponent from 'components/form.component'
import ServicesPage from 'page-objects/services.page'

/**
 * Helper to create a microservice. Contains no expectations
 * @param {string} name
 * @param {('TenantTeam1'|'Platform')} teamName
 * @returns {Promise<void>}
 */
async function createMicroService(name, teamName) {
  const serviceTypes = ['DotNet Backend', 'Node.js Frontend', 'Node.js Backend']
  const randomServiceType = Math.floor(Math.random() * serviceTypes.length)
  const serviceType = serviceTypes[randomServiceType]

  // Choose microservice
  await FormComponent.inputLabel('Microservice').click()
  await FormComponent.submitButton('Next').click()

  // Choose detail
  await FormComponent.inputLabel('Name').click()
  await browser.keys(name)
  await FormComponent.inputLabel('Template').click()
  await browser.keys(serviceType)
  await FormComponent.inputLabel('Owning Team').click()
  await browser.keys(teamName)
  await FormComponent.submitButton('Next').click()

  // Create
  await FormComponent.submitButton('Create').click()

  // Status page
  for (const statusTag of [
    'github-repository',
    'config',
    'networking',
    'proxy',
    'dashboards',
    'infrastructure'
  ]) {
    await $(`[data-testid="${statusTag}-status-tag"]*=Success`).waitForExist()
  }

  // eslint-disable-next-line wdio/no-pause
  await browser.pause(11000) // Wait for Portal backend GitHub poll to run (set to 10 seconds)

  // Click link to new microservice page
  await ServicesPage.link('new microservices page').click()
}

export { createMicroService }
