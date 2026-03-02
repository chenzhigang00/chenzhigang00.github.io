const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const overlayEyebrow = document.getElementById("overlayEyebrow");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");

const healthValue = document.getElementById("healthValue");
const emeraldValue = document.getElementById("emeraldValue");
const waveValue = document.getElementById("waveValue");
const potionValue = document.getElementById("potionValue");
const chapterValue = document.getElementById("chapterValue");
const heroValue = document.getElementById("heroValue");
const chapterButtons = Array.from(document.querySelectorAll(".chapter-button"));
const heroButtons = Array.from(document.querySelectorAll(".hero-button"));
const loadoutHeroName = document.getElementById("loadoutHeroName");
const loadoutHeroBlurb = document.getElementById("loadoutHeroBlurb");
const powerValue = document.getElementById("powerValue");
const meleeValue = document.getElementById("meleeValue");
const speedValue = document.getElementById("speedValue");
const inventoryCount = document.getElementById("inventoryCount");
const inventoryGrid = document.getElementById("inventoryGrid");
const detailRarity = document.getElementById("detailRarity");
const detailName = document.getElementById("detailName");
const detailPower = document.getElementById("detailPower");
const detailStats = document.getElementById("detailStats");
const detailDescription = document.getElementById("detailDescription");
const equipButton = document.getElementById("equipButton");
const salvageButton = document.getElementById("salvageButton");
const slotButtons = {
  melee: document.getElementById("slotMelee"),
  armor: document.getElementById("slotArmor"),
  ranged: document.getElementById("slotRanged"),
  artifact1: document.getElementById("slotArtifact1"),
  artifact2: document.getElementById("slotArtifact2"),
  artifact3: document.getElementById("slotArtifact3"),
};

const TILE = 40;
const GRID_W = 24;
const GRID_H = 15;
const WORLD_W = TILE * GRID_W;
const WORLD_H = TILE * GRID_H;

const keys = new Set();
const rand = (min, max) => Math.random() * (max - min) + min;

const HEROES = {
  knight: {
    label: "Knight",
    blurb: "Shield-forward frontline",
    maxHealth: 120,
    speed: 210,
    attackDamage: 28,
    potionHeal: 35,
    dashCooldownDuration: 1.4,
    body: "#d9dde3",
    hood: "#9aa4af",
    coat: "#c23f2f",
    accent: "#6e7884",
    aura: "rgba(225, 231, 239, 0.18)",
    weapon: "#f0f4f8"
  },
  adventurer: {
    label: "Adventurer",
    blurb: "Balanced dungeon runner",
    maxHealth: 100,
    speed: 230,
    attackDamage: 24,
    potionHeal: 35,
    dashCooldownDuration: 1.4,
    body: "#f0c28d",
    hood: "#2d5f9b",
    coat: "#6f4b36",
    accent: "#2d5f9b",
    aura: "rgba(124, 176, 255, 0.18)",
    weapon: "#f7f1db"
  },
  ranger: {
    label: "Ranger",
    blurb: "Swift striker",
    maxHealth: 92,
    speed: 242,
    attackDamage: 22,
    potionHeal: 35,
    dashCooldownDuration: 1.25,
    body: "#f3c088",
    hood: "#3b7c42",
    coat: "#5d4a31",
    accent: "#8dce57",
    aura: "rgba(141, 206, 87, 0.2)",
    weapon: "#d8ff8a"
  },
  cleric: {
    label: "Cleric",
    blurb: "Light support",
    maxHealth: 104,
    speed: 220,
    attackDamage: 22,
    potionHeal: 50,
    dashCooldownDuration: 1.4,
    body: "#e9d39f",
    hood: "#ffffff",
    coat: "#d8aa3a",
    accent: "#f3efcf",
    aura: "rgba(255, 245, 194, 0.22)",
    weapon: "#fff5b1"
  },
  rogue: {
    label: "Rogue",
    blurb: "Fastest roll",
    maxHealth: 88,
    speed: 255,
    attackDamage: 21,
    potionHeal: 32,
    dashCooldownDuration: 0.95,
    body: "#e3b08d",
    hood: "#2b2b36",
    coat: "#7e2949",
    accent: "#c95378",
    aura: "rgba(216, 88, 126, 0.18)",
    weapon: "#ffe1ea"
  },
  mage: {
    label: "Mage",
    blurb: "Arcane melee",
    maxHealth: 94,
    speed: 224,
    attackDamage: 26,
    potionHeal: 34,
    dashCooldownDuration: 1.3,
    body: "#f1cda0",
    hood: "#3d4da3",
    coat: "#b3422f",
    accent: "#69c7ff",
    aura: "rgba(105, 199, 255, 0.2)",
    weapon: "#8be1ff"
  }
};

