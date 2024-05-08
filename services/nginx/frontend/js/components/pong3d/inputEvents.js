import { core } from './config.js'

export function onKeyDown(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "left" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "right" }))
      break;
  }
}

export function onKeyUp(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
  }
}
