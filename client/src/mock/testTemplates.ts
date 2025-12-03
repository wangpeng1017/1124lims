// 检测模版管理 - 统一的数据结构
// 整合原有的 DetectionParameter 和 ELNTemplate

export interface TestTemplate {
    id: number;
    name: string;                // 模版名称
    code: string;                // 模版编号
    category: string;            // 分类: 复合材料/金属/混凝土/金相等
    method: string;              // 检测方法标准
    unit?: string;               // 单位(可选)
    version: string;             // 版本号
    updateTime: string;          // 更新时间
    author: string;              // 创建人
    status: 'active' | 'archived'; // 状态
    schema: TestTemplateSchema;  // 表单结构定义
}

export interface TestTemplateSchema {
    title: string;               // 模版标题
    header?: {                   // 表头信息
        methodBasis?: string;    // 方法依据
        device?: string;         // 使用设备
        testConditions?: string; // 试验条件
        preparation?: string;    // 样品制备
        [key: string]: any;
    };
    columns?: TemplateColumn[];  // 表格列定义(用于数值型检测)
    fields?: TemplateField[];    // 表单字段定义(用于描述型检测)
    statistics?: string[];       // 统计行: 平均值、标准差、CV等
    environment?: boolean;       // 是否需要环境条件(温度、湿度)
}

export interface TemplateColumn {
    title: string;               // 列标题
    dataIndex: string;           // 数据字段名
    width?: number;              // 列宽
    unit?: string;               // 单位
    type?: 'number' | 'text' | 'select'; // 输入类型
    options?: string[];          // 下拉选项(type=select时)
}

export interface TemplateField {
    type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'image-upload';
    label: string;               // 字段标签
    name: string;                // 字段名
    required?: boolean;          // 是否必填
    placeholder?: string;        // 占位符
    options?: string[];          // 下拉选项
    multiple?: boolean;          // 是否多选/多文件
    accept?: string;             // 文件类型限制
    min?: number;                // 最小值
    max?: number;                // 最大值
    [key: string]: any;
}

