export async function detectIntent(openai, question) {
  const prompt = `
Phân tích câu hỏi và trả về intent phù hợp.

Return JSON ONLY:
{
  type: "GREETING" | "HELP" | "QUERY",
  response?: string,
  intent?: "PRICING" | "AVAILABILITY" | "ANALYTICS",
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

Rules for type:
- GREETING: Lời chào đơn giản (hi, hello, chào, hey...) => cần response
- HELP: Hỏi hướng dẫn, agent làm gì, cách dùng... => cần response
- QUERY: Câu hỏi cần tra database => cần intent và các field khác

Rules for QUERY intent:
- "tổng số", "tổng cộng" => ANALYTICS + metric SUM
- "bao nhiêu chuyến", "số chuyến" => ANALYTICS + metric COUNT
- "từ ngày X đến ngày Y" => startDate + endDate
- "ngày X" => date
- "đi Đà Lạt" => destination = "Đà Lạt"
- Hỏi về giá vé => PRICING
- Hỏi về lịch trình, chuyến xe còn chỗ => AVAILABILITY

Question:
"${question}"
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content.replace(/```json|```/g, ""));
}
