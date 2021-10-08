import { Builder } from "flatbuffers";
import * as fs from "fs";
import { Color } from "./flatbuffers/my-game/sample/color";
import { Equipment } from "./flatbuffers/my-game/sample/equipment";
import { Monster } from "./flatbuffers/my-game/sample/monster";
import { Vec3 } from "./flatbuffers/my-game/sample/vec3";
import { Weapon } from "./flatbuffers/my-game/sample/weapon";

// Create a `flatbuffer.Builder`, which will be used to create our
// monsters' FlatBuffers.
var builder = new Builder(1024);
var weaponOne = builder.createString("Sword");
var weaponTwo = builder.createString("Axe");

// Create the first `Weapon` ('Sword').
Weapon.startWeapon(builder);
Weapon.addName(builder, weaponOne);
Weapon.addDamage(builder, 3);
var sword = Weapon.endWeapon(builder);

// Create the second `Weapon` ('Axe').
Weapon.startWeapon(builder);
Weapon.addName(builder, weaponTwo);
Weapon.addDamage(builder, 5);
var axe = Weapon.endWeapon(builder);

// Serialize a name for our monster, called 'Orc'.
var name = builder.createString("Orc");

// Create a `vector` representing the inventory of the Orc. Each number
// could correspond to an item that can be claimed after he is slain.
var treasure = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var inv = Monster.createInventoryVector(builder, treasure);

// Create an array from the two `Weapon`s and pass it to the
// `createWeaponsVector()` method to create a FlatBuffer vector.
var weaps = [sword, axe];
var weapons = Monster.createWeaponsVector(builder, weaps);

Monster.startPathVector(builder, 2);
Vec3.createVec3(builder, 1.0, 2.0, 3.0);
Vec3.createVec3(builder, 4.0, 5.0, 6.0);
var path = builder.endVector();

// Create our monster by using `startMonster()` and `endMonster()`.
Monster.startMonster(builder);
Monster.addPos(builder, Vec3.createVec3(builder, 1.0, 2.0, 3.0));
Monster.addHp(builder, 300);
Monster.addColor(builder, Color.Red);
Monster.addName(builder, name);
Monster.addInventory(builder, inv);
Monster.addWeapons(builder, weapons);
Monster.addEquippedType(builder, Equipment.Weapon);
Monster.addEquipped(builder, axe);
Monster.addPath(builder, path);
var orc = Monster.endMonster(builder);

// Call `finish()` to instruct the builder that this monster is complete.
builder.finish(orc); // You could also call `MyGame.Sample.Monster.finishMonsterBuffer(builder, orc);`.
// This must be called after `finish()`.
var buf = builder.asUint8Array(); // Of type `Uint8Array`.
fs.writeFileSync("monster.bin", buf, "binary");