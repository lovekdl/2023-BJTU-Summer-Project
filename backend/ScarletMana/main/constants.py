# Constants in this app

# DEBUG MODE
DEBUG_MODE_SKILL = True

# 资源刷新时间
RESOURCE_REFRESH_TIME = 10

# 雇佣矮人价格
EMPLOY_DWARF_PRICE = 5
EMPLOY_DWARF_SALARY = 0.2

# 矮人职业
DWARF_JOB_IDLE = 0
DWARF_JOB_MINER = 1
DWARF_JOB_MERCHANT = 2
DWARF_JOB_SOLDIER = 3

DWARF_JOB_REFLECTION = {
    DWARF_JOB_IDLE: "空闲",
    DWARF_JOB_MINER: "矿工",
    DWARF_JOB_MERCHANT: "商人",
    DWARF_JOB_SOLDIER: "佣兵",
}

# 信息面板
MESSAGE_ENTER_FIRST_TIME = [
    "你的祖父 病逝 了。",
    "你收到了一封信，你从中了解到，你的祖父留下了一座 庞大 的 废弃矿场。",
    "而你是这座废弃矿场的 第一继承人。",
    "于是，你决定 继承 这座矿场，并将其发扬光大。",
    "但谁知道，这座矿场中埋藏着一些 上古 遗留下来的 神秘......",
]

MESSAGE_ENTER = [
    "你回到了这座矿场",
]

MESSAGE_EMPLOY_DWARF = [
    "你招募了一名叫做 {firstname}·{secondname} 的{sex}矮人。\n{ta}的属性值是：力量 {strength}, 灵巧 {dexterity}, 体质 {constitution}, 智力 {intelligence}, 感知 {wisdom}, 魅力 {charisma}.",
]

MESSAGE_MODIFY_DWARF_JOB = [
    "你将矮人{firstname}·{secondname}分配为{newjob}",
]