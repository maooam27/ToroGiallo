import shutil
from subprocess import run

shutil.copytree('ToroGiallo_RP', 'C:/Users/mfede/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/ToroGiallo_RP', dirs_exist_ok=True)  
shutil.copytree('ToroGiallo_BP', 'C:/Users/mfede/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/ToroGiallo_BP', dirs_exist_ok=True)

run(["start", "", "C:/Users/mfede/OneDrive/Desktop/MinecraftB.lnk"], shell=True)