
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  const body = arc.http.helpers.bodyParser(req)

  if (!body || !body.email || !body.name || !body.twitter) {
    console.error(body, 'Missing user email, name, twitter handle')
    return {
      statusCode: 400,
      body: 'Missing user email and or name'
    }
  }


  await arc.queues.publish({
    name: 'record-handler',
    payload: { ...body },
  })

  console.info('message published to record-handler')

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json;'
    },
    body: JSON.stringify({
      message: `User Data Received`
    })
  }
}