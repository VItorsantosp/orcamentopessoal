import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Transaction, ChartItem } from '../types/transaction'

type ExportBudgetPdfParams = {
  selectedMonth: string
  summary: {
    income: number
    expense: number
    balance: number
  }
  transactions: Transaction[]
  chartData: ChartItem[]
  goals: Record<string, number>
  chartImageDataUrl?: string
}

const currency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

export function exportBudgetPdf({
  selectedMonth,
  summary,
  transactions,
  chartData,
  goals,
  chartImageDataUrl,
}: ExportBudgetPdfParams) {
  const doc = new jsPDF()

  const formattedMonth = new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString(
    'pt-BR',
    {
      month: 'long',
      year: 'numeric',
    }
  )

  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(24, 24, 27)
  doc.rect(0, 0, pageWidth, 34, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text('Orçamento', 14, 16)

  doc.setFontSize(11)
  doc.setTextColor(220, 220, 220)
  doc.text('Relatório financeiro mensal', 14, 24)

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(12)
  doc.text(`Período: ${formattedMonth}`, 14, 44)

  doc.setDrawColor(230, 230, 230)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, 52, 182, 30, 4, 4, 'FD')

  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text('Entradas', 20, 62)
  doc.text('Saídas', 78, 62)
  doc.text('Saldo', 136, 62)

  doc.setFontSize(13)
  doc.setTextColor(16, 185, 129)
  doc.text(currency(summary.income), 20, 72)

  doc.setTextColor(244, 63, 94)
  doc.text(currency(summary.expense), 78, 72)

  if (summary.balance >= 0) {
    doc.setTextColor(37, 99, 235)
  } else {
    doc.setTextColor(244, 63, 94)
  }
  doc.text(currency(summary.balance), 136, 72)

  if (chartImageDataUrl) {
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(14)
    doc.text('Visual do mês', 14, 96)
    doc.addImage(chartImageDataUrl, 'PNG', 14, 102, 182, 68)
  }

  const launchStartY = chartImageDataUrl ? 180 : 96

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(14)
  doc.text('Lançamentos do mês', 14, launchStartY)

  autoTable(doc, {
    startY: launchStartY + 6,
    head: [['Tipo', 'Descrição', 'Categoria', 'Data', 'Valor']],
    body:
      transactions.length > 0
        ? transactions.map((transaction) => [
            transaction.type === 'income' ? 'Receita' : 'Despesa',
            transaction.description,
            transaction.category,
            new Date(transaction.date).toLocaleDateString('pt-BR'),
            `${transaction.type === 'income' ? '+' : '-'} ${currency(transaction.amount)}`,
          ])
        : [['-', 'Nenhum lançamento no período', '-', '-', '-']],
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [39, 39, 42],
      lineColor: [235, 235, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    bodyStyles: {
      valign: 'middle',
    },
  })

  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120

  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Metas por categoria', 14, finalY + 14)

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Categoria', 'Gasto no mês', 'Meta', '% usada', 'Status']],
    body: Object.entries(goals).map(([category, goal]) => {
      const found = chartData.find((item) => item.name === category)
      const spent = found ? found.value : 0
      const percentUsed = goal > 0 ? ((spent / goal) * 100).toFixed(0) : '0'

      return [
        category,
        currency(spent),
        currency(goal),
        `${percentUsed}%`,
        spent > goal ? 'Ultrapassada' : 'Dentro da meta',
      ]
    }),
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [39, 39, 42],
      lineColor: [235, 235, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [24, 24, 27],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const value = String(data.cell.raw)
        if (value === 'Ultrapassada') {
          data.cell.styles.textColor = [244, 63, 94]
          data.cell.styles.fontStyle = 'bold'
        } else {
          data.cell.styles.textColor = [16, 185, 129]
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
  })

  const footerY = doc.internal.pageSize.getHeight() - 10
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text('Gerado pelo app Orçamento', 14, footerY)

  doc.save(`relatorio-${selectedMonth}.pdf`)
}