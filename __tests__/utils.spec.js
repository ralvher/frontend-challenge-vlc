import {
  formatCurrency,
  getFormValues,
  calculatePayments,
  toStringFormValues,
} from "../src/utils";

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
  beforeEach(() => {
    initializeAppMock();
  });

  afterEach(() => {
    clean();
  });

  describe("Method: formatCurrency", () => {
    it("should return number format without currency symbol", () => {
      expect(formatCurrency(1000, false)).toBe("1,000");
    });

    it("should return number format with currency symbol", () => {
      expect(formatCurrency(1000, true)).toContain("1,000.00");
    });
  });

  describe("Method: getFormValues", () => {
    it("should values with field name as key and value as value", () => {
      const values = getFormValues(document.querySelector(".form"));
      expect(values).toStrictEqual([
        {
          field: "installments",
          value: "",
        },
        {
          field: "collateral",
          value: "",
        },
        {
          field: "collateral-value",
          value: "1",
        },
        {
          field: "collateral-value-range",
          value: "",
        },
        {
          field: "loan-amount",
          value: "",
        },
        {
          field: "loan-amount-range",
          value: "",
        },
      ]);
    });
  });

  describe("Method: calculate", () => {
    it("should return totalPayable, monthlyPayment, monthlyInterestRate", () => {
      const values = [
        { field: "installments", value: 24 },
        { field: "loan-amount", value: 3000 },
      ];
      const result = calculatePayments(values);

      expect(result.totalPayable).toBe(3333.6);
      expect(result.monthlyPayment).toBe(138.9);
      expect(result.monthlyInterestRate).toBe(111.12);
    });
  });

  describe("Method: toStringFormValues", () => {
    it("should return the fields with the total payable", () => {
      const values = [
        { field: "installments", value: 24 },
        { field: "loan-amount", value: 3000 },
        { field: "Total", value: "3,333.6" },
      ];

      expect(toStringFormValues(values)).toBe(
        "OUTPUT\ninstallments --> 24\nloan-amount --> 3000\nTotal --> 3,333.6"
      );
    });
  });
});
