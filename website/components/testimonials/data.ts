// Client messages transcribed from WhatsApp screenshots (website/media, 1 Oct 2026) plus Google reviews.
// Names of WhatsApp clients are left out for privacy; their wording is kept as they typed it.

export type Topic = "weight" | "pcos" | "sugar" | "skin" | "confidence" | "google";

/** What improved for the client: a headline and a short detail. */
export type Highlight = [string, string];

export type WallItem =
  | { type: "thread"; topic: Topic; highlight: Highlight; messages: string[]; reply: string | null }
  | { type: "tile"; big: string; unit: string; line: string }
  | { type: "google"; name: string; initials: string; color: string; highlight: Highlight; text: string };

export const TOPIC_LABEL: Record<Topic, string> = {
  weight: "Weight loss",
  pcos: "PCOS & periods",
  sugar: "Blood sugar",
  skin: "Skin & hair",
  confidence: "Confidence",
  google: "Google review",
};

const thread = (topic: Topic, highlight: Highlight, messages: string[], reply: string | null): WallItem => ({
  type: "thread", topic, highlight, messages, reply,
});
const tile = (big: string, unit: string, line: string): WallItem => ({ type: "tile", big, unit, line });
const google = (name: string, initials: string, color: string, highlight: Highlight, text: string): WallItem => ({
  type: "google", name, initials, color, highlight, text,
});

export const WALL_ITEMS: WallItem[] = [
  thread("weight", ["8 kg lighter", "in about 2 months, no food banned"], [
    "I have shredded about 8 kgs in about 2 months. I genuinely had a great experience with you.",
    "The best part about your diet plans is that you do not restrict or tell us to completely avoid food rather you just ask to take them in small portions. ❤️❤️",
  ], "Thankyou for your lovely words and believing in me 😇"),
  thread("pcos", ["11 kg lighter with PCOS", "fits into 7-year-old jeans"], [
    "With PCOS, I never thought I would loose any weight however slowly and steadily lost 11 kgs",
    "Inches loss has been magnificent – now able to fit into my 7 yrs old jeans",
  ], "Thanks for your lovely words ❤️"),
  tile("5.2", "kg", "lost in 28 days"),
  thread("weight", ["18 kg lighter", "98 kg → 80 kg"], [
    "Thanks ma'am for the constant support you had given to me as I came down from 98 kg to 80 kg. Never thought of it but we did it. 💪",
  ], "Completely your efforts… I was there to guide you"),
  thread("pcos", ["Periods on time", "much less pain, hormones balancing"], [
    "Just wanted to inform you that i got my period on time ✨",
    "it's not even paining like it used to. Really feel that my hormones are balancing",
  ], "❤️❤️ happy to know that"),
  google("Poonam Singh", "PS", "#00897B", ["Walking properly again", "after post-C-section deficiencies"],
    "I wasn't able to walk properly due to nutritional deficiencies after my C-section. She always listens to her patients first and understands their needs. For me, she is my saviour."),
  thread("weight", ["Trouser size 44 → 34", "from 42–44 down to 34"], [
    "I used to wear 42 or 44 size trouser. Now even 34 fits.",
  ], "Glad to hear that 😇👍"),
  thread("sugar", ["Blood sugar in range", "all blood test levels normal"], [
    "Just did my blood tests today, my levels are all within normal range.",
    "Looks like treatment and diet are working, Blood sugar also within limit 🙏",
  ], "Really happy to know abt it 😇"),
  thread("weight", ["4.4 kg lighter", "in 27 days"], ["Today's weight is 90.3", "All thanks to u . 🙏🙏"], "Completely ur dedication"),
  thread("confidence", ["Loving the wedding look", "happy with every photo"], [
    "Im in love with my look during the wedding functions……",
    "each time I appreciate my own pic, I can't help remembering you and thanking you.",
  ], "Thankyou so much for your kind words 🙏🙏"),
  tile("16.5", "kg", "lost in 3 months"),
  thread("skin", ["Jawline showing", "less hair fall"], [
    "I can clearly see my jawline coming. And even my hairfall has reduced",
  ], "👍❤️ so happy to know abt it"),
  thread("weight", ["10.3 kg lighter", "97.7 → 87.4 kg in 2 months"], [
    "I appreciate your encouragement and assistance, which have helped me successfully decrease my weight from 97.70 to 87.40 in the span of two months.",
    "This has been a fulfilling journey that required dedication and self-discipline, and I truly enjoyed it.",
  ], null),
  google("Himanshi Kataria", "HK", "#F57F17", ["Enjoyed the diet", "and a healthier lifestyle"],
    "If you have any kind of problem like PCOD, thyroid, etc., she'll help you get a healthy, slim body and a healthier lifestyle. I enjoyed the diet because there's something in her plans that you actually enjoy."),
  thread("pcos", ["Periods regular again", "credits the diet plan"], [
    "Bt my periods are regular now", "Thanks to you 🥰", "Its because of your diets ❤️",
  ], "I am just there to guide you … completely your efforts 🙌❤️"),
  thread("weight", ["10 kg lighter", "now 73.6 kg, 10 more to go"], [
    "Today I checked my weight it's 73.6. 10 Kgs Drop. Another 10 to go",
    "Please Keep Holding Me Like You have and help me loose another 10",
  ], "We will do it 🎉"),
  thread("confidence", ["Confidence up", "“gained so much confidence”"], [
    "But u r the best i have gained so much confidence because of u",
  ], "How sweet of you… Thanks for believing in Me and for your lovely words ❤️🫶"),
  thread("weight", ["17.55 kg lighter", "2 sizes down, 3XL → XL"], [
    "Checked my weight. It's 82.55. And 17.55 kgs overall.",
    "And yes, I'm 2 sizes down. Earlier it was 3xl, now Xl",
  ], "Amazing 👌😇"),
  tile("12.6", "kg", "lost in 2.5 months"),
  thread("weight", ["A size down", "jeans and kurtas now baggy"], [
    "Old clothes are so loose. Literally I need to give them to tailor.",
    "My jeans look so baggy and even my kurtas.",
  ], "Wow….. happy to know that 👍😇"),
  thread("weight", ["5.3 kg lighter", "in 28 days, while travelling"], [
    "It could have been more if I wouldn't have cheated over the weekends",
  ], "Even d traveling was there 👍"),
  google("Sheena Gupta", "SG", "#C2185B", ["Habits that stick", "simple home-cooked meals"],
    "She focused on balanced nutrition instead of quick fixes. The meal suggestions included simple, home-based foods, which made it easy to stay consistent. Highly recommended for sustainable results."),
  thread("weight", ["Others noticed", "old sweater fits loose"], [
    "Btw old sweater fits loose. And everyone said that I have lost weight. Hehe", "All thanks to you ❤️❤️",
  ], "Sooooo happy to hear that…. keep it up ❤️"),
  thread("weight", ["Into the 70s", "clothes 3XL → 2XL"], [
    "Finally in 70s", "clothes size has also reduced from 3xl to 2xl or xl in some brands",
  ], "Amazing … glad to know 🙌👏"),
  google("Nishtha Puri", "NP", "#2D6B4F", ["6 kg lighter", "with everyday diet plans"],
    "I would highly recommend Ritika for her superb everyday diet plans, customised to suit your requirements and routine. I've already lost 6 kg."),
];
