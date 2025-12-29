import React, { useRef, useCallback } from 'react';
import { Workbook, WorkbookInstance } from '@fortune-sheet/react';
import type { Sheet } from '@fortune-sheet/core';
import '@fortune-sheet/react/dist/index.css';

export interface FortuneSheetProps {
  data?: Sheet[];
  onChange?: (data: Sheet[]) => void;
  readOnly?: boolean;
  height?: number | string;
}

const FortuneSheetEditor: React.FC<FortuneSheetProps> = ({
  data,
  onChange,
  readOnly = false,
  height = 500,
}) => {
  const workbookRef = useRef<WorkbookInstance>(null);

  const defaultData: Sheet[] = data || [{
    name: 'Sheet1',
    celldata: [],
    config: {},
  }];

  const handleChange = useCallback((sheets: Sheet[]) => {
    onChange?.(sheets);
  }, [onChange]);

  return (
    <div style={{ width: '100%', height }}>
      <Workbook
        ref={workbookRef}
        data={defaultData}
        onChange={handleChange}
        showToolbar={!readOnly}
        showFormulaBar={!readOnly}
        showSheetTabs={true}
        allowEdit={!readOnly}
        lang="zh"
      />
    </div>
  );
};

export default FortuneSheetEditor;
export { FortuneSheetEditor };
