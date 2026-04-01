const BOOKS = [
  {
    id: 1,
    title: "Generative AI Design Patterns",
    author: "Valliappa Lakshmanan",
    description: "Design patterns for generative AI",
    original_link: "https://example.com/book1.pdf",
    translations: [
      { lang: "🇷🇺 Русский", url: "https://example.com/book1_ru.pdf" },
      { lang: "🇪🇸 Español", url: "https://example.com/book1_es.pdf" },
    ],
    category: "AI/ML",
    tags: ["AI", "ML"],
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "Agile software craftsmanship",
    original_link: "https://example.com/book2.pdf",
    translations: [{ lang: "🇷🇺 Русский", url: "https://example.com/book2_ru.pdf" }],
    category: "Programming",
    tags: ["Clean Code"],
  },
];

module.exports = { BOOKS };
