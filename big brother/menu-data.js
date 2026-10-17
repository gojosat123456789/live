window.CAFE_MENU = [
  { category: "Hot Coffee", items: [
    ["Espresso", 450], ["Double Espresso", 600], ["Americano", 550], ["Cappuccino", 750],
    ["Café Latte", 800], ["Spanish Latte", 850], ["Caramel Latte", 900], ["Vanilla Latte", 900],
    ["Café Mocha", 950]
  ] },
  { category: "Cold Coffee", items: [
    ["Iced Americano", 650], ["Iced Latte", 850], ["Iced Spanish Latte", 900],
    ["Iced Caramel Latte", 950], ["Coffee Frappe", 1000], ["Oreo Frappe", 1100], ["Cold Brew", 900]
  ] },
  { category: "Breakfast", items: [
    ["Classic Omelette", 950], ["Cheese Omelette", 1000], ["English Breakfast", 1800],
    ["Pancakes", 1200], ["Chocolate Pancakes", 1400], ["French Toast", 1400]
  ] },
  { category: "Burgers & Sandwiches", items: [
    ["Classic Chicken Sandwich", 1100], ["Grilled Chicken Sandwich", 1350],
    ["Chicken Club Sandwich", 1500], ["Beef Burger", 1500], ["Cheeseburger", 1650],
    ["Double Beef Burger", 2100], ["Crispy Chicken Burger", 1450]
  ] },
  { category: "Pasta & Main Course", items: [
    ["Alfredo Pasta", 1500], ["Chicken Alfredo", 1850], ["Arrabbiata Pasta", 1400],
    ["Baked Lasagna", 2000], ["Grilled Chicken", 2200], ["Chicken Steak", 2500]
  ] },
  { category: "Pizza", items: [
    ["Margherita Pizza Small", 1200], ["Margherita Pizza Large", 1900],
    ["Chicken Tikka Pizza Small", 1500], ["Chicken Tikka Pizza Large", 2300],
    ["Fajita Pizza Small", 1500], ["Fajita Pizza Large", 2400]
  ] },
  { category: "Desserts", items: [
    ["Chocolate Brownie", 650], ["Chocolate Fudge Cake", 850], ["Red Velvet Cake", 900],
    ["New York Cheesecake", 950], ["Lotus Cheesecake", 1050], ["Chocolate Waffle", 1200]
  ] },
  { category: "Beverages", items: [
    ["Green Tea", 400], ["Masala Chai", 450], ["Fresh Lemonade", 600],
    ["Mint Margarita", 650], ["Mango Smoothie", 850], ["Chocolate Milkshake", 850],
    ["Oreo Milkshake", 950]
  ] }
];

const menuPhotoIds = {
  "Hot Coffee": [
    "1509042239860-f550ce710b93", "1495474472287-4d71bcdd2085", "1461023058943-07fcbe16d735",
    "1517701604599-bb29b565090c", "1442512595338-2c40e54411cd", "1501339847302-ac426a4a7cbb",
    "1511920170033-f8396924c348", "1514432324607-a09d9b4aefdd", "1509785307050-d4066910ec1e"
  ],
  "Cold Coffee": [
    "1517701550927-30cf4ba1dba5", "1498804103079-a6351b050096", "1462917882517-e150004895fa",
    "1512568400610-62da28bc8a13", "1570968915860-54d5c301fa9f", "1556679343-c7306c1976bc",
    "1544145945-f90425340c7e"
  ],
  "Breakfast": [
    "1525351484163-7529414344d8", "1528207776546-365bb710ee93", "1498837167922-ddd27525d352",
    "1506084868230-bb9d95c24759", "1484723091739-30a097e8f929", "1533089860892-a7c6f0a88666"
  ],
  "Burgers & Sandwiches": [
    "1568901346375-23c9450c58cd", "1553909489-cd47e0ef937f", "1555939594-58d7cb561ad1",
    "1550547660-d9450f859349", "1561758033-d89a9ad46330", "1550317138-10000687a72b",
    "1568901346375-23c9450c58cd"
  ],
  "Pasta & Main Course": [
    "1551183053-bf91a1d81141", "1473093295043-cdd812d0e601", "1476124369491-e7addf5db371",
    "1476124369491-e7addf5db371", "1532550907401-a500c9a57435", "1547592180-85f173990554"
  ],
  "Pizza": [
    "1579751626657-72bc17010498", "1565299624946-b28f40a0ae38", "1571407970349-bc81e7e96d47",
    "1565299507177-b0ac66763828", "1593560708920-61dd98c46a4e", "1604382355076-af4b0eb60143"
  ],
  "Desserts": [
    "1578985545062-69928b1d9587", "1571877227200-a0d98ea607e9", "1606313564200-e75d5e30476c",
    "1533134242443-d4fd215305ad", "1565958011703-44f9829ba187", "1551024506-0bccd828d307"
  ],
  "Beverages": [
    "1515823064-d6e0c04616a7", "1576092768241-dec231879fc3", "1505252585461-04db1eb84625",
    "1563805042-7684c019e1cb", "1546069901-ba9599a7e63c", "1572490122747-3968b75cc699",
    "1499636136210-6f4ee915583e"
  ]
};

window.CAFE_MENU_ITEMS = window.CAFE_MENU.flatMap(({ category, items }) => {
  const photos = menuPhotoIds[category];
  return items.map(([name, price], index) => ({
    id: `${category.toLowerCase().replace(/[^a-z]+/g, "-")}-${index + 1}`,
    category,
    name,
    price,
    available: true,
    image: `https://images.unsplash.com/photo-${photos[index]}?auto=format&fit=crop&w=720&q=82`,
    description: `${name}, prepared fresh with carefully selected ingredients.`
  }));
});
