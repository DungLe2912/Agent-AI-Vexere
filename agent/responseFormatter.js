export async function formatResponse(openai, intent, queryResult) {
  const prompt = `
Bạn là trợ lý đặt vé xe thông minh. Hãy trả lời bằng tiếng Việt tự nhiên, thân thiện.

Intent người dùng:
${JSON.stringify(intent, null, 2)}

Kết quả từ database:
${JSON.stringify(queryResult, null, 2)}

Hãy phân tích và trả lời:
- Nếu KHÔNG CÓ kết quả (mảng rỗng): Giải thích rõ ràng tại sao không tìm thấy (có thể do ngày đã qua, chuyến đã hủy, không có tuyến này...) và gợi ý thay thế
- Nếu CÓ kết quả: Tóm tắt thông tin chuyến đi một cách rõ ràng, dễ hiểu
- Với ANALYTICS: Đưa ra con số cụ thể và giải thích ý nghĩa
- Luôn lịch sự, nhiệt tình

Trả lời ngắn gọn (2-4 câu):
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim();
}
