const payButton = document.querySelector("#pay-button");
const form = document.querySelector("#payment-form");
const orderNumber = document.querySelector("#order_number");
const orderDate = document.querySelector("#order_date");
const priceOne = document.querySelector("#price_one");
const priceTwo = document.querySelector("#price_two");
const priceTotal = document.querySelector("#price_total");

const randomOrderNumber = Math.floor(Math.random() * 90000) + 10000;
const randomPriceOne = Math.floor(Math.random() * 90) + 10;
const randomPriceTwo = Math.floor(Math.random() * 900) + 10;

orderNumber.textContent = `#${randomOrderNumber}`;
orderDate.textContent = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

priceOne.textContent = `${randomPriceOne}.00`;
priceTwo.textContent = `${randomPriceTwo}.00`;

const totalPrice = +(randomPriceOne + randomPriceTwo);

priceTotal.textContent = `${totalPrice}.00`;

payButton.textContent = `PAY ${totalPrice}.00`;

let errorStack = [];

Frames.init("pk_test_934238f0-0858-43d5-a109-f2fb18f0291a");

const onCardValidationChanged = (event) => {
  console.log("CARD_VALIDATION_CHANGED: %o", event);
  payButton.disabled = !Frames.isCardValid();
};

Frames.addEventHandler(
  Frames.Events.CARD_VALIDATION_CHANGED,
  onCardValidationChanged
);

Frames.addEventHandler(
  Frames.Events.FRAME_VALIDATION_CHANGED,
  onValidationChanged
);
function onValidationChanged(event) {
  console.log("FRAME_VALIDATION_CHANGED: %o", event);

  const errorMessageElement = document.querySelector(".error-message");
  const hasError = !event.isValid && !event.isEmpty;

  if (hasError) {
    errorStack.push(event.element);
  } else {
    errorStack = errorStack.filter((element) => {
      return element !== event.element;
    });
  }

  const errorMessage = errorStack.length
    ? getErrorMessage(errorStack[errorStack.length - 1])
    : "";
  errorMessageElement.textContent = errorMessage;
}

const getErrorMessage = (element) => {
  const errors = {
    "card-number": "Please enter a valid card number",
    "expiry-date": "Please enter a valid expiry date",
    cvv: "Please enter a valid cvv code",
  };

  return errors[element];
};

const onCardTokenizationFailed = (error) => {
  console.log("CARD_TOKENIZATION_FAILED: %o", error);
  Frames.enableSubmitForm();
};

Frames.addEventHandler(
  Frames.Events.CARD_TOKENIZATION_FAILED,
  onCardTokenizationFailed
);

// const onCardTokenized = (event) => {
//   const el = document.querySelector(".success-payment-message");
//   el.innerHTML =
//     "Card tokenization completed<br>" +
//     'Your card token is: <span class="token">' +
//     event.token +
//     "</span>";
// };

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let data = {};

  Frames.submitCard().then((res) => {
    data = {
      total_amount: totalPrice,
      order_num: randomOrderNumber,
      ...res,
    };

    fetch("http://localhost:3000/request_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        window.location.assign(data.redirectLink);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
