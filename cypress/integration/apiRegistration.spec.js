/// <reference types="Cypress" />

describe('API testcases', () => {

    it('API request', () => {
        let howManyUsersToRegister = 1;

        for (let i = 0; i < howManyUsersToRegister; i++) {
            //generate email address
            let randomEmailAddress = 'testUser' + Cypress._.random(0, 1e6) + '@email.com';
            //generate password
            let randomValidPassword = Cypress._.random(0, 1e6);
            let randomName = 'Name' + Cypress._.random(0, 1e6);
            let randomSurname = 'SurName';

            cy.request({
                url: '/api/v3/user/register',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Host': 'www.pollfish.com',
                    'Cookie': 'G_ENABLED_IDPS=google'

                },
                body: {
                    "email": randomEmailAddress,
                    "password": randomValidPassword,
                    "fullName": randomName + ' ' + randomSurname,
                    "companyName": "Test",
                    "companyEmail": "",
                    "qualification": "2",
                    "referral": 1,
                    "otherReferral": "",
                    "legal": null,
                    "newsletter": false,
                    "consentTypes": [
                        "GDPR"
                    ],
                    "isDeveloper": false
                }
            }).then((resp) => {
                assert.equal(resp.status, 200)
                cy.log('User ' + resp.body.firstName + ' ' + resp.body.lastName + ' with email ' + resp.body.email + ' is created with id ' + resp.body.id)
            })
        }
    })
})