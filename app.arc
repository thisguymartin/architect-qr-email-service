@app
architect-qr-email-service

@http
post /record-creation ## http endpoint that will listen for our rest call

@queues
record-handler ## handle message that is publish by record-creation endpoint and saves it
notification-handler ## triggers email notification

## configuration to create a dynamo db 
@tables 
records
  email *String
  name **String


@macros 
add-policies ## modify your cloudformation during build timeto add SES policy permission