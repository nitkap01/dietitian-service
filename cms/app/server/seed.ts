import postgres from 'postgres';
import { SEED_CONFIG } from './seed.config';
import { INDIAN_MEALS } from './meals-data';

const FIRST_NAMES_F = ['Priya','Ananya','Meena','Kavya','Sneha','Pooja','Divya','Ritu','Sunita','Rekha','Lata','Geetha','Nisha','Deepa','Sonal','Rucha','Swati','Pallavi','Manisha','Rohini','Jyoti','Usha','Padma','Shalini','Preeti','Bharti','Anita','Sarla','Kamla','Veena','Rashmi','Shruti','Preethi','Nandita','Aarti','Komal','Anjali','Smita','Radha','Hema','Nandini','Tanvi','Bhavna','Charulata','Deepika','Geeta','Indu','Kavitha','Lalitha','Mamta'];
const FIRST_NAMES_M = ['Rajesh','Karthik','Suresh','Vikram','Amit','Rahul','Sanjay','Mukesh','Ravi','Arun','Naveen','Deepak','Mahesh','Venkat','Anand','Mohan','Girish','Harish','Sachin','Nikhil','Rohit','Vivek','Vishal','Kunal','Tarun','Ajay','Siddharth','Ramesh','Dinesh','Ganesh','Krishnan','Ashok','Naresh','Sunil','Vijay','Pavan','Manish','Gaurav','Pradeep','Umesh','Santosh','Jayesh','Hitesh','Kamlesh','Nilesh','Rupesh','Yashwant','Yogesh','Bhaskar','Chetan'];
const LAST_NAMES = ['Sharma','Patel','Kumar','Singh','Gupta','Rao','Joshi','Verma','Nair','Iyer','Reddy','Menon','Pillai','Desai','Shah','Mehta','Agarwal','Kapoor','Malhotra','Bhatt','Mishra','Tiwari','Pandey','Dubey','Yadav','Saxena','Srivastava','Bhatia','Chopra','Sethi','Khanna','Tandon','Anand','Bose','Chatterjee','Mukherjee','Dutta','Banerjee','Ghosh','Sen','Naidu','Hegde','Pai','Shetty','Kamath','Kulkarni','Jain','Choudhary','Tripathi','Chauhan'];
const INACTIVE_REASONS = ['Relocated to another city','Payment stopped — follow-up pending','Paused due to pregnancy','Travel — will resume next month','Financial constraints','Shifted to another dietitian','Health complications — referred to doctor','Personal reasons'];
const CLIENT_NOTES: Record<string, string[]> = {
  weight_management: ['Goal: Lose 10kg in 6 months. Very motivated.','Post-pregnancy weight loss. 3 months postpartum.','Desk job, no exercise routine. Needs lifestyle change.','Wedding in 4 months. High motivation.','Thyroid on medication. Slow metabolism.','Stress eating pattern. Needs mindful eating guidance.','Lost 5kg before but regained. Second attempt.','PCOD + overweight. Needs careful planning.'],
  sugar_control: ['Type 2 diabetic on metformin. HbA1c: 7.8','Pre-diabetic. Fasting sugar 110-120. Early intervention.','Family history of diabetes. Preventive plan.','HbA1c: 8.2. Doctor referred to dietitian.','Type 2 + overweight. Dual goal.','Insulin-resistant. HOMA-IR > 2.5','Post-gestational diabetes management.','Blood sugar 140 post-meal. Borderline.'],
  pcos: ['Diagnosed with PCOS. Irregular periods. Needs low-glycemic diet.','PCOS + insulin resistance. Metformin prescribed.','PCOS-related weight gain. Hormonal imbalance.','Trying to conceive. PCOS management critical.','Acne + PCOS. Anti-inflammatory diet needed.','PCOS + high androgens. Low-GI, high-protein plan.','Newly diagnosed. Just starting treatment.','PCOS managed well before. Relapse due to stress.'],
  other: ['General wellness and muscle gain. Athletic background.','Marathon training nutrition. High performance focus.','Post-surgery recovery nutrition.','Senior citizen. Focus on bone health and immunity.','Vegetarian athlete. Protein planning needed.','IBS management through diet.','High cholesterol and BP. Cardiac diet required.','Teenage nutrition guidance. Growth phase.'],
};

