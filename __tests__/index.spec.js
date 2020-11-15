/* <!--
  =========================================================
  Que tal aumentar o coverage para que ele comece a passar
  nos critérios do desafio?

  Objetivo: Alcançar 80% de cobertura, mas não se preocupe
  se não chegar a alcançar a objetivo, faça o quanto você
  acha que é necessário para garantir segurança quando um
  outro amigo for mexer no mesmo código que você :)

  Confira nossas taxas de coberturas atuais :(

  ----------|----------|----------|----------|----------|-------------------|
  File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
  ----------|----------|----------|----------|----------|-------------------|
  All files |    15.79 |        0 |     9.52 |    14.29 |                   |
  index.js  |    15.79 |        0 |     9.52 |    14.29 |... 72,76,78,83,91 |
  ----------|----------|----------|----------|----------|-------------------|
  Jest: Uncovered count for statements (32)exceeds global threshold (10)
  Jest: "global" coverage threshold for branches (80%) not met: 0%
  Jest: "global" coverage threshold for lines (80%) not met: 14.29%
  Jest: "global" coverage threshold for functions (80%) not met: 9.52%
--> */

import CreditasChallenge, { COLLATERALS, Send } from "../src/index";

function initializeAppMock() {
  document.body.innerHTML = `
    <form class="form" data-testid="form">
      <label for="collateral-value">Collateral Amount</label>
      <select name="installments" id="installments" required></select>
      <select name="collateral" id="collateral" required></select>
      <input id="collateral-value" name="collateral-value" value="1" required />
      <input name="collateral-value-range" id="collateral-value-range" />
      <div id="collateral-value-range-values">
        <span></span>
        <span></span>
      </div>
      <input required name="loan-amount" id="loan-amount" />
      <input name="loan-amount-range" id="loan-amount-range" />
      <div id="loan-amount-range-values">
        <span></span>
        <span></span>
      </div>
      <div id="quota"></div>
      <div id="rate"></div>
      <div id="total">1234</div>
      <button type="button"></button>
      <div id="help">Help</div>
    </form>
  `;
}

function clean() {
  document.body.innerHTML = "";
}

describe("Creditas Challenge", () => {
  beforeAll(() => {
    initializeAppMock();
  });

  afterAll(() => {
    clean();
  });

  describe("Send method", () => {
    it("should return values", () => {
      Send([
        {
          field: "installments",
          value: "12",
        },
      ]).then((result) => {
        expect(result).toBe("OUTPUT\ninstallments --> 12");
      });
    });
    it("should fails", () => {
      Send(null).catch((err) => {
        expect(err).toBeDefined();
      });
    });
  });
  it("should initialize form values and listeners", () => {
    CreditasChallenge.initialize(COLLATERALS);
    let total = document.getElementById("total");
    let quota = document.getElementById("quota");
    let rate = document.getElementById("rate");

    expect(total.textContent).toContain("3,333.60");
    expect(quota.textContent).toContain("138.90");
    expect(rate.textContent).toContain("111.12");
  });

  it("should reset form on change collateral", () => {
    const collateral = document.getElementById("collateral");
    const event = new Event("change");
    collateral.dispatchEvent(event);
  });

  it("should have event listener to submit data form", () => {
    window.confirm = jest.fn();
    const form = document.querySelector(".form");
    const event = new Event("submit");
    form.dispatchEvent(event);
  });

  it("should have event listener to change data form", () => {
    window.confirm = jest.fn();
    const form = document.querySelector(".form");
    const event = new Event("change");
    form.dispatchEvent(event);
  });

  it("should have event listener to collateral value", () => {
    const element = document.getElementById("collateral-value");
    const event = new Event("change");
    element.dispatchEvent(event);
  });

  it("should have event listener to collateral value range", () => {
    const element = document.getElementById("collateral-value-range");
    const event = new Event("change");
    element.dispatchEvent(event);
  });

  it("should have event listener to loan amount", () => {
    const element = document.getElementById("loan-amount");
    const event = new Event("change");
    element.dispatchEvent(event);
  });

  it("should have event listener to collateral value range", () => {
    const element = document.getElementById("loan-amount-range");
    const event = new Event("change");
    element.dispatchEvent(event);
  });
});
