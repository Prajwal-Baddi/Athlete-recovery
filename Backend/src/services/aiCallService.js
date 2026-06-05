const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const startCall = async (phoneNumber) => {
  return client.calls.create({
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    url: `${process.env.PUBLIC_URL}/api/v1/ai-calls/welcome`,
  });
};

module.exports = {
  startCall,
};