namespace PinguRun {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    window.addEventListener("load", init);
    export let canvas: HTMLCanvasElement;

    // show dialog for startup, user interaction required e.g. for starting audio
    function init(_event: Event): void {
        let dialog: HTMLDialogElement = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event: Event): void {
            dialog.close();
            let graphId: string = "Graph|2023-02-14T21:16:31.377Z|24123";
            startInteractiveViewport(graphId);
        });
        dialog.showModal();
    } //init

    // setup and start interactive viewport
    async function startInteractiveViewport(_graphId: string): Promise<void> {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);

        // get the graph to show from loaded resources
        let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[_graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }

        // setup the viewport
        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        canvas = document.querySelector("canvas");
        let viewport: ƒ.Viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // make the camera interactive (complex method in FudgeAid)
        let cameraOrbit: ƒ.Node = ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);

        // hide the cursor when interacting, also suppressing right-click menu
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function (): void { document.exitPointerLock(); });

        // setup audio
        ƒ.AudioManager.default.listenTo(graph);

        // draw viewport once for immediate feedback
        ƒ.Render.prepare(cameraOrbit);
        viewport.draw();

        // dispatch event to signal startup done
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    } //startInteractiveViewport
}

