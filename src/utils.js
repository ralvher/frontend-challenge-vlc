export const formatCurrency = (number, withCurrency) =>
  new Intl.NumberFormat(
    "pt-BR",
    withCurrency ? { style: "currency", currency: "BRL" } : {}
  ).format(number);

export const getFormValues = (formElement) =>
  Object.values(formElement.elements)
    .filter((element) => ["SELECT", "INPUT"].includes(element.nodeName))
    .map((element) => ({
      field: element.name,
      value: element.value,
    }));

export const toStringFormValues = (values) => {
  return `OUTPUT\n${values
    .map((value) => `${value.field} --> ${value.value}`)
    .join("\n")}`;
};

export const calculatePayments = (values) => {
  const match = (matchString) => (value) => value.field === matchString;
  const FTT = 6.38 / 100;
  const INTEREST_RATE = 2.34 / 100;
  const INSTALLMENTS = values.find(match("installments")).value;
  const NUMBER_OF_INSTALLMENTS = INSTALLMENTS / 1000;
  const LOAN_AMOUNT = values.find(match("loan-amount")).value;
  const totalPayable =
    (FTT + INTEREST_RATE + NUMBER_OF_INSTALLMENTS + 1) * LOAN_AMOUNT;
  const monthlyPayment = totalPayable / INSTALLMENTS;
  const monthlyInterestRate = (totalPayable * 100) / LOAN_AMOUNT;
  return {
    totalPayable,
    monthlyPayment,
    monthlyInterestRate,
  };
};
