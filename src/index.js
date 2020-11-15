import {
  formatCurrency,
  getFormValues,
  calculatePayments,
  toStringFormValues,
} from "./utils";

import "./styles.css";

export const COLLATERALS = {
  vehicle: {
    name: "Vehicle",
    minLoanAmount: 3000,
    maxLoanAmount: 1000000,
    nInstallments: [24, 36, 48],
    minCollateral: 5000,
    maxCollateral: 3000000,
  },
  home: {
    name: "Home",
    minLoanAmount: 30000,
    maxLoanAmount: 4500000,
    nInstallments: [120, 180, 240],
    minCollateral: 50000,
    maxCollateral: 100000000,
  },
};

export const Send = (values) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(toStringFormValues(values));
    } catch (error) {
      reject(error);
    }
  });
};

export default class CreditasChallenge {
  static initialize(collaterals) {
    this.collaterals = collaterals;
    this.initializeCollateral();
    this.registerEvents();
  }

  static initializeCollateral() {
    const collateralElement = document.getElementById("collateral");
    Object.keys(this.collaterals).forEach((key, index) => {
      collateralElement.options[collateralElement.options.length] = new Option(
        this.collaterals[key].name,
        key
      );
    });

    this.resetForm(collateralElement.value);
  }

  static registerEvents() {
    this.handleSubmit(
      document.querySelector(".form"),
      document.getElementById("total")
    );
    this.handleHelp(document.getElementById("help"));

    this.handleFormChange(
      document.querySelector(".form"),
      document.getElementById("quota"),
      document.getElementById("total"),
      document.getElementById("rate")
    );

    this.handleChangeCollateralValue(
      document.getElementById("collateral-value-range"),
      document.getElementById("collateral-value"),
      document.getElementById("loan-amount-range"),
      document.getElementById("loan-amount"),
      document.getElementById("collateral")
    );

    this.handleChangeLoanAmount(
      document.getElementById("loan-amount-range"),
      document.getElementById("loan-amount"),
      document.getElementById("collateral-value"),
      document.getElementById("collateral")
    );

    this.handleChangeCollateral(document.getElementById("collateral"));
  }

  static handleSubmit(formElement, totalElement) {
    formElement.addEventListener("submit", function (event) {
      event.preventDefault();

      if (formElement.checkValidity()) {
        const values = getFormValues(formElement);
        values.push({ field: "TOTAL", value: totalElement.textContent });
        Send(values)
          .then((result) => confirm(result, "Your form submited success"))
          .catch((error) => alert("Your form submited error", error));
      }
    });
  }

  static handleHelp(element) {
    element.addEventListener("click", function (event) {
      alert("Display here the help text");
    });
  }

  static handleFormChange(
    formElement,
    quotaElement,
    totalElement,
    rateElement
  ) {
    formElement.addEventListener("change", () => {
      this.recalculateAndShowPaymentValues(
        formElement,
        quotaElement,
        totalElement,
        rateElement
      );
    });
  }

  static handleChangeCollateralValue(
    collateralValueRangeElement,
    collateralValueElement,
    loanAmountRangeElement,
    loanAmountElement,
    collateral
  ) {
    const MIN_VALUE = this.collaterals[collateral.value].minCollateral;
    const MAX_VALUE = this.collaterals[collateral.value].maxCollateral;

    collateralValueRangeElement.addEventListener("change", (event) => {
      const value = Number(event.target.value);
      collateralValueElement.value = value;

      const valuePercentage = value * 0.8;
      if (loanAmountElement.value > valuePercentage) {
        this.changeLoanAmount(
          valuePercentage,
          loanAmountElement,
          loanAmountRangeElement
        );
      }
    });

    collateralValueElement.addEventListener("change", (event) => {
      const value = Math.min(
        Math.max(event.target.value, MIN_VALUE),
        MAX_VALUE
      );
      collateralValueRangeElement.value = value;
      collateralValueElement.value = value;

      const valuePercentage = value * 0.8;
      if (loanAmountElement.value > valuePercentage) {
        this.changeLoanAmount(
          valuePercentage,
          loanAmountElement,
          loanAmountRangeElement
        );
      }
    });
  }

