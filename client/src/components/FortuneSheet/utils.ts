import type { Sheet, Cell } from '@fortune-sheet/core';

// 创建空白模板
export const createEmptySheet = (name: string = 'Sheet1'): Sheet => ({
  name,
  celldata: [],
  config: {},
});

// 从 JSON 数据恢复 Sheet
export const parseSheetData = (jsonStr: string): Sheet[] => {
  try {
    const data = JSON.parse(jsonStr);
    return data.sheets || [createEmptySheet()];
  } catch {
    return [createEmptySheet()];
  }
};

// 将 Sheet 数据转为 JSON 字符串
export const stringifySheetData = (sheets: Sheet[]): string => {
  return JSON.stringify({ sheets });
};

// 获取单元格值
export const getCellValue = (sheet: Sheet, row: number, col: number): any => {
  const cell = sheet.celldata?.find(
    (c: any) => c.r === row && c.c === col
  );
  return cell?.v?.v ?? cell?.v ?? null;
};

// 设置单元格值
export const setCellValue = (
  sheet: Sheet,
  row: number,
  col: number,
  value: any
): Sheet => {
  const celldata = sheet.celldata || [];
  const existingIndex = celldata.findIndex(
    (c: any) => c.r === row && c.c === col
  );

  const newCell = {
    r: row,
    c: col,
    v: { v: value, m: String(value) },
  };

  if (existingIndex >= 0) {
    celldata[existingIndex] = newCell;
  } else {
    celldata.push(newCell);
  }

  return { ...sheet, celldata };
};
