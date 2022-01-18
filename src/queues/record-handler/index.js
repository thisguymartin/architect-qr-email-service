let arc = require('@architect/functions')

exports.handler = async function queue(event) {
  console.info('incoming message to queue record-handler', event)

  let client = await arc.tables()
  // handle incoming event, which could come in as a array
  await Promise.all(event.Records.map(async record => {
    //save a record for each one and publish new event

    const parsedBody = JSON.parse(record.body)
    const body = { ...parsedBody, id: Math.random() }

    await client.records.put(body)

    await arc.queues.publish({
      name: 'notification-handler',
      payload: body,
    })
  }))

}