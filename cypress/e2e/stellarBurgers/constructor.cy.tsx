/// <reference types="cypress" />
const testUrl = 'http://localhost:4000/';
const modalDataCy = '[data-cy=modal]';
const constructorDataCy = '[data-cy=constructor]';
const mainDataCy = '[data-cy=main]';
const mainLinkDataCy = '[data-cy=link-main]';
const constructorIngredientsDataCy = '[data-cy=constructor-ingredients]';

describe('Тесты для страницы конструктора бургера', function() {

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  })
  
  it('Добавление ингредиента в конструктор', function() {
    cy.wait('@getIngredients').its('response.body.data').should('have.length.gt', 0);
    cy.get(mainDataCy).contains('Добавить').click({ force: true });
    cy.get(constructorIngredientsDataCy).within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  })

  it('Открытие модального окна ингредиента', function() {
    cy.get(mainLinkDataCy).first().click({ force: true });
    cy.get(modalDataCy).should('be.visible');
  })

  it('Закрытие модального окна ингредиента на крестик', function() {
    cy.get(mainLinkDataCy).first().click({ force: true });
    cy.get(modalDataCy).should('be.visible');
    cy.get('[data-cy=modal-close]').click();
    cy.get(modalDataCy).should('not.exist');
  })
});

describe('Тесты для создания заказа', function() {

  beforeEach(function () {
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    // Мокируем запросы
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'userData.json',
    }).as('getUser');

    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json',
    }).as('createOrder');

    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  })

  it('Проверка сборки бургера, заказа бургера, проверки номера заказа, закрытия модального окна, очистки конструктора', function() {
    cy.wait('@getIngredients').its('response.body.data').should('have.length.gt', 0);
    // Добавляем булки
    cy.get('[data-cy=bun]')
      .contains('Добавить')
      .click({ force: true });
    cy.get('[data-cy=constructor-bun-top]')
      .within(() => {
        cy.contains('Краторная булка N-200i (верх)').should('exist');
      });
    cy.get('[data-cy=constructor-bun-bottom]')
      .within(() => {
        cy.contains('Краторная булка N-200i (низ)').should('exist');
      });

    // Добавляем ингредиент
    cy.get(mainDataCy)
      .contains('Добавить')
      .click({ force: true });
    cy.get(constructorIngredientsDataCy)
      .within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });

    // Добавляем соус
    cy.get('[data-cy=sauce]')
      .contains('Добавить')
      .click({ force: true });
    cy.get(constructorIngredientsDataCy)
      .within(() => {
        cy.contains('Соус Spicy-X').should('exist');
      });
    
    //Оформляем заказ
    cy.get('[data-cy=order-button]').click();

    //Проверка модального окна результата заказа
    cy.get(modalDataCy).should('be.visible');
    cy.get('[data-cy=order-number]').should('have.text', '1');
    cy.get('[data-cy=modal-close]').click();
    cy.get(modalDataCy).should('not.exist');

    //Проверка, что конструктор пуст
    cy.get(constructorDataCy).children().first().should('have.text', 'Выберите булки');
    cy.get(constructorDataCy).children().eq(1).should('have.text', 'Выберите начинку');
    cy.get(constructorDataCy).children().eq(2).should('have.text', 'Выберите булки');
  });
});
