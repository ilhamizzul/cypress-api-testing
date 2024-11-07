const { faker } = require('@faker-js/faker');

describe("User Register Tests", () => {
  const name = faker.person.fullName();
  const email = faker.internet.email().toLocaleLowerCase();
  const password = faker.internet.password();

  it("[P-POST] Should successfully registered", () => {
    cy.api({
      method: "POST",
      url: "/users.json",
      body: {
        user: {
          name: name,
          email: email,
          password: password
        }
      }
    }).should((result) => {
      expect(result.status).to.eq(200);
      Cypress.env('email', email)
      Cypress.env('password', password)
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('user')
      expect(result.body.user).has.property('name', name)
      expect(result.body.user).has.property('email', email)
      
    })
  })

  it("[N-POST] Should not be able register using used email", () => {
    cy.api({
      method: "POST",
      url: "/users.json",
      body: {
        user: {
          name: faker.person.fullName(),
          email: email,
          password: faker.internet.password()
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 500) {
        console.error('Unexpected error:', response.body)
      } else {
        expect(response.status).to.eq(401);
        expect(response.duration).to.not.be.greaterThan(1000);
        expect(response.body.errors.email[0]).to.be.equal("has already been taken")
        //expect(response.body).has.property('email', 'has already been taken')
      }
    })
  })

  // it("[N-POST] Should not be able register using invalid email format", () => {
  //   cy.api({
  //     method: "POST",
  //     url: "/users.json",
  //     body: {
  //       user: {
  //         name: faker.person.fullName(),
  //         email: "blalalala",
  //         password: faker.internet.password()
  //       }
  //     },
  //     failOnStatusCode: false
  //   }).then((response) => {
  //     if (response.status === 500) {
  //       console.error('Unexpected error:', response.body)
  //     } else {
  //       expect(response.status).to.eq(401);
  //       expect(response.duration).to.not.be.greaterThan(1000);
  //       expect(response.body.errors.email[0]).to.be.equal("your email are using incorrect format")
  //     }
  //   })
  // })

})

describe("User Login Tests", () => {
  it("[P-POST] Should be able to login using correct auth", () => {
    cy.api({
      method: 'POST',
      url: '/users/sign_in.json',
      body: {
        "user": {
          "email": Cypress.env('email'),
          "password": Cypress.env('password')
        }
      }
    }).then((result) => {
      expect(result.status).to.eq(200);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('user')
      Cypress.env('token', `Bearer ${result.body.session.token}`)
    })
  })

  it('[N-POST] Should not be able to login using wrong email', () => {
    cy.api({
      method: 'POST',
      url:  '/users/sign_in.json',
      body: {
        "user": {
          "email": faker.internet.email(),
          "password": Cypress.env('password')
        }
      },
      failOnStatusCode: false
    }).then((result) => {
      expect(result.status).to.eq(401);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('error', 'Invalid Email or password.')
    })
  });

  it('[N-POST] Should not be able to login using wrong password', () => {
    cy.api({
      method: 'POST',
      url:  '/users/sign_in.json',
      body: {
        "user": {
          "email": Cypress.env('email'),
          "password": faker.internet.password()
        }
      },
      failOnStatusCode: false
    }).then((result) => {
      expect(result.status).to.eq(401);
      expect(result.duration).to.not.be.greaterThan(1000);
      expect(result.body).has.property('error', 'Invalid Email or password.')
    })
  });

})
