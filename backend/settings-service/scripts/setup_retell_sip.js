const twilio = require('twilio');
const axios = require('axios');

// ==========================================================
// CONFIGURATION - FILL THESE IN
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'PLACEHOLDER_TWILIO_ACCOUNT_SID';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'PLACEHOLDER_TWILIO_AUTH_TOKEN';
const RETELL_API_KEY = process.env.RETELL_API_KEY || 'PLACEHOLDER_RETELL_API_KEY';
const PHONE_NUMBER = '+16814122964';
const TRUNK_NAME = 'SAI';
const TERMINATION_DOMAIN = 'sai-hims'; // Script will automatically append .pstn.twilio.com if needed
// ==========================================================

async function setupSipTrunk() {
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    console.log('--- Step 1: Updating Twilio SIP Trunk ---');
    
    // 1. Find the existing trunk (SAI)
    const trunks = await client.trunking.v1.trunks.list();
    const trunk = trunks.find(t => t.friendlyName === TRUNK_NAME);
    
    if (!trunk) {
      throw new Error(`Could not find Twilio Trunk named "${TRUNK_NAME}". Please create it first.`);
    }

    const trunkSid = trunk.sid;
    console.log(`Found Trunk: ${TRUNK_NAME} (${trunkSid})`);

    // 2. Set Termination URI (this is a property of the Trunk)
    console.log('Setting Termination URI...');
    const fullDomain = TERMINATION_DOMAIN.endsWith('.pstn.twilio.com') 
      ? TERMINATION_DOMAIN 
      : `${TERMINATION_DOMAIN}.pstn.twilio.com`;
      
    await client.trunking.v1.trunks(trunkSid)
      .update({ domainName: fullDomain });
    console.log(`Termination URI set: ${fullDomain}`);

    // 3. Set Origination URL
    console.log('Setting Origination URL...');
    await client.trunking.v1.trunks(trunkSid)
      .originationUrls
      .create({
        enabled: true,
        friendlyName: 'Retell-AI',
        priority: 10,
        weight: 10,
        sipUrl: 'sip:sip.retellai.com'
      });
    console.log('Origination URL set to Retell AI.');

    // 4. Attach Number
    console.log(`Attaching ${PHONE_NUMBER} to Trunk...`);
    await client.trunking.v1.trunks(trunkSid)
      .phoneNumbers
      .create({ phoneNumberSid: await getNumberSid(client, PHONE_NUMBER) });
    console.log('Number attached successfully.');

    console.log('\n--- Step 2: Registering with Retell AI ---');
    const AGENT_ID = 'agent_52116b2bca1c7a204d55acb283';
    
    // New weighted agent structure required by Retell API
    const agentPayload = {
      outbound_agents: [{ agent_id: AGENT_ID, weight: 1 }]
    };

    try {
      console.log(`Importing ${PHONE_NUMBER} into Retell AI...`);
      await axios.post(
        'https://api.retellai.com/import-phone-number',
        {
          phone_number: PHONE_NUMBER,
          termination_uri: `${TERMINATION_DOMAIN}.pstn.twilio.com`,
          nickname: 'Canada Trial Lead',
          ...agentPayload
        },
        {
          headers: {
            Authorization: `Bearer ${RETELL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Number Imported Successfully into Retell!');
    } catch (error) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
        console.log('Number already exists. Updating agent assignment...');
        // Correct path is /update-phone-number/
        await axios.patch(
          `https://api.retellai.com/update-phone-number/${PHONE_NUMBER}`,
          agentPayload,
          {
            headers: {
              Authorization: `Bearer ${RETELL_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Agent assignment updated.');
      } else {
        console.warn('Import/Update Failed:', error.response?.data || error.message);
      }
    }

    console.log('\n--- Next Steps ---');
    console.log('Confirm these values in Retell Dashboard if needed:');
    console.log(`- Connection Type: SIP Trunking`);
    console.log(`- Phone Number: ${PHONE_NUMBER}`);
    console.log(`- Termination URI: ${TERMINATION_DOMAIN}.pstn.twilio.com`);

  } catch (err) {
    console.error('Error during setup:', err.message);
  }
}

async function getNumberSid(client, number) {
  const numbers = await client.incomingPhoneNumbers.list({ phoneNumber: number });
  if (numbers.length === 0) throw new Error(`Number ${number} not found in your Twilio account.`);
  return numbers[0].sid;
}

async function testCall() {
  console.log('\n--- Step 3: Testing Direct Call via Retell AI ---');
  try {
    const response = await axios.post(
      'https://api.retellai.com/v2/create-phone-call',
      {
        from_number: PHONE_NUMBER,
        to_number: '+918500089203', // Your personal number
        agent_id: 'agent_52116b2bca1c7a204d55acb283',
      },
      {
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Call Initiated Successfully!', response.data);
  } catch (error) {
    console.error('Test Call Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

async function runAll() {
  await setupSipTrunk();
  await testCall();
}

runAll();
