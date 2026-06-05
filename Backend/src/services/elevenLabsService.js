const axios = require('axios');

const getAIResponse = async (message) => {
  try {
    console.log(
      'Sending to ElevenLabs:',
      message
    );

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/convai/agents/${process.env.ELEVENLABS_AGENT_ID}/chat`,
      {
        message,
      },
      {
        headers: {
          'xi-api-key':
            process.env.ELEVENLABS_API_KEY,
          'Content-Type':
            'application/json',
        },
      }
    );

    console.log(
      'ELEVENLABS RESPONSE:',
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    return (
      response.data?.message ||
      response.data?.response ||
      'Tell me more about that.'
    );
  } catch (error) {
    console.error(
      'ELEVENLABS ERROR:',
      error.response?.data ||
        error.message
    );

    return 'I am having trouble understanding right now.';
  }
};

module.exports = {
  getAIResponse,
};