// Mock数据
export const testTemplatesData: TestTemplate[] = [
    // ========== 复合材料力学性能检测模版 ==========
    {
        id: 100,
        name: '复合材料拉伸性能检测(GB/T)',
        code: 'COMP-TENSILE-GB',
        category: '复合材料',
        method: 'GB/T 3354-2014',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料拉伸性能试验记录',
            header: {
                methodBasis: 'GB/T 3354-2014',
                device: '电子万能试验机',
                testConditions: '试验速度: 2mm/min; 温度: 23℃±2℃; 湿度: 50%±10%'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80, type: 'number' },
                { title: '宽度 mm', dataIndex: 'width', type: 'number' },
                { title: '厚度 mm', dataIndex: 'thickness', type: 'number' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad', type: 'number' },
                { title: '拉伸强度 MPa', dataIndex: 'tensileStrength', type: 'number' },
                { title: '拉伸模量 GPa', dataIndex: 'tensileModulus', type: 'number' },
                { title: '断裂伸长率 %', dataIndex: 'elongation', type: 'number' },
                { title: '失效模式', dataIndex: 'failureMode', type: 'text' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 101,
        name: '复合材料拉伸性能检测(ASTM)',
        code: 'COMP-TENSILE-ASTM',
        category: '复合材料',
        method: 'ASTM D3039/D3039M-17',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料拉伸性能试验记录',
            header: {
                methodBasis: 'ASTM D3039/D3039M-17',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '拉伸强度 MPa', dataIndex: 'tensileStrength' },
                { title: '拉伸模量 GPa', dataIndex: 'tensileModulus' },
                { title: '断裂伸长率 %', dataIndex: 'elongation' },
                { title: '失效模式', dataIndex: 'failureMode' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 102,
        name: '复合材料压缩性能检测',
        code: 'COMP-COMPRESSION',
        category: '复合材料',
        method: 'ASTM D6641/D6641M-23',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料压缩性能试验记录',
            header: {
                methodBasis: 'ASTM D6641/D6641M-23',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '压缩强度 MPa', dataIndex: 'compressiveStrength' },
                { title: '压缩模量 GPa', dataIndex: 'compressiveModulus' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 103,
        name: '复合材料弯曲性能检测(GB/T)',
        code: 'COMP-FLEXURAL-GB',
        category: '复合材料',
        method: 'GB/T 1449-2005',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料弯曲性能试验记录',
            header: {
                methodBasis: 'GB/T 1449-2005',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '弯曲强度 MPa', dataIndex: 'flexuralStrength' },
                { title: '弯曲模量 GPa', dataIndex: 'flexuralModulus' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 104,
        name: '复合材料弯曲性能检测(ASTM)',
        code: 'COMP-FLEXURAL-ASTM',
        category: '复合材料',
        method: 'ASTM D7264/D7264M-21',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料弯曲性能试验记录',
            header: {
                methodBasis: 'ASTM D7264/D7264M-21',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '弯曲强度 MPa', dataIndex: 'flexuralStrength' },
                { title: '弯曲模量 GPa', dataIndex: 'flexuralModulus' },
                { title: '失效模式', dataIndex: 'failureMode' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 105,
        name: '复合材料开孔拉伸性能检测',
        code: 'COMP-OHT',
        category: '复合材料',
        method: 'ASTM D5766/D5766M-23',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料开孔拉伸性能试验记录',
            header: {
                methodBasis: 'ASTM D5766/D5766M-23',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '拉伸强度 MPa', dataIndex: 'tensileStrength' },
                { title: '失效模式', dataIndex: 'failureMode' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 106,
        name: '复合材料面内剪切性能检测',
        code: 'COMP-SHEAR-INPLANE',
        category: '复合材料',
        method: 'ASTM D3518/D3518M-18',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料面内剪切性能试验记录',
            header: {
                methodBasis: 'ASTM D3518/D3518M-18',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '剪切强度 MPa', dataIndex: 'shearStrength' },
                { title: '剪切模量 GPa', dataIndex: 'shearModulus' },
                { title: '最大剪切应变 %', dataIndex: 'maxShearStrain' },
                { title: '失效模式', dataIndex: 'failureMode' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },
    {
        id: 107,
        name: '复合材料短梁剪切性能检测',
        code: 'COMP-SHEAR-BEAM',
        category: '复合材料',
        method: 'ASTM D2344/D2344M-22',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '复合材料短梁剪切性能试验记录',
            header: {
                methodBasis: 'ASTM D2344/D2344M-22',
                device: '电子万能试验机'
            },
            columns: [
                { title: '样品序号', dataIndex: 'index', width: 80 },
                { title: '宽度 mm', dataIndex: 'width' },
                { title: '厚度 mm', dataIndex: 'thickness' },
                { title: '最大载荷 kN', dataIndex: 'maxLoad' },
                { title: '短梁剪切强度 MPa', dataIndex: 'shortBeamStrength' }
            ],
            statistics: ['平均值', '标准差', 'CV(%)'],
            environment: true
        }
    },

    // ========== 金相组织检测模版 ==========
    {
        id: 200,
        name: '灰铸铁金相组织检测',
        code: 'METAL-GRAY-IRON',
        category: '金相分析',
        method: 'GB/T 7216-2023',
        version: '1.0',
        updateTime: '2025-12-03',
        author: '管理员',
        status: 'active',
        schema: {
            title: '灰铸铁金相组织检验记录',
            header: {
                methodBasis: 'GB/T 7216-2023《灰铸铁金相检验》',
                device: '金相显微镜',
                preparation: '磨抛后用4%硝酸酒精溶液腐蚀'
            },
            fields: [
                {
                    type: 'text',
                    label: '样品编号',
                    name: 'sampleId',
                    required: true
                },
                {
                    type: 'textarea',
                    label: '组织描述',
                    name: 'microstructureDesc',
                    placeholder: '描述显微组织特征',
                    required: true
                },
                {
                    type: 'select',
                    label: '石墨形态',
                    name: 'graphiteType',
                    options: ['A型(片状)', 'B型(玫瑰状)', 'C型(过共晶)', 'D型(点状)', 'E型(蠕虫状)']
                },
                {
                    type: 'number',
                    label: '石墨长度等级',
                    name: 'graphiteLength',
                    min: 1,
                    max: 8
                },
                {
                    type: 'select',
                    label: '基体组织',
                    name: 'matrixStructure',
                    options: ['铁素体', '珠光体', '铁素体+珠光体', '其他']
                },
                {
                    type: 'textarea',
                    label: '检验结论',
                    name: 'conclusion',
                    required: true
                }
            ],
            environment: true
        }
    },

    // ========== 保留原有的一些模版(兼容性) ==========
    {
        id: 3,
        name: 'pH值检测',
        code: 'WATER-PH',
        category: '水质检测',
        method: 'GB/T 5750.4-2006',
        version: '1.0',
        updateTime: '2023-11-26',
        author: '管理员',
        status: 'active',
        schema: {
            title: 'pH值检测记录',
            header: {
                methodBasis: '水质 HJ 1147-2020',
                device: 'pH计 / YQ-'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号/样品名称', dataIndex: 'sampleName' },
                { title: '检测结果', dataIndex: 'result' },
                { title: '样品温度 (°C)', dataIndex: 'temperature' }
            ],
            environment: true
        }
    },
    {
        id: 9,
        name: '混凝土抗压强度检测',
        code: 'CONCRETE-COMPRESSION',
        category: '混凝土',
        method: 'GB/T 50081-2019',
        unit: 'MPa',
        version: '1.0',
        updateTime: '2023-11-26',
        author: '管理员',
        status: 'active',
        schema: {
            title: '混凝土立方体抗压强度试验记录',
            header: {
                methodBasis: 'GB/T 50081-2019',
                device: '压力试验机'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '试件编号', dataIndex: 'sampleId' },
                { title: '养护龄期 (d)', dataIndex: 'age' },
                { title: '破坏荷载 (kN)', dataIndex: 'load' },
                { title: '抗压强度 (MPa)', dataIndex: 'strength' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    }
];
