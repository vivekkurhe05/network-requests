/// <reference types="Cypress" />

describe('Network request', () => {
    let message = "whoa, this comment does not exist"

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/network-requests')
    })

    it('Get request', () => {
        cy.intercept({
            method: 'GET',
            url: '**/comments/*'
        },
        {
            body: {
                body: message
            }

        }).as('getComment')

        cy.get('.network-btn.btn').click()
        cy.wait('@getComment').should(({request, response}) => {
            expect(response.body.body).to.eq(message)
        })
    });

    it.only('Post request', () => {
        let exp = {
            name: "Vivek",
            email: "vivek@gmail.com",
            body: "body has changed"
        }

        cy.intercept({
            method: "POST",
            url: "/comments"},
            {
                body: {
                    name: "Vivek",
                    email: "vivek@gmail.com",
                    body: "body has changed"
                }
        }).as('postComment')

        cy.get('.network-post.btn').click()

        cy.wait('@postComment').should(({request, response}) => {
            expect(response.body).to.deep.eq(exp)
        })
    })
});