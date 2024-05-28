import { core } from './config.js'

export function onKeyDownRemote(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "left" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "right" }))
      break;
  }
}

export function onKeyUpRemote(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
  }
}

export function onKeyDownLocal(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov1': "left" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov1': "right" }))
      break;
    case 37:
      core.gameSocket.send(JSON.stringify({ 'paddleMov2': "left" }))
      break;
    case 39:
      core.gameSocket.send(JSON.stringify({ 'paddleMov2': "right" }))
      break;
  }
}

export function onKeyUpLocal(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov1': "false" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov1': "false" }))
      break;
    case 37:
      core.gameSocket.send(JSON.stringify({ 'paddleMov2': "false" }))
      break;
    case 39:
      core.gameSocket.send(JSON.stringify({ 'paddleMov2': "false" }))
      break;

  }
}


