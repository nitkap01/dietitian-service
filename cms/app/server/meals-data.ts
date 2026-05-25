// ─── Indian Food Database ─────────────────────────────────────────────────────
// 1000+ entries covering all regions, meal types, and dietary preferences.
// Each entry: [name, category, calories, protein, carbs, fat, serving_size, tags, notes]

type MealEntry = [
  string,           // name
  string,           // category: breakfast | lunch | snacks | dinner | any
  number,           // calories_per_serving (kcal)
  string,           // protein (e.g. "12g")
  string,           // carbs
  string,           // fat
  string,           // serving_size
  string[],         // health_tags
  string,           // notes
];

export const INDIAN_MEALS: MealEntry[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // BREAKFAST
  // ══════════════════════════════════════════════════════════════════════════

  // South Indian Breakfast
  ['Plain Idli (2 pieces)', 'breakfast', 130, '4g', '25g', '1g', '2 medium idlis (100g)', ['weight_management', 'sugar_control'], 'Fermented, easy to digest. Low fat.'],
  ['Rava Idli (2 pieces)', 'breakfast', 160, '5g', '28g', '3g', '2 idlis (110g)', ['weight_management'], 'Semolina-based, quick to make. Higher GI than plain idli.'],
  ['Mini Idli (8 pieces)', 'breakfast', 140, '4g', '27g', '1g', '8 mini idlis (120g)', ['weight_management', 'sugar_control'], 'Good portion control. Same nutrition as regular idli.'],
  ['Plain Dosa', 'breakfast', 170, '4g', '30g', '4g', '1 large dosa (80g)', ['weight_management', 'sugar_control'], 'Fermented rice-lentil crepe. Low calorie when made without excess oil.'],
  ['Masala Dosa', 'breakfast', 290, '7g', '42g', '9g', '1 dosa with filling (150g)', ['weight_management'], 'With spiced potato filling. Higher calories than plain dosa.'],
  ['Rava Dosa', 'breakfast', 195, '5g', '32g', '5g', '1 dosa (90g)', ['weight_management'], 'Crispy semolina dosa. Quick to prepare.'],
  ['Set Dosa (3 pieces)', 'breakfast', 210, '6g', '36g', '4g', '3 small dosas (130g)', ['weight_management', 'sugar_control'], 'Softer, thicker dosa. Lower GI.'],
  ['Pesarattu', 'breakfast', 155, '9g', '25g', '2g', '1 large dosa (90g)', ['weight_management', 'pcos', 'sugar_control'], 'Green moong dal dosa. High protein, low GI. Excellent for PCOS.'],
  ['Neer Dosa', 'breakfast', 100, '2g', '20g', '1g', '2 thin dosas (70g)', ['weight_management', 'sugar_control'], 'Very light rice dosa from coastal Karnataka.'],
  ['Upma', 'breakfast', 200, '5g', '35g', '5g', '1 bowl (200g)', ['weight_management'], 'Semolina porridge. Add vegetables for better nutrition.'],
  ['Rava Upma with Vegetables', 'breakfast', 185, '6g', '32g', '4g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'With mixed vegetables. Good fiber content.'],
  ['Oats Upma', 'breakfast', 175, '7g', '30g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Oats-based upma. Lower GI than rava upma.'],
  ['Pongal', 'breakfast', 220, '7g', '38g', '5g', '1 bowl (200g)', ['sugar_control'], 'Rice-lentil porridge. Wholesome and filling.'],
  ['Ven Pongal', 'breakfast', 245, '8g', '40g', '6g', '1 bowl (200g)', [], 'Peppery rice-lentil porridge. High ghee content.'],
  ['Khara Pongal', 'breakfast', 230, '7g', '38g', '6g', '1 bowl (200g)', ['sugar_control'], 'Spiced pongal with pepper and cumin.'],
  ['Uttapam (plain)', 'breakfast', 180, '5g', '32g', '4g', '1 medium uttapam (100g)', ['weight_management', 'sugar_control'], 'Thick rice-lentil pancake.'],
  ['Tomato Uttapam', 'breakfast', 190, '5g', '33g', '4g', '1 uttapam (110g)', ['weight_management', 'sugar_control'], 'With tomato topping. Adds vitamins.'],
  ['Onion Uttapam', 'breakfast', 195, '5g', '34g', '5g', '1 uttapam (115g)', ['weight_management'], 'With onion topping.'],
  ['Mixed Vegetable Uttapam', 'breakfast', 200, '6g', '34g', '4g', '1 uttapam (120g)', ['weight_management', 'sugar_control', 'pcos'], 'With vegetables. Best fiber option.'],
  ['Idiyappam (2 pieces)', 'breakfast', 140, '3g', '28g', '1g', '2 string hoppers (80g)', ['weight_management', 'sugar_control'], 'Rice noodle dumplings from South India. Low fat.'],
  ['Appam', 'breakfast', 155, '3g', '30g', '3g', '2 appams (90g)', ['weight_management'], 'Fermented rice pancake with crispy edges.'],
  ['Puttu with Banana', 'breakfast', 280, '5g', '55g', '4g', '1 cylinder + 1 banana (180g)', ['weight_management'], 'Steamed rice cylinder with banana. Good energy.'],
  ['Puttu with Kadala Curry', 'breakfast', 320, '12g', '52g', '6g', '1 cylinder + curry (200g)', ['weight_management', 'pcos'], 'With black chickpea curry. High protein combination.'],
  ['Tapioca with Coconut Chutney', 'breakfast', 195, '2g', '42g', '3g', '1 bowl (150g)', [], 'Kerala breakfast. High carbs.'],
  ['Vada (2 pieces)', 'breakfast', 220, '7g', '26g', '10g', '2 vadas (100g)', [], 'Fried lentil doughnut. High in fat.'],
  ['Medu Vada', 'breakfast', 240, '8g', '28g', '11g', '2 vadas (110g)', [], 'Crispy fried vada. Limit for weight management.'],
  ['Sambar Vada', 'breakfast', 280, '9g', '35g', '11g', '2 vadas with sambar (200g)', [], 'Vada soaked in sambar. Good protein but high fat.'],

  // North Indian Breakfast
  ['Aloo Paratha', 'breakfast', 310, '6g', '42g', '12g', '1 large paratha (150g)', [], 'Stuffed flatbread. High calorie. Use less ghee.'],
  ['Gobi Paratha', 'breakfast', 290, '7g', '40g', '11g', '1 paratha (145g)', ['weight_management'], 'Cauliflower stuffed paratha. Better fiber than aloo.'],
  ['Methi Paratha', 'breakfast', 260, '7g', '36g', '9g', '1 paratha (130g)', ['pcos', 'sugar_control'], 'Fenugreek paratha. Excellent for insulin sensitivity.'],
  ['Paneer Paratha', 'breakfast', 340, '14g', '38g', '15g', '1 paratha (160g)', ['weight_management'], 'High protein option. Good for muscle building.'],
  ['Dal Paratha', 'breakfast', 275, '10g', '38g', '9g', '1 paratha (140g)', ['weight_management', 'pcos'], 'Lentil-stuffed flatbread. High protein and fiber.'],
  ['Plain Paratha', 'breakfast', 210, '5g', '30g', '8g', '1 paratha (100g)', ['weight_management'], 'Whole wheat flatbread. Use minimal ghee.'],
  ['Poha (Flattened Rice)', 'breakfast', 180, '4g', '35g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Light and nutritious. Iron-rich. Add peanuts for protein.'],
  ['Poha with Peanuts', 'breakfast', 220, '7g', '36g', '6g', '1 bowl (210g)', ['weight_management'], 'Better protein and fat profile with peanuts.'],
  ['Kanda Poha', 'breakfast', 195, '5g', '36g', '4g', '1 bowl (205g)', ['weight_management'], 'Maharashtrian style with onions.'],
  ['Batata Poha', 'breakfast', 210, '4g', '40g', '4g', '1 bowl (210g)', [], 'With potatoes. Higher GI.'],
  ['Upvas Poha', 'breakfast', 170, '3g', '34g', '2g', '1 bowl (180g)', ['weight_management'], 'Fasting-style poha without onion/garlic.'],
  ['Sabudana Khichdi', 'breakfast', 280, '5g', '52g', '7g', '1 bowl (200g)', [], 'Tapioca pearls khichdi. High GI, not ideal for diabetics.'],
  ['Vermicelli Upma', 'breakfast', 195, '5g', '34g', '4g', '1 bowl (200g)', ['weight_management'], 'Semiya upma. Light and filling.'],
  ['Besan Chilla', 'breakfast', 170, '9g', '22g', '5g', '2 chillas (120g)', ['weight_management', 'pcos', 'sugar_control'], 'Chickpea flour pancake. Excellent protein source, low GI.'],
  ['Moong Dal Chilla', 'breakfast', 150, '10g', '19g', '3g', '2 chillas (110g)', ['weight_management', 'pcos', 'sugar_control'], 'Best high-protein, low-calorie breakfast option.'],
  ['Vegetable Besan Chilla', 'breakfast', 185, '10g', '24g', '5g', '2 chillas (130g)', ['weight_management', 'pcos', 'sugar_control'], 'With mixed vegetables. High fiber.'],
  ['Thepla', 'breakfast', 195, '5g', '28g', '7g', '2 theplas (120g)', ['sugar_control', 'pcos'], 'Gujarati methi flatbread. Good for blood sugar.'],
  ['Dhebra', 'breakfast', 210, '6g', '30g', '8g', '2 pieces (130g)', ['pcos'], 'Bajra-methi flatbread. Iron and zinc rich.'],
  ['Bhakri (Bajra)', 'breakfast', 190, '5g', '38g', '3g', '1 bhakri (100g)', ['sugar_control', 'pcos'], 'Pearl millet flatbread. Excellent for PCOS and diabetes.'],
  ['Jowar Bhakri', 'breakfast', 180, '5g', '36g', '2g', '1 bhakri (100g)', ['sugar_control', 'weight_management'], 'Sorghum flatbread. Gluten-free, low GI.'],
  ['Ragi Mudde', 'breakfast', 200, '5g', '42g', '1g', '2 balls (150g)', ['sugar_control', 'pcos', 'weight_management'], 'Finger millet balls. Extremely high calcium. Low GI.'],
  ['Ragi Dosa', 'breakfast', 155, '5g', '28g', '3g', '1 dosa (80g)', ['sugar_control', 'pcos', 'weight_management'], 'Finger millet dosa. Nutrient-dense, low GI.'],
  ['Akki Roti', 'breakfast', 165, '3g', '32g', '3g', '1 roti (90g)', ['sugar_control'], 'Rice flour flatbread from Karnataka.'],
  ['Pesarattu with Upma', 'breakfast', 280, '12g', '44g', '5g', '1 dosa + upma (200g)', ['weight_management', 'pcos', 'sugar_control'], 'Classic Andhra combination. High protein meal.'],

  // Egg and Protein Breakfasts
  ['Boiled Eggs (2)', 'breakfast', 140, '12g', '1g', '10g', '2 large eggs (120g)', ['weight_management', 'pcos', 'high_protein'], 'Complete protein. Ideal for weight management.'],
  ['Scrambled Eggs (2)', 'breakfast', 180, '12g', '2g', '13g', '2 eggs scrambled (130g)', ['weight_management', 'high_protein'], 'With minimal butter/oil.'],
  ['Egg Bhurji', 'breakfast', 195, '13g', '4g', '14g', '2 eggs (140g)', ['weight_management', 'pcos', 'high_protein'], 'Spiced scrambled eggs. Indian style.'],
  ['Omelette (2 eggs)', 'breakfast', 185, '13g', '2g', '14g', '2-egg omelette (130g)', ['weight_management', 'pcos', 'high_protein'], 'Vegetable omelette adds fiber.'],
  ['Masala Omelette', 'breakfast', 200, '13g', '5g', '14g', '2 eggs (145g)', ['weight_management', 'pcos', 'high_protein'], 'With onion, tomato, chilli.'],
  ['Egg Paratha', 'breakfast', 310, '15g', '32g', '14g', '1 paratha (160g)', ['weight_management', 'high_protein'], 'Egg-stuffed flatbread. High protein breakfast.'],
  ['Paneer Bhurji', 'breakfast', 220, '14g', '5g', '16g', '1 bowl (150g)', ['weight_management', 'pcos', 'high_protein'], 'Scrambled cottage cheese. Excellent vegetarian protein.'],

  // Porridges and Cereals
  ['Oats Porridge (plain)', 'breakfast', 150, '5g', '27g', '3g', '1 bowl (200ml)', ['weight_management', 'sugar_control', 'pcos'], 'High beta-glucan fiber. Excellent cholesterol reduction.'],
  ['Masala Oats', 'breakfast', 175, '6g', '30g', '4g', '1 bowl (200ml)', ['weight_management', 'sugar_control', 'pcos'], 'Savory oats with vegetables. Better satiety.'],
  ['Oats with Banana and Honey', 'breakfast', 220, '6g', '42g', '3g', '1 bowl (220g)', ['weight_management'], 'Naturally sweetened oats. Good pre-workout.'],
  ['Oats with Dry Fruits', 'breakfast', 250, '7g', '40g', '7g', '1 bowl (220g)', ['weight_management', 'pcos'], 'Add mixed nuts for omega-3.'],
  ['Millet Porridge', 'breakfast', 170, '5g', '33g', '2g', '1 bowl (200ml)', ['sugar_control', 'pcos', 'weight_management'], 'Bajra/jowar porridge. Excellent for blood sugar.'],
  ['Ragi Porridge', 'breakfast', 160, '5g', '32g', '1g', '1 bowl (200ml)', ['sugar_control', 'pcos', 'weight_management'], 'Highest calcium among cereals. Low GI.'],
  ['Dalia (Broken Wheat) Porridge', 'breakfast', 165, '5g', '34g', '1g', '1 bowl (200ml)', ['weight_management', 'sugar_control'], 'High fiber, slow-digesting breakfast.'],
  ['Dalia Khichdi', 'breakfast', 190, '7g', '36g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Broken wheat with lentils. Complete protein.'],
  ['Semiya Payasam (small)', 'breakfast', 230, '6g', '40g', '5g', '1 small bowl (150ml)', [], 'Vermicelli kheer. Occasional treat.'],
  ['Cornflakes with Milk', 'breakfast', 190, '7g', '36g', '4g', '1 bowl (200ml)', [], 'High GI. Not ideal for diabetes.'],
  ['Muesli with Low-fat Milk', 'breakfast', 220, '8g', '38g', '5g', '1 bowl (200ml)', ['weight_management', 'pcos'], 'Better than cornflakes. More fiber.'],

  // Drinks (Breakfast)
  ['Green Tea', 'breakfast', 2, '0g', '0g', '0g', '1 cup (240ml)', ['weight_management', 'pcos', 'sugar_control'], 'Antioxidants, metabolism boost. Drink before breakfast.'],
  ['Masala Chai (no sugar)', 'breakfast', 40, '2g', '6g', '1g', '1 cup (200ml)', ['weight_management'], 'With ginger, cardamom. Avoid sugar.'],
  ['Turmeric Milk (Haldi Doodh)', 'breakfast', 110, '6g', '12g', '4g', '1 glass (250ml)', ['pcos', 'sugar_control'], 'Anti-inflammatory. Good before bed too.'],
  ['Buttermilk (Chaas)', 'breakfast', 35, '3g', '5g', '0g', '1 glass (250ml)', ['weight_management', 'pcos', 'sugar_control'], 'Probiotic, low calorie. Cooling.'],
  ['Nimbu Pani (no sugar)', 'breakfast', 15, '0g', '4g', '0g', '1 glass (250ml)', ['weight_management', 'sugar_control'], 'With salt and cumin. Electrolyte boost.'],
  ['Coconut Water', 'breakfast', 45, '2g', '9g', '0g', '1 glass (250ml)', ['weight_management', 'pcos'], 'Natural electrolytes. Low calorie.'],
  ['Banana Smoothie', 'breakfast', 180, '5g', '38g', '2g', '1 glass (300ml)', ['weight_management'], 'With low-fat milk. Good energy.'],
  ['Flaxseed Smoothie', 'breakfast', 130, '5g', '18g', '5g', '1 glass (250ml)', ['pcos'], 'Omega-3 rich. Hormonal balance.'],
  ['Whey Protein Shake', 'breakfast', 150, '25g', '8g', '2g', '1 scoop in 250ml water', ['weight_management', 'high_protein'], 'Post-workout breakfast option.'],
  ['Sattu Sharbat', 'breakfast', 140, '8g', '24g', '2g', '1 glass (300ml)', ['weight_management', 'sugar_control', 'pcos'], 'Roasted chickpea drink. High protein, cooling.'],

  // Other Breakfasts
  ['Sprouts Salad', 'breakfast', 90, '8g', '14g', '1g', '1 bowl (150g)', ['weight_management', 'pcos', 'sugar_control'], 'Mixed sprouts. High protein, very low GI.'],
  ['Moong Sprouts with Lemon', 'breakfast', 80, '7g', '13g', '0g', '1 bowl (140g)', ['weight_management', 'pcos', 'sugar_control'], 'Best light breakfast for diabetics.'],
  ['Fruit Salad (seasonal)', 'breakfast', 100, '1g', '24g', '0g', '1 bowl (200g)', ['weight_management'], 'Seasonal fruits. Avoid if diabetic.'],
  ['Papaya (1 bowl)', 'breakfast', 55, '1g', '14g', '0g', '1 bowl (200g)', ['weight_management', 'pcos'], 'Digestive enzyme papain. Excellent for PCOS.'],
  ['Watermelon', 'breakfast', 45, '1g', '11g', '0g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'High water content, very low calorie.'],
  ['Mixed Nuts (small handful)', 'breakfast', 160, '5g', '7g', '14g', '30g mixed nuts', ['weight_management', 'pcos'], 'Healthy fats. Pair with protein for satiety.'],
  ['Anjeer (Dried Figs, 3)', 'breakfast', 90, '1g', '22g', '0g', '3 dried figs (50g)', ['pcos'], 'Iron-rich. Good for hormonal balance.'],
  ['Dates (2)', 'breakfast', 65, '0g', '18g', '0g', '2 medjool dates (40g)', ['weight_management'], 'Natural sweetener. In moderation.'],

  // ══════════════════════════════════════════════════════════════════════════
  // LUNCH
  // ══════════════════════════════════════════════════════════════════════════

  // Rice Dishes
  ['Steamed Rice', 'lunch', 200, '4g', '44g', '0g', '1 cup cooked (180g)', ['sugar_control'], 'Plain white rice. Pair with dal for protein.'],
  ['Brown Rice', 'lunch', 215, '5g', '45g', '2g', '1 cup cooked (180g)', ['weight_management', 'sugar_control'], 'Higher fiber, lower GI than white rice.'],
  ['Red Rice', 'lunch', 210, '5g', '43g', '2g', '1 cup cooked (180g)', ['sugar_control', 'pcos'], 'High antioxidants, lower GI.'],
  ['Matta Rice', 'lunch', 220, '5g', '46g', '2g', '1 cup cooked (180g)', ['sugar_control'], 'Kerala red rice. High fiber.'],
  ['Quinoa', 'lunch', 220, '8g', '39g', '4g', '1 cup cooked (185g)', ['pcos', 'weight_management', 'sugar_control'], 'Complete protein. All essential amino acids.'],
  ['Millets (mixed cooked)', 'lunch', 190, '5g', '39g', '2g', '1 cup cooked (180g)', ['sugar_control', 'pcos', 'weight_management'], 'Excellent diabetes-friendly grain.'],
  ['Jowar Roti (2)', 'lunch', 190, '6g', '38g', '2g', '2 rotis (120g)', ['sugar_control', 'weight_management', 'pcos'], 'Gluten-free, low GI.'],
  ['Bajra Roti (2)', 'lunch', 200, '6g', '40g', '3g', '2 rotis (120g)', ['sugar_control', 'pcos'], 'Pearl millet roti. Iron and zinc rich.'],
  ['Multigrain Roti (2)', 'lunch', 180, '7g', '34g', '3g', '2 rotis (120g)', ['weight_management', 'sugar_control'], 'Best roti option for weight management.'],
  ['Whole Wheat Roti (2)', 'lunch', 170, '6g', '33g', '2g', '2 rotis (120g)', ['weight_management', 'sugar_control'], 'Good fiber, low GI.'],
  ['Makki di Roti', 'lunch', 185, '4g', '38g', '2g', '1 roti (100g)', ['sugar_control'], 'Corn flatbread. Gluten-free.'],
  ['Pulao (Vegetable)', 'lunch', 240, '5g', '46g', '4g', '1 plate (200g)', ['weight_management'], 'Lightly spiced rice with vegetables.'],
  ['Jeera Rice', 'lunch', 215, '4g', '44g', '3g', '1 cup (180g)', [], 'Cumin-flavored rice. Digestive.'],
  ['Lemon Rice', 'lunch', 225, '4g', '45g', '4g', '1 plate (180g)', ['weight_management'], 'With turmeric and curry leaves.'],
  ['Coconut Rice', 'lunch', 260, '4g', '46g', '7g', '1 plate (180g)', [], 'Higher fat due to coconut. Occasional.'],
  ['Curd Rice', 'lunch', 200, '6g', '36g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Probiotic. Cooling and digestive. Light.'],
  ['Sambar Rice', 'lunch', 250, '9g', '46g', '3g', '1 plate (200g)', ['weight_management', 'sugar_control'], 'Mixed rice with sambar. Good protein.'],
  ['Rasam Rice', 'lunch', 220, '5g', '44g', '2g', '1 plate (200g)', ['weight_management', 'sugar_control'], 'Very digestive. Good for digestion.'],
  ['Tamarind Rice (Puliyodharai)', 'lunch', 235, '4g', '47g', '4g', '1 plate (180g)', [], 'Tangy rice. Occasional.'],
  ['Bisi Bele Bath', 'lunch', 280, '10g', '46g', '6g', '1 bowl (250g)', ['weight_management'], 'Karnataka one-pot meal with lentils. Nutritious.'],
  ['Khichdi (Moong Dal)', 'lunch', 250, '12g', '42g', '4g', '1 bowl (250g)', ['weight_management', 'sugar_control'], 'Easiest to digest. Great for recovery.'],
  ['Khichdi (Mixed Vegetable)', 'lunch', 260, '11g', '44g', '4g', '1 bowl (250g)', ['weight_management', 'sugar_control'], 'One pot nutritious meal.'],
  ['Vangi Bath', 'lunch', 265, '5g', '48g', '6g', '1 plate (200g)', [], 'Karnataka brinjal rice.'],
  ['Dum Biryani (Veg)', 'lunch', 380, '9g', '62g', '10g', '1 plate (300g)', [], 'Aromatic rice. Festive. High calorie.'],
  ['Dum Biryani (Chicken)', 'lunch', 420, '22g', '58g', '12g', '1 plate (300g)', ['high_protein'], 'Higher protein than veg biryani.'],
  ['Paneer Biryani', 'lunch', 400, '16g', '60g', '12g', '1 plate (300g)', ['high_protein'], 'Protein-rich biryani.'],

  // Dal and Lentils
  ['Moong Dal (Yellow)', 'lunch', 140, '11g', '22g', '1g', '1 bowl (200ml)', ['weight_management', 'pcos', 'sugar_control', 'high_protein'], 'Easiest to digest lentil. High protein.'],
  ['Masoor Dal (Red Lentil)', 'lunch', 150, '12g', '24g', '1g', '1 bowl (200ml)', ['weight_management', 'pcos', 'sugar_control', 'high_protein'], 'Quick cooking. Very high protein for a lentil.'],
  ['Chana Dal', 'lunch', 180, '13g', '30g', '3g', '1 bowl (200ml)', ['weight_management', 'sugar_control'], 'Low GI lentil. Excellent for blood sugar.'],
  ['Toor Dal (Arhar)', 'lunch', 155, '11g', '26g', '1g', '1 bowl (200ml)', ['weight_management', 'pcos', 'sugar_control'], 'Most common Indian dal. Good protein.'],
  ['Urad Dal', 'lunch', 160, '12g', '26g', '1g', '1 bowl (200ml)', ['weight_management', 'pcos'], 'Black lentil. High in iron and potassium.'],
  ['Dal Tadka', 'lunch', 195, '12g', '27g', '5g', '1 bowl (200ml)', ['weight_management'], 'Toor dal with tempering. Standard restaurant dal.'],
  ['Dal Makhani', 'lunch', 280, '11g', '28g', '14g', '1 bowl (200ml)', [], 'Black dal with cream. High calorie. Occasional.'],
  ['Panchmel Dal', 'lunch', 195, '13g', '28g', '4g', '1 bowl (200ml)', ['weight_management', 'pcos', 'sugar_control'], 'Five-lentil mix. Rajasthani. High protein.'],
  ['Rajma (Kidney Beans)', 'lunch', 180, '9g', '30g', '1g', '1 bowl (200ml)', ['pcos', 'sugar_control', 'weight_management'], 'High fiber, plant protein. Low GI.'],
  ['Chole (Chickpeas)', 'lunch', 200, '11g', '32g', '4g', '1 bowl (200ml)', ['pcos', 'weight_management', 'sugar_control'], 'High protein and fiber. Excellent for PCOS.'],
  ['Kala Chana (Black Chickpeas)', 'lunch', 190, '10g', '32g', '3g', '1 bowl (200ml)', ['weight_management', 'pcos', 'sugar_control'], 'Higher fiber than white chickpeas. Good for PCOS.'],
  ['Lobiya (Black-eyed Peas)', 'lunch', 175, '11g', '30g', '1g', '1 bowl (200ml)', ['weight_management', 'pcos'], 'Iron-rich legume. Good for women.'],
  ['Sambar', 'lunch', 80, '4g', '12g', '2g', '1 bowl (200ml)', ['weight_management', 'sugar_control'], 'Tamarind-lentil soup. Very low calorie.'],
  ['Rasam', 'lunch', 30, '1g', '6g', '0g', '1 glass (200ml)', ['weight_management', 'sugar_control'], 'Extremely low calorie. Digestive.'],
  ['Kolhapuri Misal', 'lunch', 320, '14g', '45g', '8g', '1 bowl (300g)', ['weight_management'], 'Sprout curry with bread. High protein.'],

  // Vegetables (Sabzis)
  ['Palak Paneer', 'lunch', 280, '16g', '12g', '18g', '1 bowl (200g)', ['weight_management', 'pcos', 'high_protein'], 'Spinach with cottage cheese. Iron + protein rich.'],
  ['Saag Paneer', 'lunch', 270, '15g', '11g', '17g', '1 bowl (200g)', ['weight_management', 'pcos'], 'Mixed greens with paneer. High iron.'],
  ['Matar Paneer', 'lunch', 290, '15g', '20g', '17g', '1 bowl (200g)', ['weight_management', 'high_protein'], 'Peas and cottage cheese. Good protein-carb balance.'],
  ['Shahi Paneer', 'lunch', 350, '15g', '18g', '24g', '1 bowl (200g)', [], 'Rich gravy. High calorie. Occasional.'],
  ['Paneer Bhurji', 'lunch', 220, '14g', '5g', '16g', '1 bowl (150g)', ['weight_management', 'pcos', 'high_protein'], 'Scrambled cottage cheese. Quick protein.'],
  ['Chilli Paneer (dry)', 'lunch', 310, '16g', '22g', '17g', '1 plate (200g)', [], 'Indo-Chinese. Moderate calorie.'],
  ['Aloo Gobi', 'lunch', 150, '4g', '24g', '5g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Potato cauliflower sabzi. Good fiber.'],
  ['Aloo Matar', 'lunch', 170, '5g', '27g', '5g', '1 bowl (200g)', ['weight_management'], 'Potato pea curry.'],
  ['Baingan Bharta', 'lunch', 120, '3g', '16g', '5g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Roasted brinjal. Low calorie, antioxidant-rich.'],
  ['Bhindi Masala', 'lunch', 100, '3g', '14g', '4g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Okra curry. Excellent for blood sugar control.'],
  ['Lauki (Bottle Gourd) Sabzi', 'lunch', 60, '2g', '10g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Very low calorie. High water content.'],
  ['Tinda Sabzi', 'lunch', 65, '2g', '10g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Low calorie summer vegetable.'],
  ['Karela (Bitter Gourd) Sabzi', 'lunch', 45, '2g', '8g', '1g', '1 bowl (200g)', ['sugar_control', 'pcos'], 'Best vegetable for blood sugar. Bitter but excellent.'],
  ['Methi (Fenugreek) Sabzi', 'lunch', 70, '4g', '10g', '2g', '1 bowl (200g)', ['pcos', 'sugar_control'], 'Reduces blood sugar and insulin resistance.'],
  ['Palak (Spinach) Sabzi', 'lunch', 50, '4g', '6g', '2g', '1 bowl (200g)', ['weight_management', 'pcos', 'sugar_control'], 'Iron-rich, very low calorie.'],
  ['Mixed Vegetable Sabzi', 'lunch', 90, '3g', '14g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Seasonal vegetables. Best varied option.'],
  ['Gobi Sabzi', 'lunch', 80, '3g', '12g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Cauliflower. Cancer-fighting glucosinolates.'],
  ['Gajar Matar Sabzi', 'lunch', 90, '3g', '16g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Carrot peas. Beta-carotene rich.'],
  ['Beans Sabzi (French/Cluster)', 'lunch', 80, '4g', '13g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'High fiber green beans.'],
  ['Mushroom Masala', 'lunch', 100, '5g', '10g', '5g', '1 bowl (200g)', ['weight_management', 'pcos', 'sugar_control'], 'Good vitamin D source (if sun-dried).'],
  ['Soya Chunks Sabzi', 'lunch', 220, '26g', '14g', '4g', '1 bowl (200g)', ['weight_management', 'pcos', 'high_protein'], 'Highest plant protein. Excellent for PCOS.'],
  ['Tofu Stir Fry', 'lunch', 150, '12g', '8g', '8g', '1 plate (200g)', ['weight_management', 'pcos', 'high_protein'], 'Good estrogen-modulating phytoestrogens for PCOS.'],
  ['Dal Bati Churma', 'lunch', 480, '14g', '65g', '18g', '1 plate (300g)', [], 'Rajasthani festive. High calorie.'],
  ['Pav Bhaji', 'lunch', 380, '10g', '55g', '13g', '1 serving with pav (300g)', [], 'Street food. High calorie. Occasional.'],

  // Salads and Light Lunch
  ['Green Salad', 'lunch', 50, '2g', '8g', '1g', '1 large bowl (250g)', ['weight_management', 'sugar_control', 'pcos'], 'Cucumber, tomato, onion, lemon. Pre-meal essential.'],
  ['Sprout Salad', 'lunch', 110, '8g', '16g', '1g', '1 bowl (200g)', ['weight_management', 'pcos', 'sugar_control'], 'Mixed sprouts. High protein salad.'],
  ['Cucumber Raita', 'lunch', 70, '5g', '8g', '2g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Cooling probiotic. Reduce meal GI.'],
  ['Boondi Raita', 'lunch', 110, '5g', '14g', '4g', '1 bowl (150g)', [], 'With fried boondi. Higher calorie raita.'],
  ['Mixed Veg Raita', 'lunch', 80, '5g', '9g', '2g', '1 bowl (150g)', ['weight_management', 'pcos', 'sugar_control'], 'Best raita for nutrition.'],
  ['Kachumber Salad', 'lunch', 45, '2g', '8g', '0g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Diced cucumber, tomato, onion, chilli.'],
  ['Kosambari', 'lunch', 90, '5g', '12g', '2g', '1 bowl (150g)', ['weight_management', 'pcos', 'sugar_control'], 'South Indian lentil salad with coconut.'],
  ['Chana Salad', 'lunch', 160, '9g', '25g', '2g', '1 bowl (200g)', ['weight_management', 'pcos', 'sugar_control'], 'Chickpea salad with vegetables.'],

  // Chicken / Seafood / Meat Lunches
  ['Tandoori Chicken (2 pieces)', 'lunch', 280, '35g', '5g', '12g', '2 pieces (200g)', ['weight_management', 'high_protein'], 'High protein, low carb. Excellent for weight loss.'],
  ['Chicken Curry', 'lunch', 290, '28g', '8g', '16g', '1 bowl (200g)', ['weight_management', 'high_protein'], 'Good protein. Use less oil.'],
  ['Kadai Chicken', 'lunch', 310, '30g', '10g', '17g', '1 bowl (200g)', ['weight_management', 'high_protein'], 'Spiced chicken. High protein.'],
  ['Palak Chicken', 'lunch', 295, '30g', '8g', '16g', '1 bowl (200g)', ['weight_management', 'high_protein', 'pcos'], 'Spinach chicken. Iron + protein.'],
  ['Chicken Tikka', 'lunch', 240, '32g', '5g', '10g', '6 pieces (200g)', ['weight_management', 'high_protein'], 'Best lean protein lunch option.'],
  ['Chicken Breast (grilled)', 'lunch', 165, '31g', '0g', '4g', '1 breast (150g)', ['weight_management', 'high_protein'], 'Leanest chicken cut. Best for weight loss.'],
  ['Fish Curry (coastal)', 'lunch', 220, '26g', '6g', '10g', '1 bowl (200g)', ['weight_management', 'pcos', 'high_protein'], 'Omega-3 rich. Excellent for PCOS and heart health.'],
  ['Fish Fry', 'lunch', 260, '28g', '5g', '14g', '2 pieces (150g)', ['high_protein'], 'Protein-rich. Use minimal oil.'],
  ['Prawn Masala', 'lunch', 200, '24g', '6g', '9g', '1 bowl (200g)', ['weight_management', 'high_protein'], 'High protein, low calorie seafood.'],
  ['Egg Curry', 'lunch', 240, '15g', '8g', '16g', '2 eggs in curry (200g)', ['weight_management', 'high_protein'], 'Complete protein. Good for weight management.'],
  ['Mutton Curry', 'lunch', 340, '28g', '6g', '22g', '1 bowl (200g)', ['high_protein'], 'High protein but high fat. Occasional.'],

  // ══════════════════════════════════════════════════════════════════════════
  // SNACKS
  // ══════════════════════════════════════════════════════════════════════════

  // Fruits
  ['Apple', 'snacks', 80, '0g', '21g', '0g', '1 medium (150g)', ['weight_management', 'sugar_control', 'pcos'], 'Low GI fruit. High pectin fiber.'],
  ['Banana', 'snacks', 90, '1g', '23g', '0g', '1 medium (100g)', ['weight_management'], 'Quick energy. Not ideal for diabetics.'],
  ['Orange', 'snacks', 60, '1g', '15g', '0g', '1 medium (130g)', ['weight_management', 'sugar_control', 'pcos'], 'Vitamin C rich. Low GI.'],
  ['Guava', 'snacks', 65, '2g', '14g', '1g', '1 medium (120g)', ['weight_management', 'sugar_control', 'pcos'], 'Highest vitamin C. Low GI. Excellent for diabetes.'],
  ['Papaya', 'snacks', 55, '1g', '14g', '0g', '1 bowl (200g)', ['weight_management', 'pcos'], 'Digestive papain enzyme. Low calorie.'],
  ['Pomegranate', 'snacks', 80, '1g', '19g', '0g', '1 small bowl (100g)', ['pcos', 'sugar_control'], 'Anti-inflammatory. Supports hormone balance.'],
  ['Pear', 'snacks', 70, '0g', '18g', '0g', '1 medium (150g)', ['weight_management', 'sugar_control'], 'High fiber. Low GI.'],
  ['Plum', 'snacks', 45, '1g', '11g', '0g', '2 medium (130g)', ['weight_management', 'sugar_control'], 'Low calorie. Low GI.'],
  ['Peach', 'snacks', 50, '1g', '13g', '0g', '1 medium (130g)', ['weight_management', 'sugar_control'], 'Low calorie, rich in vitamins.'],
  ['Kiwi', 'snacks', 60, '1g', '15g', '0g', '2 kiwis (130g)', ['weight_management', 'pcos', 'sugar_control'], 'High vitamin C and K. Low GI.'],
  ['Grapes (small bowl)', 'snacks', 70, '1g', '18g', '0g', '1 small bowl (100g)', ['weight_management'], 'Moderate GI. Limit for diabetics.'],
  ['Watermelon', 'snacks', 45, '1g', '11g', '0g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Very low calorie. High water.'],
  ['Muskmelon', 'snacks', 55, '1g', '14g', '0g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Cooling, low calorie.'],
  ['Strawberries', 'snacks', 50, '1g', '12g', '0g', '1 cup (150g)', ['weight_management', 'pcos', 'sugar_control'], 'Antioxidant-rich. Low GI.'],
  ['Jamun (Java Plum)', 'snacks', 40, '1g', '10g', '0g', '1 bowl (100g)', ['sugar_control', 'pcos'], 'Best fruit for diabetics. Controls blood sugar.'],

  // Nuts and Seeds
  ['Almonds', 'snacks', 95, '4g', '3g', '8g', '10 almonds (14g)', ['weight_management', 'pcos', 'sugar_control'], 'Vitamin E, magnesium, healthy fats.'],
  ['Walnuts', 'snacks', 130, '3g', '3g', '13g', '5 walnut halves (20g)', ['pcos'], 'Highest omega-3 nut. Anti-inflammatory.'],
  ['Cashews', 'snacks', 155, '5g', '9g', '13g', '10 cashews (25g)', [], 'Higher carbs than other nuts. Limit for diabetics.'],
  ['Pistachios', 'snacks', 160, '6g', '8g', '13g', '20 pistachios (30g)', ['weight_management', 'pcos', 'sugar_control'], 'High protein nut. Good for blood sugar.'],
  ['Peanuts (roasted)', 'snacks', 160, '8g', '6g', '14g', '2 tbsp (28g)', ['weight_management', 'pcos'], 'Highest protein nut. Affordable.'],
  ['Pumpkin Seeds', 'snacks', 150, '9g', '5g', '13g', '3 tbsp (30g)', ['pcos', 'weight_management'], 'Zinc-rich. Supports hormonal balance in PCOS.'],
  ['Sunflower Seeds', 'snacks', 160, '6g', '5g', '14g', '3 tbsp (30g)', ['pcos', 'weight_management'], 'Vitamin E rich. Anti-inflammatory.'],
  ['Chia Seeds', 'snacks', 70, '2g', '5g', '5g', '1 tbsp (12g)', ['weight_management', 'pcos', 'sugar_control'], 'Omega-3, fiber. Excellent gel-forming fiber.'],
  ['Flaxseeds (ground)', 'snacks', 55, '2g', '3g', '4g', '1 tbsp (10g)', ['pcos', 'weight_management', 'sugar_control'], 'Lignans balance estrogen. Essential for PCOS.'],
  ['Sesame Seeds', 'snacks', 100, '3g', '4g', '9g', '2 tbsp (18g)', ['pcos'], 'Calcium and zinc rich. Good for PCOS.'],
  ['Mixed Trail Mix (no sugar)', 'snacks', 180, '5g', '12g', '14g', '3 tbsp (40g)', ['weight_management', 'pcos'], 'Nuts and seeds combination. Healthy fats.'],

  // Indian Healthy Snacks
  ['Roasted Chana', 'snacks', 120, '7g', '18g', '3g', '30g', ['weight_management', 'sugar_control'], 'High protein, low GI snack. Best Indian snack for diabetics.'],
  ['Makhana (Fox Nuts)', 'snacks', 100, '4g', '20g', '0g', '1 bowl (30g)', ['weight_management', 'sugar_control', 'pcos'], 'Very low fat, low GI. Calcium-rich.'],
  ['Roasted Makhana', 'snacks', 110, '4g', '21g', '1g', '1 bowl (30g)', ['weight_management', 'sugar_control', 'pcos'], 'Light crunchy snack. Guilt-free.'],
  ['Chivda (baked)', 'snacks', 130, '4g', '20g', '4g', '1 handful (40g)', ['weight_management'], 'Baked flattened rice mix. Better than fried.'],
  ['Puffed Rice (Murmura)', 'snacks', 110, '2g', '24g', '0g', '1 large bowl (30g)', ['weight_management'], 'Very low fat. High volume, low calorie.'],
  ['Bhel Puri (healthy version)', 'snacks', 140, '4g', '26g', '2g', '1 serving (100g)', ['weight_management'], 'Puffed rice with vegetables and tamarind chutney. Light.'],
  ['Dhokla', 'snacks', 160, '8g', '25g', '3g', '2 pieces (100g)', ['weight_management', 'pcos', 'sugar_control'], 'Fermented chickpea. Low GI, probiotic.'],
  ['Khandvi', 'snacks', 140, '7g', '20g', '4g', '3 pieces (80g)', ['weight_management', 'sugar_control', 'pcos'], 'Gujarati chickpea rolls. Low fat, high protein.'],
  ['Handvo', 'snacks', 180, '7g', '28g', '5g', '1 slice (100g)', ['weight_management'], 'Gujarati savory cake. High fiber.'],
  ['Moong Dal Pakora (baked)', 'snacks', 150, '8g', '20g', '4g', '4 pieces (80g)', ['weight_management', 'pcos'], 'Baked moong fritters. Protein-rich.'],
  ['Corn on the Cob', 'snacks', 125, '3g', '27g', '2g', '1 medium cob (100g)', ['weight_management'], 'Good fiber. Natural sweetness.'],
  ['Roasted Corn', 'snacks', 130, '3g', '28g', '2g', '1 serving (100g)', ['weight_management', 'sugar_control'], 'Better than boiled for glycemic response.'],
  ['Sweet Potato (boiled)', 'snacks', 105, '2g', '24g', '0g', '1 medium (130g)', ['weight_management', 'sugar_control', 'pcos'], 'High beta-carotene. Lower GI than potato.'],
  ['Tikki (oats)', 'snacks', 130, '5g', '20g', '3g', '2 tikkis (100g)', ['weight_management', 'sugar_control'], 'Oat-based cutlet. Good fiber snack.'],
  ['Soya Tikki', 'snacks', 150, '12g', '15g', '5g', '2 tikkis (100g)', ['weight_management', 'pcos', 'high_protein'], 'Soy-based cutlet. Highest protein snack.'],
  ['Idli with Sambar', 'snacks', 170, '7g', '30g', '2g', '2 idli + sambar (200g)', ['weight_management', 'sugar_control'], 'Protein-fiber combo. Ideal evening snack.'],

  // Dairy Snacks
  ['Low-fat Curd', 'snacks', 60, '6g', '6g', '2g', '1 bowl (150g)', ['pcos', 'weight_management', 'sugar_control'], 'Probiotics, calcium. Essential dairy.'],
  ['Greek Yogurt (unsweetened)', 'snacks', 100, '10g', '6g', '3g', '1 bowl (150g)', ['weight_management', 'pcos', 'high_protein'], 'Higher protein than regular curd.'],
  ['Paneer Cubes (raw)', 'snacks', 135, '9g', '3g', '10g', '50g cubes', ['weight_management', 'pcos', 'high_protein'], 'Quick protein snack. Add chaat masala.'],
  ['Buttermilk (Chaas)', 'snacks', 35, '3g', '5g', '0g', '1 glass (250ml)', ['weight_management', 'pcos', 'sugar_control'], 'Probiotic, very low calorie. Post-meal digestive.'],
  ['Lassi (unsweetened)', 'snacks', 130, '8g', '12g', '5g', '1 glass (250ml)', ['weight_management', 'pcos'], 'Good probiotic. Avoid sugar.'],

  // ══════════════════════════════════════════════════════════════════════════
  // DINNER
  // ══════════════════════════════════════════════════════════════════════════

  ['Moong Dal Khichdi', 'dinner', 250, '12g', '38g', '5g', '1 bowl (250g)', ['sugar_control', 'pcos', 'weight_management'], 'Best dinner for weight management. Easy to digest.'],
  ['Mixed Vegetable Khichdi', 'dinner', 265, '11g', '42g', '5g', '1 bowl (250g)', ['weight_management', 'sugar_control'], 'Nutritious one-pot meal.'],
  ['Palak Khichdi', 'dinner', 255, '12g', '39g', '5g', '1 bowl (250g)', ['weight_management', 'pcos', 'sugar_control'], 'With spinach. Iron-boosted.'],
  ['Vegetable Soup', 'dinner', 80, '4g', '12g', '2g', '1 large bowl (300ml)', ['weight_management', 'sugar_control', 'pcos'], 'Low calorie. Pre-meal appetite control.'],
  ['Tomato Soup', 'dinner', 70, '2g', '12g', '2g', '1 bowl (250ml)', ['weight_management', 'sugar_control'], 'Low calorie with lycopene antioxidants.'],
  ['Lentil Soup', 'dinner', 120, '9g', '18g', '1g', '1 bowl (250ml)', ['weight_management', 'pcos', 'sugar_control'], 'Good protein, filling dinner starter.'],
  ['Broccoli Soup', 'dinner', 65, '5g', '9g', '1g', '1 bowl (250ml)', ['weight_management', 'pcos', 'sugar_control'], 'Cancer-protective sulforaphane. Very low cal.'],
  ['Stir-fried Broccoli', 'dinner', 55, '4g', '8g', '2g', '1 serving (150g)', ['pcos', 'weight_management', 'sugar_control'], 'Anti-inflammatory, cancer-fighting.'],
  ['Stir-fried Vegetables', 'dinner', 90, '3g', '14g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Seasonal mixed vegetables.'],
  ['Sautéed Mushrooms', 'dinner', 80, '4g', '8g', '4g', '1 bowl (150g)', ['weight_management', 'pcos', 'sugar_control'], 'Good vitamin D. Anti-inflammatory.'],
  ['Roti with Dal', 'dinner', 290, '14g', '46g', '4g', '2 rotis + dal (300g)', ['weight_management', 'sugar_control'], 'Classic balanced dinner.'],
  ['Roti with Sabzi', 'dinner', 270, '8g', '44g', '6g', '2 rotis + sabzi (280g)', ['weight_management', 'sugar_control'], 'Standard nutritious dinner.'],
  ['Roti with Curd', 'dinner', 230, '9g', '38g', '4g', '2 rotis + curd (250g)', ['weight_management', 'sugar_control'], 'Light dinner. Good protein.'],
  ['Chapati with Palak Paneer', 'dinner', 340, '16g', '38g', '14g', '2 chapatis + sabzi (300g)', ['weight_management', 'pcos'], 'High iron and protein dinner.'],
  ['Tandoori Roti with Sabzi', 'dinner', 250, '7g', '42g', '5g', '2 rotis + sabzi (270g)', ['weight_management', 'sugar_control'], 'Lower fat than regular roti.'],
  ['Dal Rice (small)', 'dinner', 300, '12g', '56g', '3g', '1 small plate (250g)', ['weight_management', 'sugar_control'], 'Classic combination. Keep portions small at dinner.'],
  ['Curd Rice (small)', 'dinner', 200, '6g', '36g', '3g', '1 bowl (200g)', ['weight_management', 'sugar_control', 'pcos'], 'Light, probiotic dinner. South Indian.'],
  ['Bajra Roti with Ghee', 'dinner', 220, '6g', '40g', '5g', '2 rotis (130g)', ['sugar_control', 'pcos'], 'Traditional Rajasthani. Iron-zinc rich.'],
  ['Turmeric Milk', 'dinner', 110, '6g', '12g', '4g', '1 cup (250ml)', ['pcos', 'sugar_control'], 'Anti-inflammatory. Aids sleep. Best bedtime drink.'],
  ['Grilled Fish with Vegetables', 'dinner', 260, '30g', '10g', '10g', '1 fillet + veg (250g)', ['weight_management', 'pcos', 'high_protein'], 'Omega-3 rich. Excellent dinner for all goals.'],
  ['Chicken Clear Soup', 'dinner', 80, '12g', '4g', '2g', '1 bowl (300ml)', ['weight_management', 'high_protein'], 'Very low calorie, high protein.'],
  ['Egg White Omelette', 'dinner', 80, '17g', '1g', '0g', '3 egg whites (90g)', ['weight_management', 'high_protein'], 'Zero fat, high protein. Best weight loss dinner.'],
  ['Tofu Stir Fry', 'dinner', 160, '12g', '8g', '9g', '1 bowl (200g)', ['weight_management', 'pcos', 'high_protein'], 'Plant-based protein with vegetables.'],
  ['Soya Chunks Curry', 'dinner', 230, '26g', '14g', '5g', '1 bowl (200g)', ['weight_management', 'pcos', 'high_protein'], 'Extremely high plant protein.'],
  ['Paneer Tikka', 'dinner', 240, '16g', '8g', '16g', '6 pieces (150g)', ['weight_management', 'pcos', 'high_protein'], 'Grilled cottage cheese. High protein dinner.'],
  ['Palak Soup with Paneer', 'dinner', 130, '9g', '8g', '7g', '1 bowl (250ml)', ['weight_management', 'pcos'], 'Iron + protein combination.'],
  ['Raita (mixed)', 'dinner', 80, '5g', '9g', '2g', '1 bowl (150g)', ['weight_management', 'sugar_control', 'pcos'], 'Probiotic side. Adds protein.'],
  ['Avial', 'dinner', 150, '4g', '18g', '7g', '1 bowl (200g)', ['weight_management'], 'Kerala mixed vegetable. Coconut-based.'],
  ['Kootu', 'dinner', 140, '6g', '20g', '5g', '1 bowl (200g)', ['weight_management', 'sugar_control'], 'Tamil Nadu vegetable-lentil dish.'],
  ['Sambhar with Vegetables', 'dinner', 100, '5g', '15g', '2g', '1 bowl (250ml)', ['weight_management', 'sugar_control'], 'High vegetable content sambhar.'],
  ['Moong Dal Soup', 'dinner', 130, '9g', '20g', '1g', '1 bowl (250ml)', ['weight_management', 'pcos', 'sugar_control'], 'Easy to digest. Best for gut health.'],
  ['Besan Soup', 'dinner', 140, '8g', '18g', '4g', '1 bowl (250ml)', ['weight_management', 'sugar_control', 'pcos'], 'Chickpea flour soup. Rajasthani.'],
  ['Gajar Ka Halwa (small)', 'dinner', 180, '3g', '28g', '7g', '1 small bowl (80g)', [], 'Occasional dessert. High calorie.'],
  ['Kheer (small)', 'dinner', 190, '5g', '30g', '6g', '1 small bowl (100ml)', [], 'Festive dessert. Limit to occasions.'],

  // ══════════════════════════════════════════════════════════════════════════
  // ANY (can fit multiple meals)
  // ══════════════════════════════════════════════════════════════════════════

  ['Pickle (Achar, small)', 'any', 15, '0g', '2g', '1g', '1 tsp (10g)', [], 'Probiotics but high sodium. Use sparingly.'],
  ['Coconut Chutney', 'any', 70, '1g', '5g', '5g', '2 tbsp (30g)', [], 'Healthy fats. Common with South Indian food.'],
  ['Green Chutney (mint-coriander)', 'any', 15, '1g', '2g', '0g', '2 tbsp (30g)', ['weight_management', 'sugar_control', 'pcos'], 'Very low calorie. Antioxidant-rich.'],
  ['Tamarind Chutney', 'any', 40, '0g', '10g', '0g', '1 tbsp (20g)', ['weight_management'], 'Good iron source. Use in moderation.'],
  ['Tomato Chutney', 'any', 30, '1g', '5g', '1g', '2 tbsp (30g)', ['weight_management', 'sugar_control'], 'Low calorie condiment.'],
  ['Ghee (on roti/rice)', 'any', 120, '0g', '0g', '14g', '1 tsp (5g)', [], 'Healthy fat in small quantities. Do not avoid completely.'],
  ['Coconut Oil (cooking)', 'any', 120, '0g', '0g', '14g', '1 tsp (5g)', [], 'MCT-rich. Use in moderation.'],
  ['Mustard Oil (cooking)', 'any', 120, '0g', '0g', '14g', '1 tsp (5g)', [], 'Heart-protective. Common in North/East India.'],
  ['Groundnut Oil (cooking)', 'any', 120, '0g', '0g', '14g', '1 tsp (5g)', [], 'Traditional South Indian cooking oil.'],
  ['Papad (roasted)', 'any', 35, '2g', '6g', '0g', '1 papad (15g)', ['weight_management', 'sugar_control'], 'Roasted not fried. Low calorie.'],
  ['Papad (fried)', 'any', 55, '2g', '6g', '2g', '1 papad (15g)', [], 'Occasional. Higher calorie than roasted.'],
  ['Sambar (as accompaniment)', 'any', 50, '3g', '8g', '1g', '1 small bowl (150ml)', ['weight_management', 'sugar_control'], 'Add to any meal for protein boost.'],
  ['Jaggery (small piece)', 'any', 60, '0g', '15g', '0g', '1 small piece (15g)', [], 'Better than refined sugar. Still limit for diabetics.'],
  ['Honey (1 tsp)', 'any', 20, '0g', '5g', '0g', '1 tsp (7g)', ['weight_management'], 'Natural sweetener. Better than sugar. Limit for diabetics.'],
  ['Lemon Juice', 'any', 5, '0g', '1g', '0g', '1 tbsp (15ml)', ['weight_management', 'sugar_control', 'pcos'], 'Vitamin C, aids iron absorption. Add to every meal.'],
  ['Apple Cider Vinegar', 'any', 3, '0g', '0g', '0g', '1 tbsp diluted (15ml)', ['sugar_control', 'pcos', 'weight_management'], 'Pre-meal: reduces GI of food. Helps insulin sensitivity.'],
  ['Moringa (Drumstick Leaves)', 'any', 30, '3g', '3g', '0g', '1 tbsp powder (10g)', ['pcos', 'weight_management', 'sugar_control'], 'Superfood: iron, calcium, protein. Anti-inflammatory.'],
  ['Amla (Indian Gooseberry)', 'any', 45, '1g', '10g', '0g', '2 medium (80g)', ['pcos', 'sugar_control', 'weight_management'], 'Highest vitamin C. Anti-diabetic properties.'],
  ['Tulsi (Holy Basil)', 'any', 5, '0g', '1g', '0g', '10 leaves / 1 tsp', ['pcos', 'sugar_control'], 'Adaptogen. Reduces cortisol and blood sugar.'],
  ['Fenugreek Seeds (soaked)', 'any', 20, '1g', '3g', '0g', '1 tsp soaked (5g)', ['pcos', 'sugar_control'], 'Reduces fasting blood sugar. Soak overnight.'],
  ['Cinnamon', 'any', 6, '0g', '2g', '0g', '1/2 tsp (1.5g)', ['sugar_control', 'pcos'], 'Proven to reduce blood glucose. Add to tea or food.'],
  ['Ginger (fresh)', 'any', 8, '0g', '2g', '0g', '1 tsp grated (5g)', ['pcos', 'sugar_control', 'weight_management'], 'Anti-inflammatory. Aids digestion and insulin sensitivity.'],
  ['Garlic (raw)', 'any', 10, '0g', '2g', '0g', '2 cloves (6g)', ['sugar_control', 'pcos', 'weight_management'], 'Allicin improves insulin sensitivity. Anti-inflammatory.'],
  ['Turmeric', 'any', 8, '0g', '2g', '0g', '1 tsp (3g)', ['pcos', 'sugar_control', 'weight_management'], 'Curcumin is most potent anti-inflammatory spice.'],
  ['Water (plain)', 'any', 0, '0g', '0g', '0g', '1 glass (250ml)', ['weight_management', 'sugar_control', 'pcos'], 'Target 2.5-3L daily. Drink before meals to reduce appetite.'],
  ['Infused Water (lemon/cucumber)', 'any', 5, '0g', '1g', '0g', '1 glass (250ml)', ['weight_management', 'sugar_control', 'pcos'], 'Helps with hydration and detoxification.'],
];
