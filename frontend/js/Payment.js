if (
  location.pathname.toString().includes("/payment_success.html") ||
  location.pathname.toString().includes("/payment_failed.html")
) {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const param = urlParams.get("cko-session-id")
    ? urlParams.get("cko-session-id")
    : "";

  const checkPayment = (param) => {
    fetch(`http://localhost:3000/payments/${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Success:", data);
        localStorage.setItem("paymentDetails", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setTimeout(() => {
          window.location.assign(
            "https://checkout-test3ds.netlify.app/pages/payment_details.html"
          );
        }, 2000);
      });
  };

  checkPayment(param);
} else if (location.pathname.toString().includes("payment_details.html")) {
  //   if (paymentDetails ? console.log(paymentDetails) : "");

  const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));

  console.log(paymentDetails);

  const { id, amount, currency, source, requested_on, status, approved } =
    paymentDetails;
  const { card_type, last4, scheme } = source;

  const className = approved ? "green" : "red";

  const _payID = document.querySelector("#pay_id");
  const _amount = document.querySelector("#amount");
  const _currency = document.querySelector("#currency");
  const _schema = document.querySelector("#schema");
  const _cardType = document.querySelector("#card_type");
  const _cardNumber = document.querySelector("#card_number");
  const _date = document.querySelector("#date");
  const _status = document.querySelector("#status");
  const _approved = document.querySelector("#approved");

  _payID.textContent = id;
  _amount.textContent = amount;
  _currency.textContent = currency;
  _schema.textContent = scheme;
  _cardType.textContent = card_type;
  _cardNumber.textContent = `xxxxxx${last4}`;
  _date.textContent = requested_on;
  _status.textContent = status;
  _approved.textContent = approved;

  _approved.classList.add(className);

  document.querySelector("#home").addEventListener("click", (e) => {
    // setTimeout(() => {
    window.location.assign("/");
    // }, 3000);
  });
}
