import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ocrData, clientGoal, clientName } = body;

    if (!ocrData) {
      return NextResponse.json({ error: 'Diet plan data is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return mock analysis if no API key configured
      return NextResponse.json({
        analysis: generateMockAnalysis(ocrData, clientGoal),
        source: 'mock',
      });
    }

    const client = new Anthropic({ apiKey });

    const dietSummary = formatDietForPrompt(ocrData);
    const goalLabel = {
      weight_management: 'weight management / weight loss',
      sugar_control: 'diabetes and blood sugar control',
      pcos: 'PCOS management',
      other: 'general wellness',
    }[clientGoal as string] || 'general wellness';

    const prompt = `You are a clinical nutritionist reviewing a diet plan for a client named ${clientName || 'the client'} whose goal is ${goalLabel}.

Here is their daily diet plan:

${dietSummary}

Please provide a concise analysis with:
1. **Pros** - 3-4 specific strengths of this diet plan for their goal
2. **Cons / Concerns** - 2-3 areas of concern or nutritional gaps
3. **Recommendations** - 3-4 actionable suggestions to improve the plan

Keep each point brief (1-2 sentences). Be specific and clinically relevant. Format your response clearly with these three sections.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ analysis: text, source: 'claude' });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json({ error: 'Failed to analyze diet plan' }, { status: 500 });
  }
}

function formatDietForPrompt(ocrData: Record<string, unknown>): string {
  const lines: string[] = [];
  const meals = ['breakfast', 'lunch', 'snacks', 'dinner'];

  for (const meal of meals) {
    const m = ocrData[meal] as { items?: string[]; calories?: number; protein?: string; carbs?: string; fat?: string } | undefined;
    if (m) {
      lines.push(`${meal.charAt(0).toUpperCase() + meal.slice(1)}: ${(m.items || []).join(', ')} (${m.calories || 0} kcal | P:${m.protein} C:${m.carbs} F:${m.fat})`);
    }
  }

  if (ocrData.totalCalories) lines.push(`\nTotal Daily Calories: ${ocrData.totalCalories} kcal`);
  if (ocrData.notes) lines.push(`Notes: ${ocrData.notes}`);

  return lines.join('\n');
}

function generateMockAnalysis(ocrData: Record<string, unknown>, goal: string): string {
  const totalCal = (ocrData.totalCalories as number) || 1400;
  const goalText = {
    weight_management: 'weight loss',
    sugar_control: 'blood sugar management',
    pcos: 'PCOS management',
    other: 'general wellness',
  }[goal] || 'wellness';

  return `**Pros**
• Good caloric range (${totalCal} kcal/day) is appropriate for ${goalText} goals — creates a modest deficit without being too restrictive.
• Includes high-fiber foods like dal, vegetables, and whole grains which support satiety and gut health.
• Well-distributed across 4 meals, preventing long gaps that can lead to overeating.
• Protein is spread throughout the day which supports muscle preservation during weight loss.

**Cons / Concerns**
• Omega-3 fatty acid intake appears low — no fish, chia seeds, or flaxseeds visible in the plan which are important for hormonal balance.
• Dinner may have relatively high carbohydrates for evening when metabolic rate is lower; consider shifting some carbs to lunch.
• Snack options could be more protein-focused to better control hunger between meals.

**Recommendations**
• Add 1 tsp flaxseeds or chia seeds to morning smoothie or curd for omega-3 and fiber boost.
• Replace dinner roti with a lighter option like soup + small salad 2-3 times per week.
• Include a protein-rich evening snack like roasted chana or a small handful of mixed nuts to stabilize blood sugar overnight.
• Ensure adequate water intake (2.5–3L daily) — consider adding a reminder as water intake directly affects metabolism.`;
}
