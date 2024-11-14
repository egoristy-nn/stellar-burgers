describe('Тесты для страницы конструктора бургера', function() {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
  })
});