const ITEM_LIBRARY = [
  {
    id: "sword-diamond",
    slot: "melee",
    rarity: "Common",
    name: "Diamond Sword",
    power: 48,
    icon: "SW",
    description: "Reliable blade work with a clean arc and no gimmicks.",
    stats: ["+10 melee damage", "+0.04 attack speed"],
    modifiers: { attackDamage: 10, attackCooldownMult: 0.94 }
  },
  {
    id: "maulers",
    slot: "melee",
    rarity: "Unique",
    name: "Maulers",
    power: 107,
    icon: "CL",
    description: "Claw-like weapons that ramp up the pace of every combo.",
    stats: ["+18 melee damage", "+0.10 attack speed"],
    modifiers: { attackDamage: 18, attackCooldownMult: 0.82 }
  },
  {
    id: "firebolt",
    slot: "ranged",
    rarity: "Unique",
    name: "Firebolt Thrower",
    power: 101,
    icon: "FB",
    description: "Explosive shots that increase your pressure from range.",
    stats: ["+8 ranged pressure", "+6 melee damage"],
    modifiers: { projectileDamage: 8, attackDamage: 6 }
  },
  {
    id: "soul-bow",
    slot: "ranged",
    rarity: "Rare",
    name: "Soul Bow",
    power: 94,
    icon: "SB",
    description: "Drawn from the crypt, it feeds a steadier stream of soul energy.",
    stats: ["+4 ranged pressure", "-8% potion cooldown"],
    modifiers: { projectileDamage: 4, potionCooldownMult: 0.92 }
  },
  {
    id: "champion-armor",
    slot: "armor",
    rarity: "Rare",
    name: "Champion's Armor",
    power: 107,
    icon: "AR",
    description: "Heavy protection with damage reduction and faster potion recovery.",
    stats: ["+36 max health", "20% damage reduction", "-20% potion cooldown"],
    modifiers: { maxHealth: 36, damageTakenMult: 0.8, potionCooldownMult: 0.8 }
  },
  {
    id: "grim-armor",
    slot: "armor",
    rarity: "Common",
    name: "Grim Armor",
    power: 35,
    icon: "GR",
    description: "Soul-soaked armor that grants extra health and a lifesteal aura.",
    stats: ["+24 max health", "+3 life on melee hit"],
    modifiers: { maxHealth: 24, lifeSteal: 3 }
  },
  {
    id: "evocation-robe",
    slot: "armor",
    rarity: "Common",
    name: "Evocation Robe",
    power: 10,
    icon: "ER",
    description: "Runed cloth that speeds movement and item flow.",
    stats: ["+18 speed", "-18% potion cooldown"],
    modifiers: { speed: 18, potionCooldownMult: 0.82 }
  },
  {
    id: "corrupted-beacon",
    slot: "artifact",
    rarity: "Common",
    name: "Corrupted Beacon",
    power: 73,
    icon: "CB",
    description: "A soul-fed beam condensed into a compact relic.",
    stats: ["+10 ranged pressure", "+4 melee damage"],
    modifiers: { projectileDamage: 10, attackDamage: 4 }
  },
  {
    id: "death-cap",
    slot: "artifact",
    rarity: "Rare",
    name: "Death Cap Mushroom",
    power: 106,
    icon: "DM",
    description: "Frenzied magic that speeds your attacks and movement.",
    stats: ["+12 speed", "+0.08 attack speed"],
    modifiers: { speed: 12, attackCooldownMult: 0.88 }
  },
  {
    id: "iron-golem",
    slot: "artifact",
    rarity: "Unique",
    name: "Golem Kit",
    power: 177,
    icon: "GK",
    description: "Summons protection in spirit, reinforcing your armor in battle.",
    stats: ["+18 max health", "15% damage reduction"],
    modifiers: { maxHealth: 18, damageTakenMult: 0.85 }
  },
  {
    id: "boots",
    slot: "artifact",
    rarity: "Rare",
    name: "Boots of Swiftness",
    power: 78,
    icon: "BT",
    description: "Sprint magic bottled into a compact relic.",
    stats: ["+22 speed", "-20% roll cooldown"],
    modifiers: { speed: 22, dashCooldownMult: 0.8 }
  },
  {
    id: "totem",
    slot: "artifact",
    rarity: "Rare",
    name: "Totem of Shielding",
    power: 95,
    icon: "TS",
    description: "A stable ward that reinforces your position.",
    stats: ["+10 max health", "10% damage reduction"],
    modifiers: { maxHealth: 10, damageTakenMult: 0.9 }
  }
];

const LOADOUT_DEFAULTS = {
  melee: "sword-diamond",
  armor: "champion-armor",
  ranged: "firebolt",
  artifact1: "corrupted-beacon",
  artifact2: "death-cap",
  artifact3: "iron-golem",
};

