// 饮食指导数据

export interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export interface FoodRecommendation {
  category: string;
  foods: { name: string; benefit: string; icon: string }[];
}

// 一周地中海饮食菜单
export const weeklyMealPlan: MealPlan[] = [
  {
    day: '周一',
    breakfast: '全麦面包2片 + 煮鸡蛋1个 + 蓝莓50g + 无糖酸奶150ml',
    lunch: '烤三文鱼150g + 混合蔬菜沙拉 + 糙米100g + 橄榄油醋汁',
    dinner: '番茄鸡肉汤 + 全麦馒头1个 + 清炒西兰花',
    snacks: '坚果30g + 苹果1个',
  },
  {
    day: '周二',
    breakfast: '燕麦粥300ml + 坚果20g + 香蕉1根',
    lunch: '鹰嘴豆沙拉（鹰嘴豆100g + 蔬菜）+ 全麦饼1张',
    dinner: '清蒸鲈鱼200g + 凉拌黄瓜 + 糙米饭80g',
    snacks: '希腊酸奶100g + 草莓100g',
  },
  {
    day: '周三',
    breakfast: '全麦贝果1个 + 牛油果半个 + 煎鸡蛋1个 + 橙子半个',
    lunch: '烤鸡胸肉150g + 藜麦100g + 烤蔬菜（南瓜、甜椒）',
    dinner: '蔬菜豆腐汤 + 全麦面条80g',
    snacks: '胡萝卜条 +  hummus鹰嘴豆泥50g',
  },
  {
    day: '周四',
    breakfast: '希腊酸奶200g + 燕麦30g + 混合莓果100g + 蜂蜜1勺',
    lunch: '地中海沙拉（番茄、黄瓜、洋葱、橄榄）+ 烤鸡胸100g + 全麦薄饼',
    dinner: '红酒烩牛肉（少量）+ 蒸西葫芦 + 糙米饭80g',
    snacks: '坚果30g + 梨1个',
  },
  {
    day: '周五',
    breakfast: '蔬菜鸡蛋饼（菠菜、番茄）+ 全麦吐司1片 + 猕猴桃1个',
    lunch: '吞拿鱼沙拉 + 杂粮饭100g + 蔬菜汤',
    dinner: '烤蔬菜（茄子、甜椒、洋葱）+ 煎三文鱼150g',
    snacks: '酸奶100g + 坚果20g',
  },
  {
    day: '周六',
    breakfast: '法式吐司（全麦面包）+ 新鲜水果 + 枫糖浆（少量）',
    lunch: '意式蔬菜汤 + 全麦面包2片 + 火鸡肉片100g',
    dinner: '白酒奶油虾（少量奶油）+ 芦笋 + 糙米饭80g',
    snacks: '苹果1个 + 花生酱1勺',
  },
  {
    day: '周日',
    breakfast: '中式早餐：豆浆300ml（无糖）+ 菜包1个 + 水煮蛋1个',
    lunch: '家庭聚餐选择：清蒸鱼 + 蔬菜 + 糙米饭',
    dinner: '轻食：沙拉（生菜、黄瓜、番茄）+ 烤鸡胸100g + 玉米半根',
    snacks: '水果沙拉（季节水果）',
  },
];

// 食物推荐
export const foodRecommendations: FoodRecommendation[] = [
  {
    category: '推荐食物',
    foods: [
      { name: '三文鱼', benefit: '富含Omega-3，降低炎症', icon: '🐟' },
      { name: '橄榄油', benefit: '单不饱和脂肪酸，保护心血管', icon: '🫒' },
      { name: '蓝莓', benefit: '抗氧化，保护肝细胞', icon: '🫐' },
      { name: '菠菜', benefit: '富含铁和叶酸', icon: '🥬' },
      { name: '燕麦', benefit: '降低胆固醇，改善血糖', icon: '🌾' },
      { name: '坚果', benefit: '健康脂肪，饱腹感强', icon: '🥜' },
      { name: '牛油果', benefit: '富含单不饱和脂肪', icon: '🥑' },
      { name: '绿茶', benefit: '抗氧化，促进代谢', icon: '🍵' },
    ],
  },
  {
    category: '适量食用',
    foods: [
      { name: '鸡胸肉', benefit: '低脂高蛋白', icon: '🍗' },
      { name: '鸡蛋', benefit: '优质蛋白，每天1-2个', icon: '🥚' },
      { name: '全麦面包', benefit: '富含膳食纤维', icon: '🍞' },
      { name: '糙米', benefit: '低GI值主食', icon: '🍚' },
      { name: '低糖水果', benefit: '苹果、梨、柚子', icon: '🍎' },
      { name: '豆制品', benefit: '植物蛋白来源', icon: '🫘' },
    ],
  },
  {
    category: '避免食用',
    foods: [
      { name: '油炸食品', benefit: '高热量，产生有害物质', icon: '🍟' },
      { name: '甜饮料', benefit: '高糖，导致脂肪堆积', icon: '🥤' },
      { name: '白面包', benefit: '高GI值，易血糖波动', icon: '🍞' },
      { name: '加工肉类', benefit: '高盐高脂，增加负担', icon: '🌭' },
      { name: '酒精', benefit: '直接损害肝细胞', icon: '🍺' },
      { name: '动物内脏', benefit: '高胆固醇', icon: '🫀' },
    ],
  },
];

// 每日饮食建议
export const dailyDietTips = [
  '每天喝1500-2000ml水，帮助代谢',
  '三餐规律，不要暴饮暴食',
  '细嚼慢咽，每餐至少15分钟',
  '控制食用油量，每天不超过25ml',
  '多吃深色蔬菜，至少占蔬菜总量的一半',
  '选择清蒸、水煮、炖煮等烹饪方式',
  '晚餐尽量在睡前3小时吃完',
  '避免边看电视边吃饭，容易过量',
];

// 获取今日饮食建议
export const getTodayDietTip = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return dailyDietTips[dayOfYear % dailyDietTips.length];
};
