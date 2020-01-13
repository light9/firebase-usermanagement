context('Actions', () => {

  beforeEach(() => {
    cy.login()
  })

  it('update user settings', () => {
    cy.visit('http://localhost:4200/adminSettings').wait(3000)

    cy.get('.admin-settings-collection > :nth-child(1) > :nth-child(3)').click()

    cy.get('.form-container > .ng-untouched')
      .clear()
      .type('new name')
    
    cy.get('[type="submit"]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal(`update succesful`)
    })
    cy.get('[style="right: 10px; position: absolute;"]').click()
  })

  it('impersonate user', () => {
    cy.visit('http://localhost:4200/adminSettings').wait(3000)

    cy.get('.admin-settings-collection > :nth-child(1) > :nth-child(4)').click().wait(2000)

    cy.on('window:alert', (str) => {
      expect(str).to.equal(`login succesful`)
    })

    cy.visit('http://localhost:4200/home')

    cy.get('.form-control')
      .invoke('val')
      .then(sometext => expect(sometext).to.equal(`new name`));
    cy.logout()
  })
})