import {world, system, BlockPermutation} from "@minecraft/server";


function launchTNT(block) {
    const direction = block.permutation.getState("minecraft:cardinal_direction");
    const launchDirection = {x: 0, y: 0, z: 0};
    switch (direction) {
        case "south":
            launchDirection.z = 1;
            break;
        case "north":
            launchDirection.z = -1;
            break;
        case "west":
            launchDirection.x = -1;
            break;
        case "east":
            launchDirection.x = 1;
            break;
    }
    const tntEntity = block.dimension.spawnEntity("minecraft:tnt", {x: block.location.x, y: block.location.y + 1, z: block.location.z});
    tntEntity.applyImpulse(launchDirection);
    const currentPerm = block.permutation;
    const newPerm = currentPerm.withState("tg:loaded", currentPerm.getState("tg:loaded") - 1);
    block.setPermutation(newPerm);
}

// impossible to deal with redstone, hope some support will be added in the future
// for now, we will just use the player interaction to activate the launcher

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    if (event.isFirstEvent) {
        if (event.block.typeId === "tg:tnt_launcher" && !event.player.isSneaking) {
            event.cancel = true; // Prevent further processing of the event
            if (event.itemStack?.typeId === "minecraft:tnt") {
                let amount = event.itemStack.amount;
                const currentLoaded = event.block.permutation.getState("tg:loaded")
                if (amount >= 1 && currentLoaded < 15) {
                    const currentPerm = event.block.permutation;
                    const newPerm = currentPerm.withState("tg:loaded", currentLoaded + 1);
                    event.player.sendMessage(`§6Loading TNT: ${currentLoaded + 1}`);
                    system.run(() => {
                        event.block.setPermutation(newPerm);
                    });
                }
            }
            
        } else {
            if (event.block.typeId === "tg:tnt_launcher") {
                event.cancel = true; // Prevent further processing of the event
                if (event.block.permutation.getState("tg:loaded") < 1) {
                    event.player.sendMessage("§6No TNT loaded in the launcher.");
                    return;
                }
                const currentPerm = event.block.permutation;
                const newPerm = currentPerm.withState("tg:active", !currentPerm.getState("tg:active"));
                system.run(() => {
                    event.block.setPermutation(newPerm);
                    event.player.sendMessage(`§6TNT Launcher is now ${newPerm.getState("tg:active") ? "active" : "inactive"}`);
                    if (newPerm.getState("tg:active")) {
                        launchTNT(event.block);
                        // event.player.sendMessage(`${newPerm.getState("minecraft:cardinal_direction")}`);
                    }
                });

            }
        }
    }
});
