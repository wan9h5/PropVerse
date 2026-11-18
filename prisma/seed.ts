import { PrismaClient } from "@prisma/client";
import { categorySeed } from "../src/lib/categories";
const prisma = new PrismaClient();
const draftAssets = [
["objects","rustic-three-legged-wooden-stool","老式三脚木凳"],
["objects","woven-rattan-chair","老式藤编椅"],
["objects","bamboo-low-stool","竹制矮凳"],
["objects","vintage-crt-television","老式显像管电视机"],
["objects","rotary-dial-telephone","拨盘式老电话"],
["objects","portable-transistor-radio","便携式晶体管收音机"],
["objects","enamel-tea-mug","搪瓷茶缸"],
["objects","insulated-hot-water-bottle","老式热水瓶"],
["objects","kerosene-lamp","煤油灯"],
["objects","wooden-storage-trunk","老式木箱"],
["objects","folded-yellowed-newspaper","发黄的旧报纸"],
["objects","handwritten-letter","手写旧信件"],
["architecture","huizhou-traditional-house","徽派传统民居"],
["architecture","beijing-siheyuan","北京四合院"],
["architecture","hakka-walled-village-house","客家围龙屋"],
["architecture","chaoshan-traditional-house","潮汕传统古厝"],
["architecture","fujian-tulou","福建土楼"],
["architecture","jiangnan-water-town-house","江南水乡民居"],
["architecture","traditional-japanese-wooden-house","日本传统木屋"],
["architecture","european-rural-stone-house","欧洲乡村石屋"],
["culture","hakka-traditional-folk-custom","客家传统民俗"],
["culture","chaoshan-wedding-custom","潮汕传统婚俗"],
["culture","traditional-folk-ceremony","传统民间仪式"],
["culture","traditional-chinese-costume","中国传统服饰"],
["culture","feng-shui-cultural-symbols","传统风水文化意象"],
["landscapes","mountain-enclosed-valley","群山环抱的山谷"],
["landscapes","winding-river-basin","河流弯曲的山间盆地"],
["landscapes","karst-peak-forest","喀斯特峰林"],
["landscapes","mountain-and-water-embrace","山环水抱地貌"],
["special","mystical-cultivation-mountain","玄幻修行山境"]
] as const;
async function main(){
for(const [index,category] of categorySeed.entries()){
const row=await prisma.category.upsert({where:{slug:category.slug},update:{sortOrder:index},create:{slug:category.slug,sortOrder:index}});
for(const [locale,name] of Object.entries(category.names)){
await prisma.categoryTranslation.upsert({where:{categoryId_locale:{categoryId:row.id,locale}},update:{name},create:{categoryId:row.id,locale,name}});
}
}
for(const [index,[categorySlug,slug]] of draftAssets.entries()){
const category=await prisma.category.findUniqueOrThrow({where:{slug:categorySlug}});
await prisma.asset.upsert({where:{slug},update:{sortOrder:index},create:{slug,categoryId:category.id,status:"DRAFT",sortOrder:index}});
}
console.log("Seeded five categories and 30 draft assets. Visuals and translations still require creation and review.");
}
main().finally(async()=>prisma.$disconnect());