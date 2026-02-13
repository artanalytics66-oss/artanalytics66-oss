
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } from "docx";
import { ResearchResult } from "../types";

export const exportToWord = async (result: ResearchResult, rubric: string) => {
  const sections = [];

  // Title Section
  sections.push({
    properties: {},
    children: [
      new Paragraph({
        text: "Отчет об исследовании болей и паттернов Рунета",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: `Рубрика: ${rubric}`,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({
            text: "ОБЩИЙ ИТОГ: ТОП-15 САМЫХ ВОСТРЕБОВАННЫХ ТЕМ",
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({ text: "" }),
      // Top 15 Table
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "#", bold: true })] }),
              new TableCell({ children: [new Paragraph({ text: "Тема", bold: true })] }),
              new TableCell({ children: [new Paragraph({ text: "Кластер", bold: true })] }),
              new TableCell({ children: [new Paragraph({ text: "Балл", bold: true })] }),
            ],
          }),
          ...result.top15.map((item, idx) => 
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: (idx + 1).toString() })] }),
                new TableCell({ children: [new Paragraph({ text: item.title })] }),
                new TableCell({ children: [new Paragraph({ text: item.cluster })] }),
                new TableCell({ children: [new Paragraph({ text: item.score.toString() })] }),
              ],
            })
          ),
        ],
      }),
      new Paragraph({ text: "" }),
    ],
  });

  // Detailed Clusters
  result.clusters.forEach((cluster) => {
    const clusterChildren = [
      new Paragraph({
        children: [
          new TextRun({
            text: `Кластер: ${cluster.name}`,
            bold: true,
            size: 32,
            allCaps: true,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
    ];

    cluster.themes.forEach((theme, idx) => {
      clusterChildren.push(
        new Paragraph({
          children: [new TextRun({ text: `${idx + 1}. ${theme.title}`, bold: true, size: 24 })],
          spacing: { before: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Боль аудитории: ", bold: true, color: "E11D48" }),
            new TextRun({ text: `«${theme.pain}»`, italic: true }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Запрос Wordstat: ", bold: true }),
            new TextRun({ text: theme.query }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Частотность: ", bold: true }),
            new TextRun({ text: theme.frequency }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Итоговый балл: ", bold: true }),
            new TextRun({ text: theme.score.toString() }),
          ],
        }),
        new Paragraph({
          text: "Реальные комментарии:",
          bold: true,
          spacing: { before: 100 },
        }),
        ...theme.comments.map(c => new Paragraph({
          text: `• «${c}»`,
          indent: { left: 720 },
          spacing: { after: 50 },
        })),
        new Paragraph({ text: "" })
      );
    });

    sections.push({
      properties: {},
      children: clusterChildren,
    });
  });

  const doc = new Document({
    sections,
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Исследование_болей_${rubric.replace(/\s+/g, '_')}.docx`;
  link.click();
  URL.revokeObjectURL(url);
};