const THEMES = {
  jungle: {
    label: "Jungle",
    eyebrow: "Expedition ready",
    title: "Enter the jungle",
    text: "Cut through vine-twisted mobs, avoid poison shots, then cross the jungle gateway.",
    bodyTop: "#6f8f56",
    bodyBottom: "#18331f",
    bgGlow: "rgba(192, 255, 170, 0.18)",
    floorA: "#70583a",
    floorB: "#5f4e34",
    floorGlow: "rgba(118, 204, 95, 0.05)",
    wallA: "#5b6940",
    wallB: "#7f8754",
    wallEdge: "#394428",
    torchGlow: "rgba(140, 225, 91, 0.18)",
    torchBase: "#5b9b40",
    torchFlame: "#f6ed8f",
    portalOuter: "rgba(121, 215, 91, 0.18)",
    portalMid: "#67c84d",
    portalInner: "#ecffd5",
    playerGlow: "rgba(150, 216, 108, 0.18)",
    playerTint: "#96d86c",
    coat: "#806843",
    accent: "#6d9f42",
    meleeTint: "#6aa14d",
    rangedTint: "#8f4fd4",
    bruteTint: "#867a3a",
    rangedDetail: "#b55cf6",
    bruteDetail: "#d6c355",
    projectileOuter: "#7e43d9",
    projectileInner: "#a5ff75",
    projectileBurst: "#72d94c",
    potionBurst: "#80ff90",
    deathTitle: "The jungle swallowed you",
    deathText: "Use the pillars to break poison lines and save your potion for the big hits.",
    gatewayText: "Gateway open: cross into the next jungle clearing."
  },
  depths: {
    label: "Depths",
    eyebrow: "Dive ready",
    title: "Enter the trench",
    text: "Push through drowned mobs, dodge coral bolts, and surface through the abyssal gate.",
    bodyTop: "#2f94c6",
    bodyBottom: "#0b2740",
    bgGlow: "rgba(151, 236, 255, 0.2)",
    floorA: "#1f6a88",
    floorB: "#17556b",
    floorGlow: "rgba(85, 205, 255, 0.06)",
    wallA: "#28718a",
    wallB: "#3d8fa0",
    wallEdge: "#133849",
    torchGlow: "rgba(82, 210, 255, 0.22)",
    torchBase: "#3eb7d3",
    torchFlame: "#d7ffff",
    portalOuter: "rgba(92, 215, 255, 0.18)",
    portalMid: "#30b9e8",
    portalInner: "#dffcff",
    playerGlow: "rgba(99, 212, 255, 0.18)",
    playerTint: "#6fdcff",
    coat: "#25627f",
    accent: "#1cb8ae",
    meleeTint: "#48a4a0",
    rangedTint: "#7ed0ff",
    bruteTint: "#2d7d92",
    rangedDetail: "#9ff2ff",
    bruteDetail: "#8ff1c5",
    projectileOuter: "#2cc6ff",
    projectileInner: "#dffcff",
    projectileBurst: "#58e6ff",
    potionBurst: "#7cf1ff",
    deathTitle: "The depths dragged you under",
    deathText: "Keep moving through open water lanes and use the potion before ranged pressure stacks.",
    gatewayText: "Gateway open: dive into the next flooded chamber."
  },
  peaks: {
    label: "Peaks",
    eyebrow: "Summit ready",
    title: "Climb the peaks",
    text: "Drive back icy raiders, dodge frost shots, and sprint into the mountain pass.",
    bodyTop: "#d7edf7",
    bodyBottom: "#7aa3ba",
    bgGlow: "rgba(255, 255, 255, 0.24)",
    floorA: "#b28e6a",
    floorB: "#9a7b5d",
    floorGlow: "rgba(235, 248, 255, 0.05)",
    wallA: "#a5c0d1",
    wallB: "#c7d9e3",
    wallEdge: "#6c8394",
    torchGlow: "rgba(198, 234, 255, 0.22)",
    torchBase: "#9ad1f2",
    torchFlame: "#ffffff",
    portalOuter: "rgba(207, 243, 255, 0.22)",
    portalMid: "#a6d9ff",
    portalInner: "#ffffff",
    playerGlow: "rgba(211, 241, 255, 0.22)",
    playerTint: "#e1f0ff",
    coat: "#9e4937",
    accent: "#26a36b",
    meleeTint: "#5aa06f",
    rangedTint: "#8db4e6",
    bruteTint: "#d5eef9",
    rangedDetail: "#f5d05d",
    bruteDetail: "#b6d3ea",
    projectileOuter: "#b3eeff",
    projectileInner: "#ffffff",
    projectileBurst: "#dff8ff",
    potionBurst: "#d4f6ff",
    deathTitle: "The mountain cast you down",
    deathText: "Use space to clear lighter mobs quickly and avoid being pinned in the narrow paths.",
    gatewayText: "Gateway open: ascend into the next icy summit."
  },
  nether: {
    label: "Nether",
    eyebrow: "Incursion ready",
    title: "Enter the Nether",
    text: "Cut through scorched mobs, dodge ember bolts, and charge into the blazing portal.",
    bodyTop: "#7b1f16",
    bodyBottom: "#24090d",
    bgGlow: "rgba(255, 146, 77, 0.18)",
    floorA: "#6f2b1f",
    floorB: "#5c2118",
    floorGlow: "rgba(255, 120, 66, 0.05)",
    wallA: "#813427",
    wallB: "#a94f34",
    wallEdge: "#421310",
    torchGlow: "rgba(255, 132, 61, 0.22)",
    torchBase: "#d95d2d",
    torchFlame: "#ffd17a",
    portalOuter: "rgba(255, 72, 178, 0.2)",
    portalMid: "#ff4bb4",
    portalInner: "#ffd8ff",
    playerGlow: "rgba(255, 127, 68, 0.18)",
    playerTint: "#ff9a56",
    coat: "#39222a",
    accent: "#5ad2ff",
    meleeTint: "#cf6745",
    rangedTint: "#ff9d6b",
    bruteTint: "#912b22",
    rangedDetail: "#ff4bb4",
    bruteDetail: "#ffb05a",
    projectileOuter: "#ff4bb4",
    projectileInner: "#ffd0f3",
    projectileBurst: "#ff7a54",
    potionBurst: "#ffb572",
    deathTitle: "The Nether burned through you",
    deathText: "Use dodges aggressively and keep distance from the brute pack before they surround you.",
    gatewayText: "Gateway open: step into the next infernal keep."
  },
  void: {
    label: "Void",
    eyebrow: "Breach ready",
    title: "Enter the void",
    text: "Survive Ender packs, avoid void bolts, and break through the breach to the next arena.",
    bodyTop: "#2e194f",
    bodyBottom: "#09050d",
    bgGlow: "rgba(221, 91, 255, 0.12)",
    floorA: "#3f2446",
    floorB: "#34203d",
    floorGlow: "rgba(255, 123, 236, 0.04)",
    wallA: "#493f61",
    wallB: "#74678b",
    wallEdge: "#261e35",
    torchGlow: "rgba(221, 91, 255, 0.18)",
    torchBase: "#b97cff",
    torchFlame: "#ffd56f",
    portalOuter: "rgba(102, 166, 255, 0.16)",
    portalMid: "#5ea7ff",
    portalInner: "#d5f0ff",
    playerGlow: "rgba(167, 125, 255, 0.18)",
    playerTint: "#a77dff",
    coat: "#1d1227",
    accent: "#7f60ff",
    meleeTint: "#6db15f",
    rangedTint: "#dcd7ff",
    bruteTint: "#7b5cff",
    rangedDetail: "#8b5cf6",
    bruteDetail: "#ff9b4a",
    projectileOuter: "#ff7cf4",
    projectileInner: "#fff3ff",
    projectileBurst: "#ff7cf4",
    potionBurst: "#ff6fe6",
    deathTitle: "The void consumed you",
    deathText: "Break line of sight around pillars and save the potion for the ranged volleys.",
    gatewayText: "Gateway open: jump into the next breach."
  }
};

let state = null;
let running = false;
let lastFrame = 0;
let activeTheme = "jungle";
let activeHero = "knight";
let loadout = createLoadout();

function createLoadout() {
  return {
    inventory: ITEM_LIBRARY.map((item) => ({ ...item })),
    equipped: { ...LOADOUT_DEFAULTS },
    selectedId: LOADOUT_DEFAULTS.melee,
  };
}

function getItem(itemId) {
  return loadout.inventory.find((item) => item.id === itemId) || null;
}

function selectedItem() {
  return getItem(loadout.selectedId);
}

