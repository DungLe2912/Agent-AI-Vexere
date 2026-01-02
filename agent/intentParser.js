export async function detectIntent(openai, question) {
  const prompt = `
Extract structured intent.

Return JSON ONLY:
{
  intent: "PRICING" | "AVAILABILITY" | "ANALYTICS",
  metric?: "SUM" | "COUNT",
  field?: "available_seats",
  origin?: string,
  destination?: string,
  date?: "YYYY-MM-DD",
  startDate?: "YYYY-MM-DD",
  endDate?: "YYYY-MM-DD",
  status?: "active" | "cancelled",
  priceFilter?: {
    operator: "<" | "<=" | ">" | ">=",
    value: number
  },
  limit?: number
}

Rules:
- "tổng số", "tổng cộng" => ANALYTICS + metric SUM
- "bao nhiêu chuyến", "số chuyến" => metric COUNT
- "từ ngày X đến ngày Y" => startDate + endDate
- "ngày X" => date
- "đi Đà Lạt" => destination = "Đà Lạt"

Question:
"${question}"
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content.replace(/```json|```/g, ""));
}
