const twilio = require('twilio');

const {
  startCall,
} = require('../services/aiCallService');

const {
  getAIResponse,
} = require('../services/geminiService');

/**
 * POST /api/v1/ai-calls/start
 */
exports.startCall = async (
  req,
  res,
  next
) => {
  try {
    const { phoneNumber } =
      req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          'phoneNumber is required',
      });
    }

    const call =
      await startCall(phoneNumber);

    res.status(200).json({
      success: true,
      callSid: call.sid,
      status: call.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initial greeting
 */
exports.welcome = async (
  req,
  res
) => {
  const VoiceResponse =
    twilio.twiml.VoiceResponse;

  const twiml =
    new VoiceResponse();

  const gather =
    twiml.gather({
      input: ['speech'],
      speechTimeout: 'auto',
      action:
        `${process.env.PUBLIC_URL}/api/v1/ai-calls/process`,
      method: 'POST',
    });

  gather.say(
    'Hello. This is Apex Recovery AI. How are you feeling today?'
  );

  res.type('text/xml');
  res.send(
    twiml.toString()
  );
};

/**
 * Conversation loop
 */
exports.processSpeech =
  async (req, res) => {
    const VoiceResponse =
      twilio.twiml.VoiceResponse;

    const twiml =
      new VoiceResponse();

    const speech =
      req.body.SpeechResult ||
      '';

    console.log(
      'ATHLETE SAID:',
      speech
    );

    let aiResponse =
      'Could you tell me more about that?';

    try {
      aiResponse =
        await getAIResponse(
          speech
        );

      console.log(
        'AI RESPONSE:',
        aiResponse
      );
    } catch (error) {
      console.error(
        'AI ERROR:',
        error.message
      );
    }

    const gather =
      twiml.gather({
        input: ['speech'],
        speechTimeout: 'auto',
        action:
          `${process.env.PUBLIC_URL}/api/v1/ai-calls/process`,
        method: 'POST',
      });

    gather.say(aiResponse);

    res.type('text/xml');
    res.send(
      twiml.toString()
    );
  };