function equippedItem(slot) {
  return getItem(loadout.equipped[slot]);
}

function slotDisplayName(slot) {
  return {
    melee: "Melee",
    armor: "Armor",
    ranged: "Ranged",
    artifact1: "Artifact I",
    artifact2: "Artifact II",
    artifact3: "Artifact III",
  }[slot];
}

function computedStats() {
  const hero = heroConfig();
  const gear = Object.values(loadout.equipped)
    .map((itemId) => getItem(itemId))
    .filter(Boolean);

  const stats = {
    maxHealth: hero.maxHealth,
    speed: hero.speed,
    attackDamage: hero.attackDamage,
    potionHeal: hero.potionHeal,
    dashCooldownDuration: hero.dashCooldownDuration,
    attackCooldown: 0.38,
    potionCooldownDuration: 12,
    damageTakenMult: 1,
    lifeSteal: 0,
    projectileDamage: 0,
  };

  for (const item of gear) {
    const mods = item.modifiers || {};
    if (mods.maxHealth) stats.maxHealth += mods.maxHealth;
    if (mods.speed) stats.speed += mods.speed;
    if (mods.attackDamage) stats.attackDamage += mods.attackDamage;
    if (mods.potionHeal) stats.potionHeal += mods.potionHeal;
    if (mods.lifeSteal) stats.lifeSteal += mods.lifeSteal;
    if (mods.projectileDamage) stats.projectileDamage += mods.projectileDamage;
    if (mods.damageTakenMult) stats.damageTakenMult *= mods.damageTakenMult;
    if (mods.attackCooldownMult) stats.attackCooldown *= mods.attackCooldownMult;
    if (mods.potionCooldownMult) stats.potionCooldownDuration *= mods.potionCooldownMult;
    if (mods.dashCooldownMult) stats.dashCooldownDuration *= mods.dashCooldownMult;
  }

  return stats;
}

function makePlayer() {
  const gear = computedStats();
  return {
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    radius: 18,
    speed: gear.speed,
    health: gear.maxHealth,
    maxHealth: gear.maxHealth,
    emeralds: 0,
    facingX: 1,
    facingY: 0,
    attackTimer: 0,
    attackCooldown: 0,
    dashTimer: 0,
    dashCooldown: 0,
    potionCooldown: 0,
    hitFlash: 0,
    attackDamage: gear.attackDamage,
    potionHeal: gear.potionHeal,
    dashCooldownDuration: gear.dashCooldownDuration,
    attackCooldownDuration: gear.attackCooldown,
    potionCooldownDuration: gear.potionCooldownDuration,
    damageTakenMult: gear.damageTakenMult,
    lifeSteal: gear.lifeSteal,
    projectileDamage: gear.projectileDamage,
    heroId: activeHero,
  };
}

function themeConfig() {
  return THEMES[activeTheme];
}

function heroConfig() {
  return HEROES[activeHero];
}

function applyThemeToPage() {
  const theme = themeConfig();
  document.documentElement.style.setProperty("--bg-top", theme.bodyTop);
  document.documentElement.style.setProperty("--bg-bottom", theme.bodyBottom);
  chapterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === activeTheme);
  });
}

function applyHeroToPage() {
  heroButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.hero === activeHero);
  });
}

function createStatLine(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function updateDetailPanel() {
  const item = selectedItem();

  if (!item) {
    detailRarity.textContent = "No item";
    detailRarity.className = "detail-rarity";
    detailName.textContent = "Inventory empty";
    detailPower.textContent = "Power 0";
    detailDescription.textContent = "Equip or salvage actions will appear when gear is available.";
    detailStats.replaceChildren(createStatLine("No bonuses"));
    equipButton.disabled = true;
    salvageButton.disabled = true;
    return;
  }

  detailRarity.textContent = item.rarity;
  detailRarity.className = `detail-rarity rarity-${item.rarity.toLowerCase()}`;
  detailName.textContent = item.name;
  detailPower.textContent = `Power ${item.power}`;
  detailDescription.textContent = item.description;
  detailStats.replaceChildren(...item.stats.map(createStatLine));
  equipButton.disabled = false;
  salvageButton.disabled = false;
}

function renderLoadoutSlots() {
  Object.entries(slotButtons).forEach(([slot, button]) => {
    const item = equippedItem(slot);
    button.classList.toggle("selected", Boolean(item && item.id === loadout.selectedId));
    button.innerHTML = item
      ? `<span class="slot-icon">${item.icon}</span><span class="slot-label">${item.name}</span><span class="slot-type rarity-${item.rarity.toLowerCase()}">${slotDisplayName(slot)} · ${item.power}</span>`
      : `<span class="slot-icon">□</span><span class="slot-label">Empty</span><span class="slot-type">${slotDisplayName(slot)}</span>`;
  });
}

function renderInventory() {
  inventoryGrid.replaceChildren();
  inventoryCount.textContent = `${loadout.inventory.length} items`;

  for (const item of loadout.inventory) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inventory-item";
    if (item.id === loadout.selectedId) button.classList.add("selected");
    if (Object.values(loadout.equipped).includes(item.id)) button.classList.add("equipped");
    button.innerHTML = `<span class="item-icon">${item.icon}</span><span class="item-name">${item.name}</span><span class="item-rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span><span class="item-power">Power ${item.power}</span>`;
    button.addEventListener("click", () => {
      loadout.selectedId = item.id;
      renderLoadout();
    });
    inventoryGrid.appendChild(button);
  }
}

function updateLoadoutSummary() {
  const hero = heroConfig();
  const stats = computedStats();
  const equipped = Object.values(loadout.equipped).map(getItem).filter(Boolean);
  const averagePower = equipped.length
    ? Math.round(equipped.reduce((sum, item) => sum + item.power, 0) / equipped.length)
    : 0;

  loadoutHeroName.textContent = hero.label;
  loadoutHeroBlurb.textContent = hero.blurb;
  powerValue.textContent = averagePower;
  meleeValue.textContent = stats.attackDamage;
  speedValue.textContent = stats.speed;
}

