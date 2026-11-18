import type { Locale } from "./i18n";
export const categorySeed = [
{slug:"objects",names:{"zh-CN":"物品","zh-TW":"物品",en:"Objects",ko:"사물",ja:"物品",fr:"Objets"}},
{slug:"architecture",names:{"zh-CN":"建筑","zh-TW":"建築",en:"Architecture",ko:"건축",ja:"建築",fr:"Architecture"}},
{slug:"culture",names:{"zh-CN":"文化","zh-TW":"文化",en:"Culture",ko:"문화",ja:"文化",fr:"Culture"}},
{slug:"landscapes",names:{"zh-CN":"地貌","zh-TW":"地貌",en:"Landscapes",ko:"지형",ja:"地形",fr:"Paysages"}},
{slug:"special",names:{"zh-CN":"特殊","zh-TW":"特殊",en:"Special",ko:"특수",ja:"特殊",fr:"Spécial"}}
] satisfies {slug:string;names:Record<Locale,string>}[];