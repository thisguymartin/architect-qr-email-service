let QRCode = require('qrcode')
let AWS = require('aws-sdk');

exports.handler = async function queue(event) {
  try {
    console.info('incoming message to queue notification-handler', event)
    const AwsSes = new AWS.SES({ apiVersion: '2010-12-01' })

    // handle incoming event, which could come in as a array
    await Promise.all(event.Records.map(async record => {

      //save a record for each one and publish new event
      const parsedBody = JSON.parse(record.body)
      const qrcodeString = `https://twitter.com/${parsedBody.twitter}`

      const base64qr = await new Promise((resolve, _reject) => {
        QRCode.toString(qrcodeString, { type: 'terminal' },
          function (err, QRcode) {
            if (err) return console.error("error occurred")
            // Printing the generated code for your debugging purposes
            console.info(QRcode)
          })

        QRCode.toDataURL(qrcodeString, function (err, code) {
          if (err) return console.error("error occurred")
          resolve(code)
        })
      })


      const sendPromise = await AwsSes.sendEmail({
        Destination: {
          ToAddresses: [
            parsedBody.email,
          ]
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<img src="${base64qr}" alt=${parsedBody.twitter} />`
            },
            Text: {
              Charset: "UTF-8",
              Data: qrcodeString
            }
          },
          Subject: {
            Data: 'Architect QR Email Service ' + parsedBody.twitter
          }
        },
        Source: parsedBody.email,
      }).promise();

      console.info("Email Sent", sendPromise)
    }))


  } catch (error) {
    console.error('Failed to handle notification message', error)
    throw new Error('Failed to handle notification message')
  }


}