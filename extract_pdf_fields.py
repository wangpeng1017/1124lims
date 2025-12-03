#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF字段提取脚本 - 简化版
"""

import sys
from pathlib import Path
import json

try:
    import pdfplumber
except ImportError:
    print("需要安装: pip install pdfplumber")
    sys.exit(1)

def extract_pdf(pdf_path):
    """提取PDF内容"""
    print(f"\n{'='*70}")
    print(f"分析: {pdf_path.name}")
    print(f"{'='*70}\n")
    
    results = {
        'filename': pdf_path.name,
        'pages': [],
        'all_text': '',
        'tables': []
    }
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"总页数: {len(pdf.pages)}\n")
        
        for i, page in enumerate(pdf.pages):
            page_num = i + 1
            print(f"--- 第 {page_num} 页 ---")
            
            # 提取文本
            text = page.extract_text()
            if text:
                print(f"文本:\n{text[:300]}")
                if len(text) > 300:
                    print("...")
                results['all_text'] += text + '\n'
            
            # 提取表格
            tables = page.extract_tables()
            if tables:
                print(f"\n发现 {len(tables)} 个表格")
                for j, table in enumerate(tables):
                    print(f"\n表格 {j+1} (共{len(table)}行):")
                    for row in table[:3]:
                        print(f"  {row}")
                    if len(table) > 3:
                        print("  ...")
                    
                    results['tables'].append({
                        'page': page_num,
                        'index': j + 1,
                        'headers': table[0] if table else [],
                        'data': table,
                        'rows': len(table)
                    })
            
            print()
    
    return results

def create_schema(results):
    """生成模版schema"""
    print(f"\n{'='*70}")
    print(f"生成Schema: {results['filename']}")
    print(f"{'='*70}\n")
    
    if not results['tables']:
        print("未找到表格")
        print(f"文本内容:\n{results['all_text'][:500]}")
        return None
    
    table = results['tables'][0]
    headers = table['headers']
    
    print(f"表头: {headers}")
    
    schema = {
        'title': results['filename'].replace('.pdf', ''),
        'header': {'methodBasis': '', 'device': ''},
        'columns': [],
        'environment': True
    }
    
    for i, h in enumerate(headers):
        if h and h.strip():
            schema['columns'].append({
                'title': h.strip(),
                'dataIndex': f'field_{i}'
            })
    
    print(f"\nSchema:\n{json.dumps(schema, ensure_ascii=False, indent=2)}")
    return schema

def main():
    files = [
        "ALTC2509034复合材料力学性能.pdf",
        "ALTC2510007G-奇瑞金相.pdf"
    ]
    
    all_results = []
    schemas = []
    
    for fname in files:
        path = Path(fname)
        if not path.exists():
            print(f"文件不存在: {fname}")
            continue
        
        result = extract_pdf(path)
        all_results.append(result)
        
        schema = create_schema(result)
        if schema:
            schemas.append(schema)
    
    # 保存
    with open('pdf_results.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    with open('schemas.json', 'w', encoding='utf-8') as f:
        json.dump(schemas, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*70}")
    print("完成! 结果保存到: pdf_results.json, schemas.json")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
