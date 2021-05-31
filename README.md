## Installation

```bash
$ npm install
$ GO111MODULE=on go get github.com/nats-io/nats-server/v2
```

## Running the app

```bash
$ cd go/bin directory && nats-server
$ npm run start
```

## Ports

Nats should listen on :4222 port.  
API listens on :4200 port.

## Usage
Open localhost:4200 in browser.

First button - Get response from First Microservice and print it.  
Second button - Receive event in First Microservice and log it.  
Third button - Pass message from First Microservice to Second one and print its response.  
Fourth button - Receive event passed from First Microservice to Second one and print it.  