  static handleChangeLoanAmount(
    loanAmountRangeElement,
    loanAmountElement,
    collateralValueElement,
    collateral
  ) {
    const MIN_VALUE = this.collaterals[collateral.value].minLoanAmount;

    loanAmountRangeElement.addEventListener("change", (event) => {
      const value = Math.min(
        Math.max(event.target.value, MIN_VALUE),
        collateralValueElement.value * 0.8
      );
      this.changeLoanAmount(value, loanAmountElement, loanAmountRangeElement);
    });

    loanAmountElement.addEventListener("change", (event) => {
      const value = Math.min(
        Math.max(event.target.value, MIN_VALUE),
        collateralValueElement.value * 0.8
      );
      this.changeLoanAmount(value, loanAmountElement, loanAmountRangeElement);
    });
  }

  static handleChangeCollateral(collateralElement) {
    collateralElement.addEventListener("change", (event) => {
      this.resetForm(event.target.value);
    });
  }

  static changeLoanAmount(value, loanAmountElement, loanAmountRangeElement) {
    loanAmountRangeElement.value = value;
    loanAmountElement.value = value;
  }

  static recalculateAndShowPaymentValues(
    formElement,
    quotaElement,
    totalElement,
    rateElement
  ) {
    const result = calculatePayments(getFormValues(formElement));
    quotaElement.textContent = formatCurrency(result.monthlyPayment, true);
    totalElement.textContent = formatCurrency(result.totalPayable, true);
    rateElement.textContent = `${result.monthlyInterestRate} %`;
  }

  static resetForm(collateral) {
    const collateralValue = document.getElementById("collateral-value");
    const collateralRange = document.getElementById("collateral-value-range");
    const collateralRangeValues = document.getElementById(
      "collateral-value-range-values"
    );

    collateralValue.value = this.collaterals[collateral].minCollateral;
    collateralValue.setAttribute(
      "min",
      this.collaterals[collateral].minCollateral
    );
    collateralValue.setAttribute(
      "max",
      this.collaterals[collateral].maxCollateral
    );

    collateralRange.value = this.collaterals[collateral].minCollateral;
    collateralRange.setAttribute(
      "min",
      this.collaterals[collateral].minCollateral
    );
    collateralRange.setAttribute(
      "max",
      this.collaterals[collateral].maxCollateral
    );

    collateralRangeValues.firstElementChild.textContent = formatCurrency(
      this.collaterals[collateral].minCollateral,
      false
    );
    collateralRangeValues.lastElementChild.textContent = formatCurrency(
      this.collaterals[collateral].maxCollateral,
      false
    );

    const loanAmount = document.getElementById("loan-amount");
    const loanAmountRange = document.getElementById("loan-amount-range");
    const loanAmountRangeValues = document.getElementById(
      "loan-amount-range-values"
    );

    loanAmount.value = this.collaterals[collateral].minLoanAmount;
    loanAmount.setAttribute("min", this.collaterals[collateral].minLoanAmount);
    loanAmount.setAttribute("max", this.collaterals[collateral].maxLoanAmount);

    loanAmountRange.value = this.collaterals[collateral].minLoanAmount;
    loanAmountRange.setAttribute(
      "min",
      this.collaterals[collateral].minLoanAmount
    );
    loanAmountRange.setAttribute(
      "max",
      this.collaterals[collateral].maxLoanAmount
    );

    loanAmountRangeValues.firstElementChild.textContent = formatCurrency(
      this.collaterals[collateral].minLoanAmount,
      false
    );
    loanAmountRangeValues.lastElementChild.textContent = formatCurrency(
      this.collaterals[collateral].maxLoanAmount,
      false
    );

    const nInstallments = document.getElementById("installments");
    nInstallments.options.length = 0;
    this.collaterals[collateral].nInstallments.forEach((option) => {
      nInstallments.options[nInstallments.options.length] = new Option(
        option,
        option
      );
    });

    this.recalculateAndShowPaymentValues(
      document.querySelector(".form"),
      document.getElementById("quota"),
      document.getElementById("total"),
      document.getElementById("rate")
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  CreditasChallenge.initialize(COLLATERALS);
});
