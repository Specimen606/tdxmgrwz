/**
 * 菜品配图：使用 Unsplash 公开图片，按菜品主食材/类型精确匹配。
 * 图片 ID 均已验证可访问（images.unsplash.com）。
 */
const PHOTO: Record<string, string> = {
  // 燕麦 / 粥 / 谷物
  oat: '1517673400267-0251440c45dc',
  grain: '1547592180-85f173990554',
  // 面 / 粉
  noodle: '1569718212165-3a8278d5f624',
  friedNoodle: '1585032226651-759b368d7246',
  pasta: '1473093295043-cdd812d0e601',
  // 米饭 / 炒饭 / 盖饭
  friedRice: '1603133872878-684f208fb84b',
  tomatoRice: '1512058564366-18510be2db19',
  riceBowl: '1559847844-5315695dadae',
  // 汤 / 炖菜
  soup: '1547592166-23ac45744acd',
  clearSoup: '1603105037880-880cd4edfb0d',
  stew: '1596797038530-2c107229654b',
  // 蛋 / 吐司 / 早餐
  eggToast: '1533089860892-a7c6f0a88666',
  sunEgg: '1525351484163-7529414344d8',
  eggBenedict: '1608039829572-78524f79c4c7',
  avocadoEgg: '1482049016688-2d3e1b311543',
  pancake: '1567620905732-2d1ec7ab7445',
  egg: '1518569656558-1f25e69d93d7',
  // 沙拉 / 蔬菜
  salad: '1512621776951-a57141f2eefd',
  veggieSalad: '1540420773420-3366772f4999',
  avocadoSalad: '1490645935967-10de6ba17061',
  tofuBowl: '1546069901-ba9599a7e63c',
  colorSalad: '1543353071-873f17a7a088',
  // 肉 / 鸡 / 鱼 / 虾
  ribs: '1544025162-d76694265947',
  steak: '1432139555190-58524dae6a55',
  beefSalad: '1504674900247-0877df9cc836',
  friedChicken: '1626645738196-c2a7c87a8f58',
  salmon: '1519708227418-c8fd9a32b7a2',
  fish: '1467003909585-2f8a72700288',
  shrimp: '1559737558-2f5a35f4523b',
  // 其他
  potato: '1518977676601-b53f82aba655',
  banana: '1571771894821-ce9b6c11b08e',
  yogurt: '1488477181946-6428a0291777',
  dumpling: '1563245372-f21724e3856d',
  dessert: '1565958011703-44f9829ba187',
  ingredients: '1498837167922-ddd27525d352',
}

/** 菜品 id -> 图片 key */
const DISH_IMAGE_KEY: Record<string, string> = {
  // 早餐
  b01: 'oat', b02: 'eggToast', b03: 'oat', b04: 'oat', b05: 'pancake',
  b06: 'banana', b07: 'potato', b08: 'dumpling', b09: 'noodle', b10: 'ingredients',
  b11: 'yogurt', b12: 'friedNoodle', b13: 'avocadoEgg', b14: 'oat',
  // 午餐
  l01: 'tomatoRice', l02: 'tofuBowl', l03: 'stew', l04: 'potato', l05: 'tofuBowl',
  l06: 'salmon', l07: 'riceBowl', l08: 'veggieSalad', l09: 'steak', l10: 'friedNoodle',
  l11: 'friedRice', l12: 'colorSalad', l13: 'noodle', l14: 'grain', l15: 'shrimp', l16: 'fish',
  // 晚餐
  d01: 'clearSoup', d02: 'oat', d03: 'veggieSalad', d04: 'clearSoup', d05: 'avocadoSalad',
  d06: 'clearSoup', d07: 'stew', d08: 'dessert', d09: 'beefSalad', d10: 'eggBenedict',
  d11: 'friedChicken', d12: 'noodle', d13: 'shrimp', d14: 'soup', d15: 'friedRice', d16: 'ribs',
}

export function getDishImageUrl(dishId: string, width = 480): string {
  const key = DISH_IMAGE_KEY[dishId] || 'grain'
  const photo = PHOTO[key]
  return `https://images.unsplash.com/photo-${photo}?w=${width}&q=80&fit=crop`
}