function renderLoadout() {
  updateLoadoutSummary();
  renderLoadoutSlots();
  renderInventory();
  updateDetailPanel();
}

function applyLoadoutToPlayer() {
  if (!state) return;
  const gear = computedStats();
  const player = state.player;
  const healthRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 1;
  player.maxHealth = gear.maxHealth;
  player.health = Math.min(player.maxHealth, Math.max(1, Math.round(player.maxHealth * healthRatio)));
  player.speed = gear.speed;
  player.attackDamage = gear.attackDamage;
  player.potionHeal = gear.potionHeal;
  player.dashCooldownDuration = gear.dashCooldownDuration;
  player.attackCooldownDuration = gear.attackCooldown;
  player.potionCooldownDuration = gear.potionCooldownDuration;
  player.damageTakenMult = gear.damageTakenMult;
  player.lifeSteal = gear.lifeSteal;
  player.projectileDamage = gear.projectileDamage;
  syncHud();
}

function equipSelectedItem() {
  const item = selectedItem();
  if (!item) return;

  if (item.slot === "artifact") {
    const artifactSlot =
      ["artifact1", "artifact2", "artifact3"].find((slot) => loadout.equipped[slot] === item.id) ||
      ["artifact1", "artifact2", "artifact3"].find((slot) => !loadout.equipped[slot]) ||
      "artifact1";
    loadout.equipped[artifactSlot] = item.id;
  } else {
    loadout.equipped[item.slot] = item.id;
  }

  renderLoadout();
  applyLoadoutToPlayer();
}

function salvageSelectedItem() {
  const item = selectedItem();
  if (!item) return;

  Object.keys(loadout.equipped).forEach((slot) => {
    if (loadout.equipped[slot] === item.id) {
      loadout.equipped[slot] = null;
    }
  });

  loadout.inventory = loadout.inventory.filter((entry) => entry.id !== item.id);
  loadout.selectedId = loadout.inventory[0]?.id || null;

  if (state) {
    state.player.emeralds += Math.max(4, Math.round(item.power / 8));
    syncHud();
  }

  renderLoadout();
  applyLoadoutToPlayer();
}

function randomFloorCell() {
  let x = 0;
  let y = 0;

  do {
    x = Math.floor(rand(1, GRID_W - 1));
    y = Math.floor(rand(1, GRID_H - 1));
  } while (state.walls.some((wall) => wall.gx === x && wall.gy === y));

  return {
    x: x * TILE + TILE / 2,
    y: y * TILE + TILE / 2,
  };
}

function spawnWave(level) {
  const theme = themeConfig();
  const enemies = [];
  const count = 5 + level * 2;

  for (let i = 0; i < count; i += 1) {
    const spawn = randomFloorCell();
    const kind = i % 5 === 4 ? "ranged" : i % 4 === 3 ? "brute" : "melee";
    const brute = kind === "brute";
    const ranged = kind === "ranged";
    enemies.push({
      x: spawn.x,
      y: spawn.y,
      radius: brute ? 22 : ranged ? 16 : 17,
      speed: brute ? 78 + level * 7 : ranged ? 72 + level * 5 : 94 + level * 8,
      health: brute ? 60 + level * 18 : ranged ? 22 + level * 8 : 30 + level * 10,
      maxHealth: brute ? 60 + level * 18 : ranged ? 22 + level * 8 : 30 + level * 10,
      damage: brute ? 18 : ranged ? 12 : 10,
      tint: brute ? theme.bruteTint : ranged ? theme.rangedTint : theme.meleeTint,
      hitCooldown: 0,
      shootCooldown: ranged ? rand(0.5, 1.2) : 0,
      knockbackX: 0,
      knockbackY: 0,
      kind,
      brute,
      ranged,
    });
  }

  return enemies;
}

function createWalls() {
  const walls = [];

  for (let x = 0; x < GRID_W; x += 1) {
    walls.push({ gx: x, gy: 0 });
    walls.push({ gx: x, gy: GRID_H - 1 });
  }

  for (let y = 1; y < GRID_H - 1; y += 1) {
    walls.push({ gx: 0, gy: y });
    walls.push({ gx: GRID_W - 1, gy: y });
  }

  const pillars = [
    [5, 4], [6, 4], [17, 4], [18, 4],
    [5, 10], [6, 10], [17, 10], [18, 10],
    [11, 7], [12, 7]
  ];

  for (const [gx, gy] of pillars) {
    walls.push({ gx, gy });
  }

  return walls;
}

function resetGame() {
  state = {
    player: makePlayer(),
    walls: createWalls(),
    enemies: [],
    projectiles: [],
    particles: [],
    loot: [],
    portal: { x: WORLD_W - TILE * 2.5, y: WORLD_H / 2, active: false },
    level: 1,
    screenShake: 0,
    status: "ready",
    theme: activeTheme,
  };

  state.enemies = spawnWave(state.level);
  const theme = themeConfig();
  openOverlay(theme.eyebrow, theme.title, theme.text, "Start Run");
  syncHud();
  renderLoadout();
}

function syncHud() {
  heroValue.textContent = heroConfig().label;
  chapterValue.textContent = themeConfig().label;
  healthValue.textContent = Math.max(0, Math.ceil(state.player.health));
  emeraldValue.textContent = state.player.emeralds;
  waveValue.textContent = state.level;
  potionValue.textContent = state.player.potionCooldown <= 0 ? "Ready" : `${state.player.potionCooldown.toFixed(1)}s`;
}

function openOverlay(eyebrow, title, text, buttonLabel) {
  overlayEyebrow.textContent = eyebrow;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonLabel;
  overlay.classList.remove("hidden");
}

function closeOverlay() {
  overlay.classList.add("hidden");
}

function emitParticles(x, y, color, count, speed = 80) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, Math.PI * 2);
    const size = rand(2, 6);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * rand(speed * 0.4, speed),
      vy: Math.sin(angle) * rand(speed * 0.4, speed),
      life: rand(0.35, 0.8),
      maxLife: 0.8,
      size,
      color,
    });
  }
}

function circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy < radius * radius;
}