function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rnd(min: number, max: number) { return Math.round(Math.random() * (max - min) + min); }
function rndF(min: number, max: number, d = 1) { return parseFloat((Math.random() * (max - min) + min).toFixed(d)); }
function daysAgo(n: number) { return new Date(Date.now() - n * 86_400_000).toISOString(); }
function dateStr(iso: string) { return iso.split('T')[0]; }

const OCR = {
  weight_management: [
    { breakfast: { items: ['Oats Porridge','Boiled Eggs (2)','Green Tea'], calories: 295, protein: '17g', carbs: '28g', fat: '11g' }, lunch: { items: ['Brown Rice','Moong Dal','Mixed Vegetable Sabzi','Cucumber Raita'], calories: 460, protein: '20g', carbs: '68g', fat: '6g' }, snacks: { items: ['Apple','Almonds (10)'], calories: 175, protein: '4g', carbs: '24g', fat: '8g' }, dinner: { items: ['Moong Dal Khichdi','Stir-fried Broccoli','Vegetable Soup'], calories: 390, protein: '16g', carbs: '50g', fat: '7g' }, totalCalories: 1320, notes: 'Avoid sugar and processed foods. Drink 3L water daily.' },
    { breakfast: { items: ['Moong Dal Chilla','Low-fat Curd','Green Tea'], calories: 225, protein: '16g', carbs: '28g', fat: '5g' }, lunch: { items: ['2 Multigrain Roti','Rajma Curry','Green Salad','Buttermilk'], calories: 470, protein: '18g', carbs: '65g', fat: '8g' }, snacks: { items: ['Roasted Chana','Pomegranate'], calories: 200, protein: '8g', carbs: '37g', fat: '3g' }, dinner: { items: ['2 Chapati','Palak Sabzi','Dal Tadka'], calories: 380, protein: '14g', carbs: '52g', fat: '7g' }, totalCalories: 1275, notes: 'High fiber plan. Walk 30 min daily.' },
  ],
  sugar_control: [
    { breakfast: { items: ['Pesarattu','Vegetable Upma','Buttermilk'], calories: 330, protein: '14g', carbs: '48g', fat: '6g' }, lunch: { items: ['2 Jowar Roti','Toor Dal','Bhindi Masala','Kachumber Salad'], calories: 420, protein: '16g', carbs: '54g', fat: '8g' }, snacks: { items: ['Guava','Pumpkin Seeds'], calories: 215, protein: '10g', carbs: '19g', fat: '13g' }, dinner: { items: ['Vegetable Khichdi','Curd','Vegetable Soup'], calories: 350, protein: '12g', carbs: '48g', fat: '5g' }, totalCalories: 1315, notes: 'Low GI foods only. Avoid sugar completely.' },
    { breakfast: { items: ['Ragi Porridge','Boiled Egg','Green Tea'], calories: 275, protein: '12g', carbs: '40g', fat: '6g' }, lunch: { items: ['Millets','Chana Dal','Karela Sabzi','Cucumber Raita'], calories: 400, protein: '18g', carbs: '52g', fat: '7g' }, snacks: { items: ['Jamun','Roasted Chana','Buttermilk'], calories: 195, protein: '8g', carbs: '32g', fat: '3g' }, dinner: { items: ['2 Bajra Roti','Moong Dal','Mixed Veg'], calories: 360, protein: '13g', carbs: '54g', fat: '6g' }, totalCalories: 1230, notes: 'Millet-based plan. Soak fenugreek seeds overnight.' },
  ],
  pcos: [
    { breakfast: { items: ['Flaxseed Smoothie','Methi Paratha','Low-fat Curd'], calories: 445, protein: '16g', carbs: '55g', fat: '16g' }, lunch: { items: ['Quinoa','Chole Curry','Sautéed Spinach','Cucumber Raita'], calories: 490, protein: '22g', carbs: '65g', fat: '9g' }, snacks: { items: ['Walnuts','Pomegranate','Green Tea'], calories: 195, protein: '4g', carbs: '22g', fat: '13g' }, dinner: { items: ['Soya Chunks Curry','2 Roti','Vegetable Soup','Turmeric Milk'], calories: 480, protein: '28g', carbs: '52g', fat: '12g' }, totalCalories: 1610, notes: 'Anti-inflammatory diet. Avoid dairy except curd.' },
    { breakfast: { items: ['Moong Dal Chilla','Sprouts Bowl','Coconut Water'], calories: 255, protein: '19g', carbs: '31g', fat: '4g' }, lunch: { items: ['Brown Rice','Palak Paneer','Kachumber Salad','Buttermilk'], calories: 510, protein: '20g', carbs: '60g', fat: '18g' }, snacks: { items: ['Apple','Almonds','Pumpkin Seeds'], calories: 240, protein: '7g', carbs: '24g', fat: '14g' }, dinner: { items: ['Tofu Stir Fry','2 Roti','Lentil Soup'], calories: 460, protein: '24g', carbs: '54g', fat: '14g' }, totalCalories: 1465, notes: 'Phytoestrogen-rich foods. Exercise 45 min/day.' },
  ],
  other: [
    { breakfast: { items: ['Masala Omelette','Multigrain Toast','Banana'], calories: 520, protein: '28g', carbs: '52g', fat: '20g' }, lunch: { items: ['Chicken Breast','Brown Rice','Mixed Salad','Curd'], calories: 560, protein: '38g', carbs: '52g', fat: '10g' }, snacks: { items: ['Greek Yogurt','Mixed Nuts'], calories: 290, protein: '14g', carbs: '28g', fat: '14g' }, dinner: { items: ['Paneer Tikka','2 Roti','Dal','Sabzi'], calories: 560, protein: '30g', carbs: '55g', fat: '22g' }, totalCalories: 1930, notes: 'Higher calorie plan for active individuals.' },
    { breakfast: { items: ['Oats Porridge','Sprouts','Boiled Eggs (2)'], calories: 380, protein: '22g', carbs: '42g', fat: '12g' }, lunch: { items: ['Quinoa','Rajma','Roasted Vegetables','Raita'], calories: 490, protein: '20g', carbs: '70g', fat: '8g' }, snacks: { items: ['Sattu Sharbat','Apple'], calories: 310, protein: '14g', carbs: '38g', fat: '10g' }, dinner: { items: ['Fish Curry','Brown Rice','Green Salad'], calories: 420, protein: '30g', carbs: '44g', fat: '10g' }, totalCalories: 1600, notes: 'Balanced wellness plan. Focus on whole foods.' },
  ],
};

