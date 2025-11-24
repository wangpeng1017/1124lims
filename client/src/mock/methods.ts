export interface Method {
    id: number;
    name: string;
    standardNo: string;
    validity: string;
    remarks: string;
}

export const methodData: Method[] = [
    { id: 1, name: '金属显微组织检验方法', standardNo: 'GB/T 13298-2015', validity: '现行有效', remarks: 'CNAS' },
    { id: 2, name: '钢的游离渗碳体、珠光体和魏氏组织的评定方法', standardNo: 'GB/T 13299-2022', validity: '现行有效', remarks: 'CNAS' },
    { id: 3, name: '灰铸铁金相检验', standardNo: 'GB/T 7216-2023', validity: '现行有效', remarks: 'CNAS' },
    { id: 4, name: '球墨铸铁金相检验', standardNo: 'GB/T 9441-2021', validity: '现行有效', remarks: 'CNAS' },
    { id: 5, name: '钢中非金属夹杂物含量的测定 标准评级图显微检验法', standardNo: 'GB/T 10561-2005', validity: '现行有效', remarks: 'CNAS' },
    { id: 6, name: '金属平均晶粒度测定方法', standardNo: 'GB/T 6394-2017', validity: '现行有效', remarks: 'CNAS' },
    { id: 7, name: '低碳钢冷轧薄板铁素体晶粒度测定法', standardNo: 'GB/T 4335-2013', validity: '现行有效', remarks: 'CNAS' },
    { id: 8, name: '金属材料焊缝破坏性试验 焊缝宏观和微观检验', standardNo: 'GB/T 26955-2011', validity: '现行有效', remarks: 'CNAS' },
    { id: 9, name: '钢铁零件渗氮层深度测定和金相组织检验', standardNo: 'GB/T 11354-2005', validity: '现行有效', remarks: 'CNAS' },
    { id: 10, name: '钢的脱碳层深度测定法', standardNo: 'GB/T 224-2019', validity: '现行有效', remarks: 'CNAS' },
    { id: 11, name: '钢件渗碳淬火硬化层深度的测定和校核', standardNo: 'GB/T 9450-2005', validity: '现行有效', remarks: 'CNAS' },
    { id: 12, name: '金属材料 布氏硬度试验 第1部分：试验方法', standardNo: 'GB/T 231.1-2018', validity: '现行有效', remarks: 'CNAS' },
    { id: 13, name: '金属材料 维氏硬度试验 第1部分：试验方法', standardNo: 'GB/T 4340.1-2009', validity: '现行有效', remarks: 'CNAS' },
    { id: 14, name: '金属材料焊缝破坏性试验 焊接接头显微硬度试验', standardNo: 'GB/T 27552-2021', validity: '现行有效', remarks: 'CNAS' },
    { id: 15, name: '金属材料 洛氏硬度试验 第1部分：试验方法', standardNo: 'GB/T 230.1-2018', validity: '现行有效', remarks: 'CNAS' },
    { id: 16, name: '金属材料 拉伸试验 第1部分：室温试验方法', standardNo: 'GB/T 228.1-2021', validity: '现行有效', remarks: 'CNAS' },
    { id: 17, name: '金属材料 弯曲试验方法', standardNo: 'GB/T 232-2010', validity: '现行有效', remarks: 'CNAS' },
    { id: 18, name: '人造气氛腐蚀试验 盐雾试验', standardNo: 'GB/T 10125-2021/ ISO 9227:2017', validity: '现行有效', remarks: 'CNAS' },
    { id: 19, name: '碳素钢和中低合金钢 多元素含量的测定 火花放电原子发射光谱法（常规法）', standardNo: 'GB/T 4336-2016', validity: '现行有效', remarks: 'CNAS' },
    { id: 20, name: '不锈钢 多元素含量的测定 火花放电原子发射光谱法（常规法）', standardNo: 'GB/T11170-2008', validity: '现行有效', remarks: 'CNAS' },
];