function moveEntity(entity, dx, dy) {
  entity.x += dx;

  for (const wall of state.walls) {
    const wx = wall.gx * TILE;
    const wy = wall.gy * TILE;

    if (circleRectCollision(entity.x, entity.y, entity.radius, wx, wy, TILE, TILE)) {
      if (dx > 0) {
        entity.x = wx - entity.radius;
      } else if (dx < 0) {
        entity.x = wx + TILE + entity.radius;
      }
    }
  }

  entity.y += dy;

  for (const wall of state.walls) {
    const wx = wall.gx * TILE;
    const wy = wall.gy * TILE;

    if (circleRectCollision(entity.x, entity.y, entity.radius, wx, wy, TILE, TILE)) {
      if (dy > 0) {
        entity.y = wy - entity.radius;
      } else if (dy < 0) {
        entity.y = wy + TILE + entity.radius;
      }
    }
  }

  entity.x = Math.max(entity.radius, Math.min(WORLD_W - entity.radius, entity.x));
  entity.y = Math.max(entity.radius, Math.min(WORLD_H - entity.radius, entity.y));
}

function handlePlayerInput(dt) {
  const player = state.player;
  const theme = themeConfig();
  let inputX = 0;
  let inputY = 0;

  if (keys.has("arrowleft") || keys.has("a")) inputX -= 1;
  if (keys.has("arrowright") || keys.has("d")) inputX += 1;
  if (keys.has("arrowup") || keys.has("w")) inputY -= 1;
  if (keys.has("arrowdown") || keys.has("s")) inputY += 1;

  const magnitude = Math.hypot(inputX, inputY) || 1;
  inputX /= magnitude;
  inputY /= magnitude;

  if (inputX || inputY) {
    player.facingX = inputX;
    player.facingY = inputY;
  }

  const dashBoost = player.dashTimer > 0 ? 2.7 : 1;
  moveEntity(player, inputX * player.speed * dashBoost * dt, inputY * player.speed * dashBoost * dt);

  if (player.attackCooldown > 0) player.attackCooldown -= dt;
  if (player.attackTimer > 0) player.attackTimer -= dt;
  if (player.dashTimer > 0) player.dashTimer -= dt;
  if (player.dashCooldown > 0) player.dashCooldown -= dt;
  if (player.potionCooldown > 0) player.potionCooldown -= dt;
  if (player.hitFlash > 0) player.hitFlash -= dt;

  if (keys.has(" ") && player.attackCooldown <= 0) {
    player.attackCooldown = player.attackCooldownDuration;
    player.attackTimer = 0.16;
    slashAttack();
  }

  if (keys.has("shift") && player.dashCooldown <= 0) {
    player.dashCooldown = player.dashCooldownDuration;
    player.dashTimer = 0.18;
    emitParticles(player.x, player.y, "#ffe3a1", 12, 130);
  }

  if (keys.has("e") && player.potionCooldown <= 0 && player.health < player.maxHealth) {
    player.health = Math.min(player.maxHealth, player.health + player.potionHeal);
    player.potionCooldown = player.potionCooldownDuration;
    emitParticles(player.x, player.y, theme.potionBurst, 18, 140);
  }
}

function slashAttack() {
  const player = state.player;
  const attackX = player.x + player.facingX * 44;
  const attackY = player.y + player.facingY * 44;

  emitParticles(attackX, attackY, "#ffbf69", 9, 90);

  for (const enemy of state.enemies) {
    const dx = enemy.x - attackX;
    const dy = enemy.y - attackY;
    const dist = Math.hypot(dx, dy);

    if (dist < 48 + enemy.radius) {
      enemy.health -= state.player.attackDamage - (enemy.brute ? 4 : 0);
      enemy.knockbackX = (dx / (dist || 1)) * 180;
      enemy.knockbackY = (dy / (dist || 1)) * 180;
      emitParticles(enemy.x, enemy.y, enemy.tint, enemy.brute ? 12 : 8, 120);
      state.screenShake = Math.max(state.screenShake, 6);
      if (state.player.lifeSteal > 0) {
        state.player.health = Math.min(state.player.maxHealth, state.player.health + state.player.lifeSteal);
      }
    }
  }
}

function updateEnemies(dt) {
  const player = state.player;
  const theme = themeConfig();

  for (const enemy of state.enemies) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;

    enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);
    if (enemy.ranged) {
      enemy.shootCooldown = Math.max(0, enemy.shootCooldown - dt);
    }

    let vx = 0;
    let vy = 0;

    if (enemy.ranged) {
      if (dist > 240) {
        vx = (dx / dist) * enemy.speed;
        vy = (dy / dist) * enemy.speed;
      } else if (dist < 150) {
        vx = -(dx / dist) * enemy.speed * 0.85;
        vy = -(dy / dist) * enemy.speed * 0.85;
      }

      if (enemy.shootCooldown <= 0 && dist < 360) {
        enemy.shootCooldown = rand(1.2, 2.2);
        state.projectiles.push({
          x: enemy.x,
          y: enemy.y,
          vx: (dx / dist) * 240,
          vy: (dy / dist) * 240,
          radius: 7,
          life: 3,
          hostile: true,
        });
        emitParticles(enemy.x, enemy.y, theme.projectileOuter, 8, 100);
      }
    } else {
      vx = (dx / dist) * enemy.speed;
      vy = (dy / dist) * enemy.speed;
    }

    if (enemy.knockbackX || enemy.knockbackY) {
      vx += enemy.knockbackX;
      vy += enemy.knockbackY;
      enemy.knockbackX *= Math.pow(0.02, dt);
      enemy.knockbackY *= Math.pow(0.02, dt);

      if (Math.abs(enemy.knockbackX) < 6) enemy.knockbackX = 0;
      if (Math.abs(enemy.knockbackY) < 6) enemy.knockbackY = 0;
    }

    moveEntity(enemy, vx * dt, vy * dt);

    const hitDist = player.radius + enemy.radius + 2;

    if (dist < hitDist && enemy.hitCooldown <= 0 && player.dashTimer <= 0) {
      player.health -= enemy.damage * player.damageTakenMult;
      player.hitFlash = 0.18;
      enemy.hitCooldown = 0.85;
      state.screenShake = Math.max(state.screenShake, 10);
      emitParticles(player.x, player.y, "#ff5a36", 14, 120);
    }
  }

  const defeated = [];
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.health > 0) return true;
    defeated.push(enemy);
    return false;
  });

  for (const enemy of defeated) {
    state.loot.push({
      x: enemy.x,
      y: enemy.y,
      radius: 10,
      value: enemy.brute ? 7 : 3,
      bob: rand(0, Math.PI * 2),
    });
    emitParticles(enemy.x, enemy.y, "#8effb8", enemy.brute ? 14 : 10, 150);
  }
}

