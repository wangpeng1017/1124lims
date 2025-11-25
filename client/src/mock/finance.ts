// 财务管理模块 Mock数据

// 委托应收接口
export interface IReceivable {
    id: number;
    receivableNo: string;        // 应收账款编号 (格式: AR-YYYYMMDD-XXX)
    entrustmentId: string;        // 委托单号
    clientName: string;           // 客户单位
    samples: {                    // 样品清单
        sampleNo: string;
        sampleName: string;
        testItems: string[];
        unitPrice: number;
        quantity: number;
        subtotal: number;
    }[];
    totalAmount: number;          // 应收总额
    receivedAmount: number;       // 已收金额
    remainingAmount: number;      // 待收金额
    status: '未收款' | '已收款';
    reportNos: string[];          // 关联报告编号
    createDate: string;           // 创建日期
    dueDate: string;              // 应收日期
    remark?: string;
}

// 收款记录接口
export interface IPaymentRecord {
    id: number;
    recordNo: string;             // 收款记录编号
    receivableNo: string;         // 应收账款编号
    paymentAmount: number;        // 收款金额
    paymentDate: string;          // 收款日期
    paymentMethod: '现金' | '银行转账' | '支票' | '其他';
    handlerName: string;          // 经办人
    bankName?: string;            // 银行名称
    transactionNo?: string;       // 交易流水号
    remark?: string;
    attachments?: string[];       // 附件（收款凭证）
}

// 开票管理接口
export interface IInvoice {
    id: number;
    invoiceNo: string;            // 发票号码
    entrustmentId: string;        // 委托单号
    receivableNo: string;         // 应收账款编号
    clientName: string;           // 购买方单位
    clientTaxNo: string;          // 购买方税号
    clientAddress?: string;
    clientPhone?: string;
    clientBank?: string;
    clientBankAccount?: string;
    invoiceType: '增值税普通发票' | '增值税专用发票';
    invoiceAmount: number;        // 开票金额
    taxRate: number;              // 税率 (6 or 13)
    taxAmount: number;            // 税额
    totalAmount: number;          // 价税合计
    invoiceDate: string;
    status: '待开票' | '已开票';
    items: {
        itemName: string;
        specification: string;
        unit: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];
    remark?: string;
}

// 模拟应收账款数据
export const receivableData: IReceivable[] = [
    {
        id: 1,
        receivableNo: 'AR-20231125-001',
        entrustmentId: 'WT20231101001',
        clientName: '某汽车零部件公司',
        samples: [
            {
                sampleNo: 'S20231101001',
                sampleName: '钢筋混凝土试件',
                testItems: ['抗压强度', '外观质量'],
                unitPrice: 500,
                quantity: 3,
                subtotal: 1500
            }
        ],
        totalAmount: 1500,
        receivedAmount: 1500,
        remainingAmount: 0,
        status: '已收款',
        reportNos: ['RPT-20231125-001'],
        createDate: '2023-11-08',
        dueDate: '2023-11-30',
        remark: ''
    },
    {
        id: 2,
        receivableNo: 'AR-20231125-002',
        entrustmentId: 'WT20231102001',
        clientName: '某建筑材料公司',
        samples: [
            {
                sampleNo: 'S20231102001',
                sampleName: '砂石料',
                testItems: ['级配分析', '含泥量'],
                unitPrice: 300,
                quantity: 5,
                subtotal: 1500
            }
        ],
        totalAmount: 1500,
        receivedAmount: 0,
        remainingAmount: 1500,
        status: '未收款',
        reportNos: ['RPT-20231125-002'],
        createDate: '2023-11-10',
        dueDate: '2023-12-10'
    },
    {
        id: 3,
        receivableNo: 'AR-20231124-003',
        entrustmentId: 'WT20231103001',
        clientName: '某新能源公司',
        samples: [
            {
                sampleNo: 'S20231103001',
                sampleName: '水泥',
                testItems: ['凝结时间', '安定性'],
                unitPrice: 400,
                quantity: 2,
                subtotal: 800
            }
        ],
        totalAmount: 800,
        receivedAmount: 0,
        remainingAmount: 800,
        status: '未收款',
        reportNos: [],
        createDate: '2023-11-05',
        dueDate: '2023-12-05'
    }
];

// 模拟收款记录数据
export const paymentRecordData: IPaymentRecord[] = [
    {
        id: 1,
        recordNo: 'PMT-20231110-001',
        receivableNo: 'AR-20231125-001',
        paymentAmount: 1500,
        paymentDate: '2023-11-10',
        paymentMethod: '银行转账',
        handlerName: '李四',
        bankName: '中国工商银行',
        transactionNo: 'TXN20231110001',
        remark: '全额到账',
        attachments: ['receipt_001.pdf']
    }
];

// 模拟开票数据
export const invoiceData: IInvoice[] = [
    {
        id: 1,
        invoiceNo: 'INV-20231115-001',
        entrustmentId: 'WT20231101001',
        receivableNo: 'AR-20231125-001',
        clientName: '某汽车零部件公司',
        clientTaxNo: '91310000XXXXXXXXXXXX',
        clientAddress: '上海市浦东新区XX路XX号',
        clientPhone: '021-12345678',
        clientBank: '中国工商银行上海分行',
        clientBankAccount: '1234567890123456789',
        invoiceType: '增值税专用发票',
        invoiceAmount: 1327.43,
        taxRate: 13,
        taxAmount: 172.57,
        totalAmount: 1500,
        invoiceDate: '2023-11-15',
        status: '已开票',
        items: [
            {
                itemName: '检测服务费',
                specification: '钢筋混凝土试件检测',
                unit: '项',
                quantity: 1,
                unitPrice: 1327.43,
                amount: 1327.43
            }
        ],
        remark: ''
    }
];
