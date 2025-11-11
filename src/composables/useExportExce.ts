import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver' // file-saver 是一个 纯前端、零依赖 的 JavaScript 小库，核心只做一件事：把浏览器内存里的 Blob/File/URL 变成用户硬盘上的真实文件（即触发“下载”）。它让网页具备“另存为”能力，而无需经过后端。

interface TableHeader {
  prop?: string
  slot?: string
  label: string
}

interface ExportOptions<T> {
  slotRenderMap?: Record<string, (row: T) => any> // slot 的值映射函数
  fileName?: string
}

/**
 * 用途：将表数据导出为 Excel 文件
 * @param data
 * @param theadName
 * @param options
 * @returns {Promise<void>} Resolves when the Excel file has been generated and download is triggered.
 */
export async function createExcel<T>(data: T[], theadName: TableHeader[], options: ExportOptions<T> = {}): Promise<void> {
  const { slotRenderMap = {}, fileName = '导出结果.xlsx' } = options

  if (!data?.length) {
    console.warn('无数据可导出')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Sheet1')

  const headers = theadName.filter(h => h.prop || h.slot)
  sheet.columns = headers.map(h => ({
    header: h.label,
    key: h.prop || h.slot,
    width: Math.max(h.label?.length ?? 0, 10),
  }))

  // 数据映射
  const mappedData = data.map((row: T) => {
    const newRow: Record<string, any> = {}
    for (const header of headers) {
      const key = header.prop || header.slot!
      if (header.prop) {
        newRow[key] = row[header.prop as keyof T]
      }
      else if (header.slot && slotRenderMap[header.slot]) {
        newRow[key] = slotRenderMap[header.slot](row)
      }
      else {
        newRow[key] = ''
      }
    }
    return newRow
  })

  sheet.addRows(mappedData)

  // 修改表头的样式
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    }
    cell.font = { bold: true, size: 16 }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

  // 修改每一行的样式
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1)
      return
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.font = { size: 16 }
    })
  })

  // 自动列宽
  sheet.columns.forEach((column) => {
    let maxLength = 10
    if (typeof column.eachCell === 'function') {
      column.eachCell({ includeEmpty: true }, (cell) => {
        const val = cell.value ? cell.value.toString() : ''
        // eslint-disable-next-line no-control-regex
        const len = val.replace(/[^\x00-\xFF]/g, '00').length
        maxLength = Math.max(maxLength, len)
      })
    }
    const fontSize = 16 // 可以自定义每列字体
    const scale = fontSize / 11 // 默认 11pt 字体对应原宽度
    column.width = Math.ceil(maxLength * scale) + 2
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName)
}