type OcrTemplate = (typeof OCR.weight_management)[0];
function adjustCalories(o: OcrTemplate): OcrTemplate {
  const f = 0.9 + Math.random() * 0.2;
  return { ...o, breakfast: { ...o.breakfast, calories: Math.round(o.breakfast.calories * f) }, lunch: { ...o.lunch, calories: Math.round(o.lunch.calories * f) }, snacks: { ...o.snacks, calories: Math.round(o.snacks.calories * f) }, dinner: { ...o.dinner, calories: Math.round(o.dinner.calories * f) }, totalCalories: Math.round(o.totalCalories * f) };
}

export async function seedDatabase(sql: postgres.Sql) {
  const { clientCount, mealCount, weightHistoryMonths, inactiveFraction, unpaidFraction } = SEED_CONFIG;

  // ── Meals ─────────────────────────────────────────────────────────────────
  const meals = INDIAN_MEALS.slice(0, mealCount);
  // Insert in chunks of 50
  for (let i = 0; i < meals.length; i += 50) {
    const chunk = meals.slice(i, i + 50);
    await sql`
      INSERT INTO meal_items ${sql(chunk.map(([name, category, calories, protein, carbs, fat, serving, tags, notes]) => ({
        name, category, calories_per_serving: calories, protein, carbs, fat,
        serving_size: serving, health_tags: JSON.stringify(tags), notes,
      })))}
    `;
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  const pkgDefs = [
    { name: 'Weight Management — Basic', description: 'Monthly diet plan, weekly check-ins, WhatsApp support.', category: 'weight_management', price: 5000, duration_months: 1 },
    { name: 'Weight Management — Premium', description: '3-month program with bi-weekly calls and full meal planning.', category: 'weight_management', price: 12000, duration_months: 3 },
    { name: 'PCOS Management', description: 'Anti-inflammatory diet, hormone-balancing foods, lifestyle coaching.', category: 'pcos', price: 4500, duration_months: 1 },
    { name: 'PCOS — 3 Month Plan', description: 'Comprehensive 3-month hormonal balance program.', category: 'pcos', price: 11000, duration_months: 3 },
    { name: 'Diabetes & Sugar Control', description: 'Evidence-based glycemic management with blood sugar tracking.', category: 'sugar_control', price: 4000, duration_months: 1 },
    { name: 'Diabetes — Intensive', description: '3-month HbA1c reduction program with monthly lab review.', category: 'sugar_control', price: 10000, duration_months: 3 },
    { name: 'General Wellness', description: 'Balanced nutrition for overall health, energy and immunity.', category: 'other', price: 3500, duration_months: 1 },
    { name: 'Sports Nutrition', description: 'Performance and recovery nutrition for athletes.', category: 'other', price: 6000, duration_months: 1 },
  ];
  const insertedPkgs = await sql`INSERT INTO packages ${sql(pkgDefs)} RETURNING id, category, price, duration_months`;
  const pkgMap: Record<string, { id: number; price: number; months: number }[]> = { weight_management: [], pcos: [], sugar_control: [], other: [] };
  for (const p of insertedPkgs) pkgMap[p.category].push({ id: p.id, price: p.price, months: p.duration_months });

  // ── Clients ───────────────────────────────────────────────────────────────
  const usedEmails = new Set<string>();

  for (let i = 0; i < clientCount; i++) {
    const gender = Math.random() < 0.70 ? 'female' : 'male';
    const firstName = gender === 'female' ? pick(FIRST_NAMES_F) : pick(FIRST_NAMES_M);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;

    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    if (usedEmails.has(email)) email = `u${i}.${lastName.toLowerCase()}@example.com`;
    usedEmails.add(email);

    const phone = `+91-98${rnd(10000000, 99999999)}`;
    const age = rnd(18, 62);
    const r = Math.random();
    const health_goal = r < 0.40 ? 'weight_management' : r < 0.65 ? 'pcos' : r < 0.90 ? 'sugar_control' : 'other';
    const isInactive = Math.random() < inactiveFraction;
    const status = isInactive ? 'inactive' : 'active';
    const inactive_reason = isInactive ? pick(INACTIVE_REASONS) : null;
    const notes = pick(CLIENT_NOTES[health_goal]);
    const joinedDaysAgo = rnd(1, 180);
    const joinedAt = daysAgo(joinedDaysAgo);

    const [client] = await sql`
      INSERT INTO clients (name, email, phone, age, gender, health_goal, status, inactive_reason, notes, created_at, updated_at)
      VALUES (${name}, ${email}, ${phone}, ${age}, ${gender}, ${health_goal}, ${status}, ${inactive_reason}, ${notes}, ${joinedAt}, ${joinedAt})
      RETURNING id
    `;
    const clientId = client.id as number;

    // Package
    const pkg = pick(pkgMap[health_goal]);
    const startDate = dateStr(joinedAt);
    const endDate = dateStr(new Date(Date.parse(joinedAt) + pkg.months * 30 * 86400000).toISOString());
    await sql`INSERT INTO client_packages (client_id, package_id, start_date, end_date, is_active) VALUES (${clientId}, ${pkg.id}, ${startDate}, ${endDate}, ${isInactive ? 0 : 1})`;

    // Weight metrics
    const baseWeight = health_goal === 'weight_management' ? rndF(65, 95) : health_goal === 'sugar_control' ? rndF(70, 95) : health_goal === 'pcos' ? rndF(55, 80) : rndF(60, 85);
    const weeklyChange = health_goal === 'weight_management' ? rndF(-0.8, -0.2) : gender === 'male' && health_goal === 'other' ? rndF(0.1, 0.4) : rndF(-0.4, 0.1);
    const totalWeeks = Math.min(weightHistoryMonths * 4, Math.floor(joinedDaysAgo / 7));
    if (totalWeeks > 0) {
      const metricRows = Array.from({ length: totalWeeks }, (_, w) => ({
        client_id: clientId,
        weight_kg: parseFloat((baseWeight + weeklyChange * (totalWeeks - w) + rndF(-0.5, 0.5)).toFixed(1)),
        recorded_at: daysAgo((totalWeeks - w) * 7),
        source: w % 3 === 0 ? 'email' : 'manual',
      }));
      await sql`INSERT INTO health_metrics ${sql(metricRows)}`;
    }

    // Payments
    const monthsSubscribed = Math.ceil(joinedDaysAgo / 30);
    const payRows = [];
    for (let m = 0; m < Math.min(monthsSubscribed, pkg.months); m++) {
      const dueAt = daysAgo((monthsSubscribed - m) * 30);
      const isLast = m === monthsSubscribed - 1 && !isInactive;
      const payStatus = isLast && Math.random() < unpaidFraction ? (Math.random() < 0.5 ? 'pending' : 'unpaid') : 'paid';
      payRows.push({ client_id: clientId, package_id: pkg.id, amount: pkg.price, status: payStatus, notes: `Month ${m + 1} payment`, paid_at: payStatus === 'paid' ? dueAt : null, due_date: dateStr(dueAt), created_at: dueAt });
    }
    if (payRows.length) await sql`INSERT INTO payments ${sql(payRows)}`;

    // Notification
    if (!isInactive) {
      await sql`INSERT INTO notifications (client_id, type, frequency, message, next_send_at, is_active, created_at) VALUES (${clientId}, 'health_metric_request', 'weekly', ${`Hi ${firstName}! Please share your weight update for this week. Keep it up! 💪`}, ${daysAgo(-7)}, 1, ${joinedAt})`;
    }

    // Diet plan (70% of clients)
    if (Math.random() < 0.7) {
      const goalLabel: Record<string, string> = { weight_management: 'Weight Loss', sugar_control: 'Diabetic', pcos: 'PCOS', other: 'Wellness' };
      const planCreated = daysAgo(rnd(7, joinedDaysAgo));
      const ocr = pick(OCR[health_goal as keyof typeof OCR]);
      const [plan] = await sql`INSERT INTO diet_plans (client_id, title, created_at) VALUES (${clientId}, ${`${firstName} ${goalLabel[health_goal]} Plan`}, ${planCreated}) RETURNING id`;
      await sql`INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog, created_at) VALUES (${plan.id}, 1, ${JSON.stringify(ocr)}, 'Initial diet plan', ${planCreated})`;
      if (Math.random() < 0.4) {
        await sql`INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog, created_at) VALUES (${plan.id}, 2, ${JSON.stringify(adjustCalories(ocr))}, 'Adjusted portions based on progress', ${daysAgo(rnd(1, 14))})`;
      }
    }

    // WhatsApp (50% of active clients)
    if (!isInactive && Math.random() < 0.5) {
      const latestW = parseFloat((baseWeight + weeklyChange + rndF(-0.3, 0.3)).toFixed(1));
      const dAgo = rnd(1, 7);
      await sql`INSERT INTO whatsapp_messages (client_id, direction, message, phone_number, is_read, received_at, created_at) VALUES
        (${clientId}, 'outbound', ${`Hi ${firstName}! Please share your weight for this week. 💪`}, ${phone}, 1, ${daysAgo(dAgo + 1)}, ${daysAgo(dAgo + 1)}),
        (${clientId}, 'inbound',  ${`Hi! Today's weight is ${latestW} kg.`}, ${phone}, 1, ${daysAgo(dAgo)}, ${daysAgo(dAgo)})`;
    }

    // Activity
    await sql`INSERT INTO activity_log (type, description, client_name, created_at) VALUES ('client_added', ${`New client onboarded for ${health_goal.replace(/_/g, ' ')} program`}, ${name}, ${joinedAt})`;
  }
}
