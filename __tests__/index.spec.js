import { fireEvent, getByTestId } from "@testing-library/dom";
import axios from "axios";

import CreditasChallenge, { COLLATERALS, Send, Help } from "../src/index";

jest.mock("axios");

function initializeAppMock() {
  document.body.innerHTML = `
    <form class="form" data-testid="form">
    <select
      name="installments"
      id="installments"
      data-testid="installments"
      required
    ></select>
    <select
      name="collateral"
      id="collateral"
      data-testid="collateral"
      required
    ></select>
    <input
      id="collateral-value"
      data-testid="collateral-value"
      name="collateral-value"
      value="1"
      required
    />
    <input
      name="collateral-value-range"
      id="collateral-value-range"
      data-testid="collateral-value-range"
    />
    <div id="collateral-value-range-values">
      <span></span>
      <span></span>
    </div>
    <input
      required
      name="loan-amount"
      id="loan-amount"
      data-testid="loan-amount"
    />
    <input
      name="loan-amount-range"
      id="loan-amount-range"
      data-testid="loan-amount-range"
    />
    <div id="loan-amount-range-values">
      <span></span>
      <span></span>
    </div>
    <div id="quota" data-testid="quota"></div>
    <div id="rate" data-testid="rate"></div>
    <div id="total" data-testid="total">1234</div>
    <button type="button" data-testid="submit"></button>
    <div id="help" data-testid="help">Help</div>
  </form>;
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

  describe("Help method", () => {
    it("should return values", () => {
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: { text: "Hola" } })
      );
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: { text: "Caracola" } })
      );
      Help().then((result) => {
        expect(result).toBe("Hola\nCaracola");
      });
    });
    it("should fails", () => {
      Send().catch((err) => {
        expect(err).toBeDefined();
      });
    });
  });

  it("should initialize form values and listeners", () => {
    CreditasChallenge.initialize(COLLATERALS);
    let total = getByTestId(document.body, "total");
    let quota = getByTestId(document.body, "quota");
    let rate = getByTestId(document.body, "rate");

    expect(total.textContent).toContain("3,333.60");
    expect(quota.textContent).toContain("138.90");
    expect(rate.textContent).toContain("111.12");
  });

  it("should reset form on change collateral", () => {
    const collateral = getByTestId(document.body, "collateral");
    fireEvent.change(collateral, { target: { value: "home" } });

    let total = getByTestId(document.body, "total");
    let quota = getByTestId(document.body, "quota");
    let rate = getByTestId(document.body, "rate");

    expect(total.textContent).toContain("36,216.00");
    expect(quota.textContent).toContain("301.80");
    expect(rate.textContent).toContain("120.72");
  });

  it("should have event listener to submit data form", () => {
    window.confirm = jest.fn();
    const form = getByTestId(document.body, "form");
    fireEvent.submit(form);
  });

  it("should have event listener to change data form", () => {
    const element = getByTestId(document.body, "installments");
    fireEvent.change(element, { target: { value: "180" } });

    let total = document.getElementById("total");
    let quota = document.getElementById("quota");

    expect(total.textContent).toContain("38,016.00");
    expect(quota.textContent).toContain("211.20");
  });

  it("should change collateral value", () => {
    const value = "600000";
    const collateralValue = getByTestId(document.body, "collateral-value");
    fireEvent.change(collateralValue, { target: { value } });

    const collateralValueRange = getByTestId(
      document.body,
      "collateral-value-range"
    );

    expect(collateralValue.value).toBe(value);
    expect(collateralValueRange.value).toBe(value);
  });

  it("should chnage collateral value range", () => {
    const value = "50000";
    const collateralValueRange = getByTestId(
      document.body,
      "collateral-value-range"
    );
    fireEvent.change(collateralValueRange, { target: { value } });

    const collateralValue = getByTestId(document.body, "collateral-value");

    expect(collateralValue.value).toBe(value);
    expect(collateralValueRange.value).toBe(value);
  });

  it("should change loan amount", () => {
    const value = "60000";
    const loanAmount = getByTestId(document.body, "loan-amount");
    fireEvent.change(loanAmount, { target: { value } });

    const collateralValue = getByTestId(document.body, "collateral-value");
    const loanAmountRange = getByTestId(document.body, "loan-amount-range");

    const expectedValue = String(collateralValue.value * 0.8);
    expect(loanAmount.value).toBe(expectedValue);
    expect(loanAmountRange.value).toBe(expectedValue);
  });

  it("should change loan amount range", () => {
    const value = "50000";

    const loanAmountRange = getByTestId(document.body, "loan-amount-range");
    fireEvent.change(loanAmountRange, { target: { value } });

    const collateralValue = getByTestId(document.body, "collateral-value");
    const loanAmount = getByTestId(document.body, "loan-amount");

    const expectedValue = String(collateralValue.value * 0.8);
    expect(loanAmount.value).toBe(expectedValue);
    expect(loanAmountRange.value).toBe(expectedValue);
  });

  it("should change loan amount when is greater than 80% of collateral value", () => {
    const firstValueForCollateral = "60000";
    const secondValueForCollateral = "50000";

    const collateralValue = getByTestId(document.body, "collateral-value");
    fireEvent.change(collateralValue, {
      target: { value: firstValueForCollateral },
    });

    const valueForLoanAmount = "48000";
    const loanAmount = getByTestId(document.body, "loan-amount");
    const loanAmountRange = getByTestId(document.body, "loan-amount-range");

    fireEvent.change(loanAmount, {
      target: { value: valueForLoanAmount },
    });

    expect(loanAmount.value).toBe(valueForLoanAmount);
    expect(loanAmountRange.value).toBe(valueForLoanAmount);

    fireEvent.change(collateralValue, {
      target: { value: secondValueForCollateral },
    });

    const expectedValue = String(secondValueForCollateral * 0.8);
    expect(loanAmount.value).toBe(expectedValue);
    expect(loanAmountRange.value).toBe(expectedValue);
  });

  it("should change loan amount when is greater than 80% of collateral value range", () => {
    const firstValueForCollateral = "55000";
    const secondValueForCollateral = "50000";

    const collateralValueRange = getByTestId(
      document.body,
      "collateral-value-range"
    );

    fireEvent.change(collateralValueRange, {
      target: { value: firstValueForCollateral },
    });

    const valueForLoanAmount = "44000";
    const loanAmount = getByTestId(document.body, "loan-amount");
    const loanAmountRange = getByTestId(document.body, "loan-amount-range");

    fireEvent.change(loanAmount, {
      target: { value: valueForLoanAmount },
    });

    expect(loanAmount.value).toBe(valueForLoanAmount);
    expect(loanAmountRange.value).toBe(valueForLoanAmount);

    fireEvent.change(collateralValueRange, {
      target: { value: secondValueForCollateral },
    });

    const expectedValue = String(secondValueForCollateral * 0.8);
    expect(loanAmount.value).toBe(expectedValue);
    expect(loanAmountRange.value).toBe(expectedValue);
  });

  it("should call to help and fails", () => {
    window.alert = jest.fn();
    window.confirm = jest.fn();

    axios.get.mockImplementationOnce(() => Promise.reject());
    axios.get.mockImplementationOnce(() => Promise.reject());

    const help = getByTestId(document.body, "help");
    fireEvent.click(help);

    expect(axios.get).toHaveBeenCalledWith("/api/question");
    expect(axios.get).toHaveBeenCalledWith("/api/answer");
  });

  it("should call to help", () => {
    window.alert = jest.fn();
    window.confirm = jest.fn();

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { text: "Hola" } })
    );
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { text: "Caracola" } })
    );

    const help = getByTestId(document.body, "help");
    fireEvent.click(help);

    expect(axios.get).toHaveBeenCalledWith("/api/question");
    expect(axios.get).toHaveBeenCalledWith("/api/answer");
  });

  it("should call to help with emit any call", () => {
    window.alert = jest.fn();
    window.confirm = jest.fn();

    const help = getByTestId(document.body, "help");
    fireEvent.click(help);

    expect(axios.get).not.toHaveBeenCalledWith("/api/question");
    expect(axios.get).not.toHaveBeenCalledWith("/api/answer");
  });
});
