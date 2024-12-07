/// <reference types="Cypress" />

describe('Network Requests', () => {

    let message = "Unable to find comment!"

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/network-requests')
    })

    // you can mock response by intercept method
    it('Get Request', () => {
        cy.intercept({
            method: "GET",
            url: "**/comments/*"
        },{
            body: {
                postId: 1,
                id: 1,
                name: 'test name 123',
                email: 'joe_blogs123@test.com',
                body: 'Hello world'
            }
            
        }).as('getComment')

        cy.get('.network-btn.btn').click()

        // we wait for XHR object to be visible or available in the networks tab
        cy.wait('@getComment').its('response.statusCode').should('eq', 200)

        // or you can pass request and response object and perform assertion
        // cy.wait('@getComment').should(({request, response}) => {
        //     console.log(request)
        //     console.log(response)
        //     expect(response.statusCode).to.eq(200)
        // })
    });

    it('Post Request', () => {
        cy.intercept('POST', '/comments').as('postComment')
        cy.get('.network-post.btn').click()

        // we wait for XHR object to be visible or available in the networks tab
        cy.wait('@postComment').should(({request, response}) => {
            console.log(request)
            expect(request.body).to.include('email')
            console.log(response)
            expect(response.body).to.have.property('name','Using POST in cy.intercept()')
            expect(request.headers).to.have.property('content-type')
            expect(request.headers).to.have.property('origin', 'https://example.cypress.io')
        })
    })

    it.only('Put Request', () => {
        cy.intercept({
            method: 'PUT',
            url: '**/comments/*'},
            {
                statusCode: 404,
                body: {error: message},
                delay: 500
        }).as('putComment')

        cy.get('.network-put.btn').click()

        cy.wait('@putComment').should(({response}) => {
            console.log(response)
            expect(response.body.error).to.eq('Unable to find comment!')
        })
    })
});