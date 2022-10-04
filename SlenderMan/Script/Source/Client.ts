///<reference path="../../../../FUDGE/Net/Build/Client/FudgeClient.d.ts"/>
namespace Script {
  import ƒ = FudgeCore;
  import ƒClient = FudgeNet.FudgeClient;
  ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);

  // Create a FudgeClient for this browser tab
  let client: ƒClient = new ƒClient();

  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {
    connectToServer(_event);
    sendMessage();
  }

  async function connectToServer(_event: Event): Promise<void> {
    let domServer: HTMLInputElement = document.forms[0].querySelector("input[name=server");
    try {
      // connect to a server with the given url
      client.connectToServer(domServer.value);
      // install an event listener to be called when a message comes in
      client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
    } catch (_error) {
      console.log(_error);
      console.log("Make sure, FudgeServer is running and accessable");
    }
  }

  async function receiveMessage(_event: CustomEvent | MessageEvent | Event): Promise<void> {
    if (_event instanceof MessageEvent) {
      let message: ƒ.Matrix4x4 = JSON.parse(_event.data);
      createOtherPlayers(message);
    }
  }

  export function sendMessage(): void {
    let message: string = JSON.stringify(player.mtxWorld.clone);
    console.log(message);
    // send the message via TCP (route = via server)
    client.dispatch({ route: FudgeNet.ROUTE.VIA_SERVER, content: { text: message } });
  }

  function createOtherPlayers(_position: ƒ.Matrix4x4): void {
    let player: ƒ.Node = new ƒ.Node("player");
    let mesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshCube());
    player.addComponent(mesh);
    player.addComponent(new ƒ.ComponentTransform());
    player.cmpTransform.mtxLocal = _position;
    let players = environment.getChildrenByName("Players")[0];
    players.addChild(player);
  }
}