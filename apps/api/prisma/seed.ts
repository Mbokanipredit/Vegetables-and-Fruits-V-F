import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS_SEED = [
  { id: 1, name: "Big Irish potatoes", kinyarwanda: "Ibirayi bya kinigi", unit: "kg", price: 1600, category: "Roots & Tubers", popular: true },
  { id: 2, name: "Small/select potatoes", kinyarwanda: "Ibirayi bitoranije", unit: "kg", price: 1400, category: "Roots & Tubers", popular: false },
  { id: 3, name: "Green banana", kinyarwanda: "Ibitoki", unit: "kg", price: 700, category: "Plantains & Bananas", popular: true },
  { id: 4, name: "Taro / Yam", kinyarwanda: "Amateke", unit: "kg", price: 1300, category: "Roots & Tubers", popular: false },
  { id: 5, name: "Cassava", kinyarwanda: "Imyumbati", unit: "kg", price: 800, category: "Roots & Tubers", popular: false },
  { id: 6, name: "Pumpkin", kinyarwanda: "Igihaza", unit: "pcs", price: 3000, category: "Fresh Vegetables", popular: false },
  { id: 7, name: "Dry beans", kinyarwanda: "Ibihyimbo bisanzwe", unit: "kg", price: 1500, category: "Specialty Produce & Pulses", popular: false },
  { id: 8, name: "Peas", kinyarwanda: "Amashaza", unit: "kg", price: 3500, category: "Specialty Produce & Pulses", popular: true },
  { id: 9, name: "Plantain", kinyarwanda: "Imizuzu", unit: "kg", price: 2500, category: "Plantains & Bananas", popular: true },
  { id: 10, name: "Broccoli", kinyarwanda: "Broccoli", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: true },
  { id: 11, name: "Cauliflower", kinyarwanda: "Choux fleur", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: true },
  { id: 12, name: "Amaranth greens", kinyarwanda: "Dodo", unit: "bdl", price: 400, category: "Leafy Greens", popular: false },
  { id: 13, name: "Spinach", kinyarwanda: "Spinach", unit: "bdl", price: 600, category: "Leafy Greens", popular: true },
  { id: 14, name: "Green pepper", kinyarwanda: "Poivron vert", unit: "kg", price: 2000, category: "Fresh Vegetables", popular: true },
  { id: 15, name: "Imiteja (French Beans)", kinyarwanda: "Imiteja", unit: "kg", price: 1800, category: "Fresh Vegetables", popular: true },
  { id: 16, name: "Red cabbage", kinyarwanda: "Isho Ritukoye", unit: "pcs", price: 1500, category: "Fresh Vegetables", popular: false },
  { id: 17, name: "Cabbage", kinyarwanda: "Ishu risanzwe", unit: "pcs", price: 1000, category: "Fresh Vegetables", popular: true },
  { id: 18, name: "Carrots", kinyarwanda: "Karoti", unit: "kg", price: 1500, category: "Fresh Vegetables", popular: true },
  { id: 19, name: "Garlic", kinyarwanda: "Tunguru sumu", unit: "kg", price: 4500, category: "Spices & Herbs", popular: true },
  { id: 20, name: "Cassava leaves", kinyarwanda: "Isombe", unit: "kg", price: 2000, category: "Leafy Greens", popular: true },
  { id: 21, name: "Red onions", kinyarwanda: "Ibitunguru bitukura", unit: "kg", price: 1400, category: "Fresh Vegetables", popular: true },
  { id: 22, name: "Eggplants", kinyarwanda: "Ibibirinyanya", unit: "pcs", price: 600, category: "Fresh Vegetables", popular: false },
  { id: 23, name: "African eggplant", kinyarwanda: "Intoryi", unit: "kg", price: 1000, category: "Fresh Vegetables", popular: false },
  { id: 24, name: "Parsley", kinyarwanda: "Persil", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false },
  { id: 25, name: "Celery", kinyarwanda: "Céleri", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false },
  { id: 26, name: "Coriander", kinyarwanda: "Coriandre", unit: "bdl", price: 100, category: "Spices & Herbs", popular: false },
  { id: 27, name: "Ginger", kinyarwanda: "Tangawizi", unit: "kg", price: 2000, category: "Spices & Herbs", popular: true },
  { id: 28, name: "Mint", kinyarwanda: "Jeunes pousses", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false },
  { id: 29, name: "Cinnamon", kinyarwanda: "Canelle", unit: "kg", price: 1500, category: "Spices & Herbs", popular: false },
  { id: 30, name: "Chili", kinyarwanda: "Urusenda", unit: "kg", price: 2000, category: "Spices & Herbs", popular: true },
  { id: 31, name: "Leeks", kinyarwanda: "Poireaux", unit: "bdl", price: 800, category: "Leafy Greens", popular: false },
  { id: 32, name: "Rosemary", kinyarwanda: "Teyi", unit: "bdl", price: 500, category: "Spices & Herbs", popular: false },
  { id: 33, name: "Lettuce", kinyarwanda: "Laitue", unit: "bdl", price: 300, category: "Leafy Greens", popular: true },
  { id: 34, name: "Tomatoes", kinyarwanda: "Inyanya", unit: "kg", price: 1500, category: "Fresh Vegetables", popular: true },
  { id: 35, name: "Red pepper", kinyarwanda: "Poivron rouge", unit: "kg", price: 4000, category: "Fresh Vegetables", popular: true },
  { id: 36, name: "Yellow pepper", kinyarwanda: "Poivron jaune", unit: "kg", price: 4000, category: "Fresh Vegetables", popular: true },
  { id: 37, name: "Gombo (Okra)", kinyarwanda: "Gombo", unit: "kg", price: 3000, category: "Fresh Vegetables", popular: false },
  { id: 38, name: "Mushrooms", kinyarwanda: "Ibihumyo", unit: "pack", price: 4500, category: "Specialty Produce & Pulses", popular: true },
  { id: 39, name: "Cherry tomatoes (500g)", kinyarwanda: "Inyanya z'utubumbe", unit: "sachet", price: 3500, category: "Fresh Vegetables", popular: true },
  { id: 40, name: "Beetroot", kinyarwanda: "Betterave", unit: "kg", price: 700, category: "Roots & Tubers", popular: false },
  { id: 41, name: "Peanut flour", kinyarwanda: "Ubunyobwa buseye", unit: "kg", price: 3000, category: "Specialty Produce & Pulses", popular: false },
  { id: 42, name: "Cucumber", kinyarwanda: "Concombre", unit: "pcs", price: 600, category: "Fresh Vegetables", popular: true },
  { id: 43, name: "Courgette (Zucchini)", kinyarwanda: "Courgette", unit: "pcs", price: 2000, category: "Fresh Vegetables", popular: false },
  { id: 44, name: "Red lettuce", kinyarwanda: "Laitue rouge", unit: "pcs", price: 400, category: "Leafy Greens", popular: false },
  { id: 45, name: "Grapes", kinyarwanda: "Umuzabibu", unit: "barquette", price: 8000, category: "Fresh Fruits", popular: true },
  { id: 46, name: "Mango", kinyarwanda: "Umwembe", unit: "kg", price: 5000, category: "Fresh Fruits", popular: true },
  { id: 47, name: "Papaya", kinyarwanda: "Ipapayi", unit: "pcs", price: 1500, category: "Fresh Fruits", popular: true },
  { id: 48, name: "Small banana", kinyarwanda: "Kamara", unit: "kg", price: 2000, category: "Plantains & Bananas", popular: false },
  { id: 49, name: "Avocado", kinyarwanda: "Avoka", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true },
  { id: 50, name: "Orange", kinyarwanda: "Amarongi", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true },
  { id: 51, name: "Apple", kinyarwanda: "Pomme", unit: "pcs", price: 700, category: "Fresh Fruits", popular: true },
  { id: 52, name: "Tree tomatoes", kinyarwanda: "Ibinyomoro", unit: "kg", price: 2000, category: "Fresh Fruits", popular: true },
  { id: 53, name: "Passion fruit", kinyarwanda: "Marakuja", unit: "kg", price: 2500, category: "Fresh Fruits", popular: true },
  { id: 54, name: "Watermelon", kinyarwanda: "Pastèque", unit: "pcs", price: 4500, category: "Fresh Fruits", popular: true },
  { id: 55, name: "Big banana", kinyarwanda: "Imineke", unit: "pcs", price: 270, category: "Plantains & Bananas", popular: true },
  { id: 56, name: "White onion", kinyarwanda: "Ibitunguru by'umweru", unit: "kg", price: 1100, category: "Fresh Vegetables", popular: true }
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
  console.log('✅ Successfully seeded 56 items into PostgreSQL produce database!');
}

main()
  .catch((e) => {
    console.error('Error seeding Prisma database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
