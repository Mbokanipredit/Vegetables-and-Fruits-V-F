import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS_SEED = [
  { id: 1, name: "Big Irish potatoes", kinyarwanda: "Ibirayi bya kinigi", unit: "kg", price: 1600, category: "Roots & Tubers", popular: true, imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Small/select potatoes", kinyarwanda: "Ibirayi bitoranije", unit: "kg", price: 1400, category: "Roots & Tubers", popular: false, imageUrl: "https://images.unsplash.com/photo-1508313880080-c4bef0730395?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Green banana", kinyarwanda: "Ibitoki", unit: "kg", price: 700, category: "Plantains & Bananas", popular: true, imageUrl: "/products/green-banana.jpg" },
  { id: 4, name: "Taro / Yam", kinyarwanda: "Amateke", unit: "kg", price: 1300, category: "Roots & Tubers", popular: false, imageUrl: "/products/taro.jpg" },
  { id: 5, name: "Cassava", kinyarwanda: "Imyumbati", unit: "kg", price: 800, category: "Roots & Tubers", popular: false, imageUrl: "/products/cassava.jpg" },
  { id: 6, name: "Pumpkin", kinyarwanda: "Igihaza", unit: "pcs", price: 3000, category: "Fresh Vegetables", popular: false, imageUrl: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Dry beans", kinyarwanda: "Ibihyimbo bisanzwe", unit: "kg", price: 1500, category: "Specialty Produce & Pulses", popular: false, imageUrl: "/products/dry-beans.jpg" },
  { id: 8, name: "Peas", kinyarwanda: "Amashaza", unit: "kg", price: 3500, category: "Specialty Produce & Pulses", popular: true, imageUrl: "/products/peas.jpg" },
  { id: 9, name: "Plantain", kinyarwanda: "Imizuzu", unit: "kg", price: 2500, category: "Plantains & Bananas", popular: true, imageUrl: "/products/plantain.jpg" },
  { id: 10, name: "Broccoli", kinyarwanda: "Broccoli", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80" },
  { id: 11, name: "Cauliflower", kinyarwanda: "Choux fleur", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80" },
  { id: 12, name: "Amaranth greens", kinyarwanda: "Dodo", unit: "bdl", price: 400, category: "Leafy Greens", popular: false, imageUrl: "/products/amaranth.jpg" },
  { id: 13, name: "Spinach", kinyarwanda: "Spinach", unit: "bdl", price: 600, category: "Leafy Greens", popular: true, imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80" },
  { id: 14, name: "Green pepper", kinyarwanda: "Poivron vert", unit: "kg", price: 2000, category: "Fresh Vegetables", popular: true, imageUrl: "/products/green-pepper.jpg" },
  { id: 15, name: "Imiteja (French Beans)", kinyarwanda: "Imiteja", unit: "kg", price: 1800, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80" },
  { id: 16, name: "Red cabbage", kinyarwanda: "Isho Ritukoye", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: false, imageUrl: "/products/red-cabbage.jpg" },
  { id: 17, name: "Cabbage", kinyarwanda: "Ishu risanzwe", unit: "pcs", price: 1000, category: "Fresh Vegetables", popular: true, imageUrl: "/products/cabbage.jpg" },
  { id: 18, name: "Carrots", kinyarwanda: "Karoti", unit: "kg", price: 1500, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80" },
  { id: 19, name: "Garlic", kinyarwanda: "Tunguru sumu", unit: "kg", price: 4500, category: "Spices & Herbs", popular: true, imageUrl: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80" },
  { id: 20, name: "Cassava leaves", kinyarwanda: "Isombe", unit: "kg", price: 2000, category: "Leafy Greens", popular: true, imageUrl: "/products/cassava-leaves.jpg" },
  { id: 21, name: "Red onions", kinyarwanda: "Ibitunguru bitukura", unit: "kg", price: 1400, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80" },
  { id: 22, name: "Eggplants", kinyarwanda: "Ibibirinyanya", unit: "pcs", price: 600, category: "Fresh Vegetables", popular: false, imageUrl: "/products/eggplant.jpg" },
  { id: 23, name: "African eggplant", kinyarwanda: "Intoryi", unit: "kg", price: 1000, category: "Fresh Vegetables", popular: false, imageUrl: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=600&q=80" },
  { id: 24, name: "Parsley", kinyarwanda: "Persil", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false, imageUrl: "/products/parsley.jpg" },
  { id: 25, name: "Celery", kinyarwanda: "Céleri", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false, imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80" },
  { id: 26, name: "Coriander", kinyarwanda: "Coriandre", unit: "bdl", price: 100, category: "Spices & Herbs", popular: false, imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80" },
  { id: 27, name: "Ginger", kinyarwanda: "Tangawizi", unit: "kg", price: 2000, category: "Spices & Herbs", popular: true, imageUrl: "/products/ginger.jpg" },
  { id: 28, name: "Mint", kinyarwanda: "Jeunes pousses", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false, imageUrl: "/products/mint.jpg" },
  { id: 29, name: "Cinnamon", kinyarwanda: "Canelle", unit: "kg", price: 1500, category: "Spices & Herbs", popular: false, imageUrl: "/products/cinnamon.jpg" },
  { id: 30, name: "Chili", kinyarwanda: "Urusenda", unit: "kg", price: 2000, category: "Spices & Herbs", popular: true, imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80" },
  { id: 31, name: "Leeks", kinyarwanda: "Poireaux", unit: "bdl", price: 800, category: "Leafy Greens", popular: false, imageUrl: "/products/leeks.jpg" },
  { id: 32, name: "Rosemary", kinyarwanda: "Teyi", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false, imageUrl: "/products/rosemary.jpg" },
  { id: 33, name: "Lettuce", kinyarwanda: "Laitue", unit: "bdl", price: 300, category: "Leafy Greens", popular: true, imageUrl: "/products/lettuce.jpg" },
  { id: 34, name: "Tomatoes", kinyarwanda: "Inyanya", unit: "kg", price: 1500, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80" },
  { id: 35, name: "Red pepper", kinyarwanda: "Poivron rouge", unit: "kg", price: 4000, category: "Fresh Vegetables", popular: true, imageUrl: "/products/red-pepper.jpg" },
  { id: 36, name: "Yellow pepper", kinyarwanda: "Poivron jaune", unit: "kg", price: 4000, category: "Fresh Vegetables", popular: true, imageUrl: "/products/yellow-pepper.jpg" },
  { id: 37, name: "Gombo (Okra)", kinyarwanda: "Gombo", unit: "kg", price: 3000, category: "Fresh Vegetables", popular: false, imageUrl: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80" },
  { id: 38, name: "Mushrooms", kinyarwanda: "Ibihumyo", unit: "pack", price: 4500, category: "Specialty Produce & Pulses", popular: true, imageUrl: "/products/mushrooms.jpg" },
  { id: 39, name: "Cherry tomatoes (500g)", kinyarwanda: "Inyanya z'utubumbe", unit: "sachet", price: 3500, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80" },
  { id: 40, name: "Beetroot", kinyarwanda: "Betterave", unit: "kg", price: 700, category: "Roots & Tubers", popular: false, imageUrl: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80" },
  { id: 41, name: "Peanut flour", kinyarwanda: "Ubunyobwa buseye", unit: "kg", price: 3000, category: "Specialty Produce & Pulses", popular: false, imageUrl: "/products/peanut-flour.jpg" },
  { id: 42, name: "Cucumber", kinyarwanda: "Concombre", unit: "pcs", price: 600, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80" },
  { id: 43, name: "Courgette (Zucchini)", kinyarwanda: "Courgette", unit: "pcs", price: 2000, category: "Fresh Vegetables", popular: false, imageUrl: "/products/courgette.jpg" },
  { id: 44, name: "Red lettuce", kinyarwanda: "Laitue rouge", unit: "pcs", price: 400, category: "Leafy Greens", popular: false, imageUrl: "/products/red-lettuce.jpg" },
  { id: 45, name: "Grapes", kinyarwanda: "Umuzabibu", unit: "barquette", price: 8000, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80" },
  { id: 46, name: "Mango", kinyarwanda: "Umwembe", unit: "kg", price: 5000, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" },
  { id: 47, name: "Papaya", kinyarwanda: "Ipapayi", unit: "pcs", price: 1500, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80" },
  { id: 48, name: "Small banana", kinyarwanda: "Kamara", unit: "kg", price: 2000, category: "Plantains & Bananas", popular: false, imageUrl: "/products/small-banana.jpg" },
  { id: 49, name: "Avocado", kinyarwanda: "Avoka", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true, imageUrl: "/products/avocado.jpg" },
  { id: 50, name: "Orange", kinyarwanda: "Amarongi", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80" },
  { id: 51, name: "Apple", kinyarwanda: "Pomme", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80" },
  { id: 52, name: "Tree tomatoes", kinyarwanda: "Ibinyomoro", unit: "kg", price: 2000, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80" },
  { id: 53, name: "Passion fruit", kinyarwanda: "Marakuja", unit: "kg", price: 2500, category: "Fresh Fruits", popular: true, imageUrl: "/products/passion-fruit.jpg" },
  { id: 54, name: "Watermelon", kinyarwanda: "Pastèque", unit: "pcs", price: 4500, category: "Fresh Fruits", popular: true, imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80" },
  { id: 55, name: "Big banana", kinyarwanda: "Imineke", unit: "pcs", price: 270, category: "Plantains & Bananas", popular: true, imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80" },
  { id: 56, name: "White onion", kinyarwanda: "Ibitunguru by'umweru", unit: "kg", price: 1100, category: "Fresh Vegetables", popular: true, imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=600&q=80" }
];

async function main() {
  console.log('🌱 Seeding V&F Vegetables & Fruits database into PostgreSQL...');
  for (const item of PRODUCTS_SEED) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log('✅ Successfully seeded 56 items with pictures into PostgreSQL produce database!');
}

main()
  .catch((e) => {
    console.error('Error seeding Prisma database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
