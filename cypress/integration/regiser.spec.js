/// <reference types="Cypress" />


let registerPage = {};
let surveyMainPage = {};
let sideBarTexts = {};

//generate email address
let randomEmailAddress = 'testUser' + Cypress._.random(0, 1e6) + '@email.com';
//generate password
let randomValidPassword = Cypress._.random(0, 1e6);

describe('Register', function () {
    before('fixtures', function () {
        cy.fixture('elements/registerPage').then(function (json) {
            registerPage = json;
        });
        cy.fixture('elements/surveyMainPage').then(function (json) {
            surveyMainPage = json;
        });
        cy.fixture('sideBarText').then(function (json) {
            sideBarTexts = json;
        });
    });

    it('Complete Registration', () => {
        cy.visit('/signup/researcher');

        //- Page 1 (email)
        //verify I'm researcher is selected
        cy.get(registerPage.userTypeSelection).eq(0)
            .and(($text) => {
                expect($text).to.contain('I\'m a researcher');
            })
            .should('have.class', registerPage.userTypeActive)
            .and('have.attr', 'href')
            .and('match', /\/signup\/researcher/);

        cy.get(registerPage.emailInput)
            .type(randomEmailAddress)
            .should('have.value', randomEmailAddress);

        cy.get(registerPage.registerButton).click();

        //- Page 2 - Please enter a password
        //verify sidebar exists
        cy.get(registerPage.registerSideBar).should('exist');

        //verify active page on sidebar
        cy.verifySideBarText(sideBarTexts.password);

        //verify password input attributes and fill a random password
        cy.get(registerPage.passwordInput)
            .should('have.attr', 'name', 'password')
            .and('have.attr', 'type', 'password')
            .type(randomValidPassword)
            .should('have.value', randomValidPassword);

        //press next
        cy.get(registerPage.nextButton).click();

        
        //-Page 3 - What's your full name?
        let randomName = 'Name' + Cypress._.random(0, 1e6);
        let randomSurname = 'SurN';
        //verify active page on sidebar
        cy.verifySideBarText(sideBarTexts.fullName);

        cy.get(registerPage.fullNameInput)
            .should('have.attr', 'name', 'fullName')
            .and('have.attr', 'type', 'text')
            .type(randomName + ' ' + randomSurname)
            .should('have.value', randomName + ' ' + randomSurname);

        //press next
        cy.get(registerPage.nextButton).click();

        //-Page 4 - What's your company's name?
        cy.verifySideBarText(sideBarTexts.companyName);

        cy.get(registerPage.companyInput)
            .should('have.attr', 'role', 'combobox')
            .and('have.attr', 'aria-autocomplete', 'list')
            // .and('have.attr', 'aria-expanded', 'false')
            .and('have.attr', 'autocomplete', 'off')
            .type('P').then(() => {
                cy.get(registerPage.companyListItem).eq(0).click();
            });

        //press next
        cy.get(registerPage.nextButton).click();

        //-Page 5 - I'd like to
        cy.verifySideBarText(sideBarTexts.likeTo);

        cy.contains('Buy survey responses from Pollfish audience').within(() => {
            cy.get(registerPage.likeToRadioButton).click()
                .should('have.attr', 'name', 'qualification')
                .and('be.checked')
        });

        //press next
        cy.get(registerPage.nextButton).click();

        //-Page 6 - How did you find us?
        cy.verifySideBarText(sideBarTexts.findUs);

        //click dropdown list
        cy.get(registerPage.findUsDropDown).click().then(() => {
            //get all options and choose a random
            cy.get('[id*="react-select-2-option"]').then((options) => {
                let randomSelection = Cypress._.random(0, options.length - 1)
                cy.get(options).eq(randomSelection).click()
            });
        });

        //press next
        cy.get(registerPage.nextButton).click();

        //-Page 7 - Legal
        cy.verifySideBarText(sideBarTexts.legal);

        //verify terms are shown
        cy.get(registerPage.terms).should('exist');

        //verify important updates exists and includes checkbox
        cy.get(registerPage.importantUpdates)
            .should('exist')
            .within(() => {
                cy.get(registerPage.importantUpdatesCheckBox)
                    .should('exist')
                    .and('have.attr', 'type', 'checkbox')
                    .and('have.attr', 'name', 'newsletter')
            });

        //press submit
        cy.get(registerPage.submitButton).click();

        //create a new survey
        cy.get(surveyMainPage.createNewSurveyButton)
            .should('have.attr', 'type', 'button')
            .click().then(() => {
                cy.get(surveyMainPage.surveyNameModal).should('exist').within(() => {
                    //Fill survey name
                    cy.get(surveyMainPage.surveyNameInput)
                        .should('have.attr', 'type', 'text')
                        .type('New Survey for ' + randomEmailAddress)

                    //submit
                    cy.get(surveyMainPage.createSurveySubmitButton).click()
                });
            });
        cy.get(surveyMainPage.surveyNameModal, { timeout: 40000 }).should('not.exist').then(() => {
            //logout
            cy.get(surveyMainPage.threeDotsMenu, { timeout: 40000 }).click();
            cy.contains('Logout').click();
        });


    });
});