var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic QUMwYjFlY2JlYWJkYTg0MTBlY2Q0Mzk1Mjk1YzBlZjg0ZDoxMDk4ZWI1ZjdkNjk5NTdhMTUxZTY3M2FlNjlmM2Q4Yw==");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("To", "+1234-238-8689");
urlencoded.append("From", "+12342782818");
urlencoded.append("MessagingServiceSid", "MG37b5930f609871e347b227cb532c05aa");
urlencoded.append("Body", "This message is from d365 and Otp is:");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://api.twilio.com/2010-04-01/Accounts/AC0b1ecbeabda8410ecd4395295c0ef84d/Messages.json", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));