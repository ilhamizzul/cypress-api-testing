const { faker } = require('@faker-js/faker');

describe("User Profile Tests", () => {

  it("[P-GET] Should be able to get a profile information", () => {
    cy.api({
      method: 'GET',
      url: '/profiles.json',
      headers: {
        Authorization: Cypress.env('token')
      }
    }).then((result) => {
      expect(result.status).to.eq(200);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('user')
    })
  }) 
  
  it("[N-GET] Should not be able to get a profile information without login", () => {
    cy.api({
      method: 'GET',
      url: '/profiles.json',
      failOnStatusCode: false
    }).then((result) => {
      expect(result.status).to.eq(401);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('error', 'You need to sign in or sign up before continuing.')
    })
  }) 

  it("[P-PUT] Should be able to update profile information", () => {

    let formData = new FormData();
    formData.append('user[name]', faker.person.fullName);
    formData.append('user[phone_number]', faker.phone.number);
    formData.append('user[address]', faker.location.streetAddress);
    formData.append('user[city_id]', 25);
    formData.append('user[avatar]', faker.image.avatar);

    const payload = {
      user: {
        name: faker.person.fullName(),
        phone_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        city_id: 25,
        avatar: null, // May need adjustment if the API expects an actual file
      },
    };

    cy.api({
      method: 'PUT',
      url: '/profiles.json',
      headers: {
        Authorization: Cypress.env('token'),
        'Content-Type': 'multipart/form-data',
      },
      //body: formData,
      body: payload,
      failOnStatusCode: false,
    }).then((result) => {
      expect(result.status).to.eq(200);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('user')
    })
  }) 
})