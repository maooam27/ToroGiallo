import {world, system, BlockPermutation} from "@minecraft/server";

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    if (event.isFirstEvent) {
        if (event.block.typeId === "tg:tnt_launcher" && !event.player.isSneaking) {
            if (event.itemStack?.typeId === "minecraft:tnt") {
                let amount = event.itemStack.amount;
                const currentLoaded = event.block.permutation.getState("tg:loaded")
                if (amount >= 1 && currentLoaded < 15) {
                    
                    const currentPerm = event.block.permutation;
                    const newPerm = currentPerm.withState("tg:loaded", currentLoaded + 1);
                    world.sendMessage(`Loading TNT: ${currentLoaded + 1}`);
                    system.run(() => {
                        event.block.setPermutation(newPerm);
                    });
                }
            }
            world.sendMessage(event.block.permutation.getState("tg:loaded").toString());
            event.cancel = true; // Prevent further processing of the event
        } else {
            if (event.block.typeId === "tg:tnt_launcher") {
                const currentPerm = event.block.permutation;
                const newPerm = currentPerm.withState("tg:active", !currentPerm.getState("tg:active"));
                system.run(() => {
                    event.block.setPermutation(newPerm);
                    world.sendMessage(`TNT Launcher is now ${newPerm.getState("tg:active") ? "active" : "inactive"}`);
                    if (newPerm.getState("tg:active")) {
                        //launchTNT(event.block);
                        world.sendMessage(`${newPerm.getState("minecraft:cardinal_direction")}`);
                    }
                });

            }
        }
    }
});
