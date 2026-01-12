// Utilitários para exportação de dados

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert('Nenhum dado para exportar')
    return
  }

  // Obter cabeçalhos
  const headers = Object.keys(data[0])

  // Criar CSV
  let csv = headers.join(',') + '\n'

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header]
      // Escapar valores que contêm vírgulas ou aspas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csv += values.join(',') + '\n'
  })

  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any[], filename: string) {
  if (data.length === 0) {
    alert('Nenhum dado para exportar')
    return
  }

  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF(data: any[], _filename: string, title: string) {
  // Para PDF, vamos criar um HTML e usar window.print()
  // Em produção, seria melhor usar uma biblioteca como jsPDF ou pdfmake

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map((key) => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) =>
                  `<tr>${Object.values(row)
                    .map((value) => `<td>${value || ''}</td>`)
                    .join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

export function exportToExcel(data: any[], filename: string) {
  // Para Excel, vamos criar um CSV com extensão .xlsx
  // Em produção, seria melhor usar uma biblioteca como xlsx
  // Por enquanto, vamos usar CSV que abre no Excel

  if (data.length === 0) {
    alert('Nenhum dado para exportar')
    return
  }

  const headers = Object.keys(data[0])
  let csv = '\ufeff' // BOM para UTF-8 no Excel
  csv += headers.join('\t') + '\n'

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header] || ''
      return String(value).replace(/\t/g, ' ')
    })
    csv += values.join('\t') + '\n'
  })

  const blob = new Blob([csv], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.xls`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