function updateLoot(dt) {
  const player = state.player;

  state.loot = state.loot.filter((gem) => {
    gem.bob += dt * 4;
    const dx = player.x - gem.x;
    const dy = player.y - gem.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 110) {
      gem.x += (dx / (dist || 1)) * 180 * dt;
      gem.y += (dy / (dist || 1)) * 180 * dt;
    }

    if (dist < player.radius + gem.radius + 4) {
      player.emeralds += gem.value;
      emitParticles(gem.x, gem.y, "#36d17d", 8, 100);
      return false;
    }

    return true;
  });
}

function updateProjectiles(dt) {
  const player = state.player;
  const theme = themeConfig();

  state.projectiles = state.projectiles.filter((projectile) => {
    projectile.life -= dt;
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;

    if (projectile.life <= 0) {
      return false;
    }

    for (const wall of state.walls) {
      const wx = wall.gx * TILE;
      const wy = wall.gy * TILE;

      if (circleRectCollision(projectile.x, projectile.y, projectile.radius, wx, wy, TILE, TILE)) {
        emitParticles(projectile.x, projectile.y, theme.projectileBurst, 6, 80);
        return false;
      }
    }

    const dx = projectile.x - player.x;
    const dy = projectile.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < projectile.radius + player.radius && player.dashTimer <= 0) {
      player.health -= 12 * player.damageTakenMult;
      player.hitFlash = 0.18;
      state.screenShake = Math.max(state.screenShake, 8);
      emitParticles(player.x, player.y, theme.projectileBurst, 10, 100);
      return false;
    }

    return true;
  });
}

function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= Math.pow(0.12, dt);
    particle.vy *= Math.pow(0.12, dt);
    return particle.life > 0;
  });
}

function updatePortal(dt) {
  if (!state.portal.active && state.enemies.length === 0) {
    state.portal.active = true;
    emitParticles(state.portal.x, state.portal.y, "#93b7ff", 24, 140);
  }

  if (!state.portal.active) return;

  const dx = state.player.x - state.portal.x;
  const dy = state.player.y - state.portal.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 28) {
    state.level += 1;
    state.portal.active = false;
    state.loot.length = 0;
    state.enemies = spawnWave(state.level);
    state.player.x = TILE * 2.5;
    state.player.y = WORLD_H / 2;
    emitParticles(state.player.x, state.player.y, "#93b7ff", 24, 160);
  }

  waveValue.textContent = state.level;
}

function update(dt) {
  if (state.status !== "running") return;

  handlePlayerInput(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateLoot(dt);
  updateParticles(dt);
  updatePortal(dt);

  if (state.screenShake > 0) {
    state.screenShake = Math.max(0, state.screenShake - 20 * dt);
  }

  if (state.player.health <= 0) {
    const theme = themeConfig();
    state.status = "gameover";
    openOverlay("Mission failed", theme.deathTitle, theme.deathText, "Restart");
  }

  syncHud();
}

function drawBackground(time) {
  const theme = themeConfig();
  const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  gradient.addColorStop(0, theme.bodyTop);
  gradient.addColorStop(0.45, theme.bodyBottom);
  gradient.addColorStop(1, "#09050d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.fillStyle = theme.bgGlow;
  ctx.beginPath();
  ctx.arc(WORLD_W / 2, WORLD_H * 0.35, 230 + Math.sin(time * 0.002) * 18, 0, Math.PI * 2);
  ctx.fill();

  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      const px = x * TILE;
      const py = y * TILE;
      const glow = Math.sin(time * 0.002 + x * 0.7 + y * 0.45) * 5;
      ctx.fillStyle = (x + y) % 2 === 0 ? theme.floorA : theme.floorB;
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = theme.floorGlow.replace("0.05", (0.05 + glow * 0.002).toFixed(3)).replace("0.04", (0.04 + glow * 0.002).toFixed(3)).replace("0.06", (0.06 + glow * 0.002).toFixed(3));
      ctx.fillRect(px, py, TILE, TILE);
      if ((x + y) % 5 === 0) {
        ctx.fillStyle = theme.portalMid;
        ctx.fillRect(px + 8, py + 8, 10, 10);
      }
    }
  }
}

function drawWalls(time) {
  const theme = themeConfig();
  for (const wall of state.walls) {
    const x = wall.gx * TILE;
    const y = wall.gy * TILE;
    const torch = (wall.gx + wall.gy) % 9 === 0;

    ctx.fillStyle = theme.wallA;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = theme.wallB;
    ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 12);
    ctx.fillStyle = theme.wallEdge;
    ctx.fillRect(x, y + TILE - 8, TILE, 8);

    if (torch) {
      const flame = 6 + Math.sin(time * 0.01 + x) * 2;
      ctx.fillStyle = theme.torchGlow;
      ctx.beginPath();
      ctx.arc(x + TILE / 2, y + TILE / 2, 18 + flame, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.torchBase;
      ctx.fillRect(x + TILE / 2 - 3, y + 10, 6, 16);
      ctx.fillStyle = theme.torchFlame;
      ctx.beginPath();
      ctx.arc(x + TILE / 2, y + 10, flame, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPortal(time) {
  if (!state.portal.active) return;
  const theme = themeConfig();
  const pulse = 18 + Math.sin(time * 0.006) * 5;
  ctx.fillStyle = theme.portalOuter;
  ctx.beginPath();
  ctx.arc(state.portal.x, state.portal.y, pulse + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.portalMid;
  ctx.beginPath();
  ctx.arc(state.portal.x, state.portal.y, pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.portalInner;
  ctx.beginPath();
  ctx.arc(state.portal.x, state.portal.y, pulse * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawLoot() {
  for (const gem of state.loot) {
    const bobY = Math.sin(gem.bob) * 5;
    ctx.save();
    ctx.translate(gem.x, gem.y + bobY);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#36d17d";
    ctx.fillRect(-8, -8, 16, 16);
    ctx.fillStyle = "#b7ffd5";
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  }
}

function drawEnemies() {
  const theme = themeConfig();
  for (const enemy of state.enemies) {
    const hurt = enemy.health / enemy.maxHealth;

    ctx.fillStyle = enemy.tint;
    ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius, enemy.radius * 2, enemy.radius * 2);
    ctx.fillStyle = enemy.brute ? theme.wallEdge : enemy.ranged ? theme.coat : "#314a1f";
    ctx.fillRect(enemy.x - enemy.radius * 0.7, enemy.y - enemy.radius * 0.7, enemy.radius * 1.4, enemy.radius * 0.7);
    ctx.fillStyle = "#101010";
    ctx.fillRect(enemy.x - 8, enemy.y - 6, 5, 5);
    ctx.fillRect(enemy.x + 3, enemy.y - 6, 5, 5);

    if (enemy.ranged) {
      ctx.fillStyle = theme.rangedDetail;
      ctx.fillRect(enemy.x - 12, enemy.y + 3, 24, 5);
    }

    if (enemy.brute) {
      ctx.fillStyle = theme.bruteDetail;
      ctx.fillRect(enemy.x - 6, enemy.y + 4, 12, 10);
    }

    ctx.fillStyle = "#1b0f0f";
    ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, enemy.radius * 2, 6);
    ctx.fillStyle = hurt < 0.35 ? "#ff5a36" : "#88f18a";
    ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, enemy.radius * 2 * hurt, 6);
  }
}

function drawPlayer() {
  const player = state.player;
  const theme = themeConfig();
  const hero = heroConfig();
  const glow = player.hitFlash > 0 ? "#ff8f70" : hero.body;

  ctx.fillStyle = hero.aura || theme.playerGlow;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius + 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = glow;
  ctx.fillRect(player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
  ctx.fillStyle = hero.hood;
  ctx.fillRect(player.x - player.radius * 0.8, player.y - player.radius * 1.05, player.radius * 1.6, player.radius * 0.7);
  ctx.fillStyle = hero.coat;
  ctx.fillRect(player.x - player.radius * 0.9, player.y + 2, player.radius * 1.8, player.radius * 0.7);
  ctx.fillStyle = hero.accent;
  ctx.fillRect(player.x - player.radius * 1.05, player.y - 1, 8, player.radius * 1.1);

  ctx.fillStyle = "#101010";
  ctx.fillRect(player.x - 7, player.y - 6, 5, 5);
  ctx.fillRect(player.x + 2, player.y - 6, 5, 5);

  if (player.attackTimer > 0) {
    ctx.strokeStyle = hero.weapon;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(player.x + player.facingX * 16, player.y + player.facingY * 16);
    ctx.lineTo(player.x + player.facingX * 48, player.y + player.facingY * 48);
    ctx.stroke();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
  ctx.globalAlpha = 1;
}

function drawProjectiles() {
  const theme = themeConfig();
  for (const projectile of state.projectiles) {
    ctx.fillStyle = theme.projectileOuter;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.projectileInner;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStatusText() {
  const theme = themeConfig();
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(18, WORLD_H - 58, 470, 40);
  ctx.fillStyle = "#fff7e8";
  ctx.font = '16px "Trebuchet MS", sans-serif';
  const message = state.portal.active
    ? theme.gatewayText
    : `${theme.label}  |  Enemies: ${state.enemies.length}  |  Potion: ${state.player.potionCooldown <= 0 ? "ready" : "cooling down"}`;
  ctx.fillText(message, 32, WORLD_H - 31);
}

function render(timestamp) {
  const shake = state.screenShake > 0
    ? { x: rand(-state.screenShake, state.screenShake), y: rand(-state.screenShake, state.screenShake) }
    : { x: 0, y: 0 };

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(shake.x, shake.y);

  drawBackground(timestamp);
  drawPortal(timestamp);
  drawLoot();
  drawWalls(timestamp);
  drawProjectiles();
  drawEnemies();
  drawPlayer();
  drawParticles();
  drawStatusText();

  ctx.restore();
}

function frame(timestamp) {
  if (!running) return;
  const dt = Math.min(0.033, (timestamp - lastFrame) / 1000 || 0.016);
  lastFrame = timestamp;

  update(dt);
  render(timestamp);
  requestAnimationFrame(frame);
}

function startRun() {
  if (!state || state.status === "gameover") {
    resetGame();
  }

  state.status = "running";
  closeOverlay();

  if (!running) {
    running = true;
    lastFrame = performance.now();
    requestAnimationFrame(frame);
  }
}

startButton.addEventListener("click", startRun);
equipButton.addEventListener("click", equipSelectedItem);
salvageButton.addEventListener("click", salvageSelectedItem);
chapterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTheme = button.dataset.theme;
    applyThemeToPage();
    resetGame();
    render(0);
  });
});
heroButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeHero = button.dataset.hero;
    applyHeroToPage();
    resetGame();
    render(0);
  });
});
Object.entries(slotButtons).forEach(([slot, button]) => {
  button.addEventListener("click", () => {
    const item = equippedItem(slot);
    if (!item) return;
    loadout.selectedId = item.id;
    renderLoadout();
  });
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "shift"].includes(key)) {
    event.preventDefault();
  }

  if (key === "r") {
    resetGame();
    state.status = "running";
    closeOverlay();
  } else {
    keys.add(key);
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

applyThemeToPage();
applyHeroToPage();
resetGame();
render(0);
