// 委托合同相关类型定义

import { QuotationItem } from './quotationData';

export interface IContract {
    id: string;
    contractNo: string;              // 合同编号 HT20231201001
    contractName: string;             // 合同名称
    quotationId: string;              // 关联报价单ID
    quotationNo: string;              // 报价单号

    // 甲方信息（客户）
    partyA: {
        company: string;
        contact: string;
        tel: string;
        email?: string;
        address: string;
        taxId?: string;
        bankName?: string;
        bankAccount?: string;
    };

    // 乙方信息（服务方）
    partyB: {
        company: string;
        contact: string;
        tel: string;
        email?: string;
        address: string;
        taxId?: string;
        bankName?: string;
        bankAccount?: string;
    };

    // 合同内容
    contractAmount: number;           // 合同金额
    sampleName: string;               // 样品名称
    testItems: QuotationItem[];       // 检测项目

    // 合同条款
    terms: {
        paymentTerms: string;           // 付款条款
        deliveryTerms: string;          // 交付条款
        qualityTerms: string;           // 质量条款
        confidentialityTerms: string;   // 保密条款
        liabilityTerms: string;         // 违约责任
        disputeResolution: string;      // 争议解决
    };

    // 合同日期
    signDate: string;                 // 签订日期
    effectiveDate: string;            // 生效日期
    expiryDate: string;               // 到期日期

    // 状态
    status: 'draft' | 'signed' | 'executing' | 'completed' | 'terminated';

    // 附件
    attachments: {
        name: string;
        url: string;
        uploadAt: string;
        uploadBy: string;
    }[];

    // PDF
    pdfUrl?: string;                  // 生成的PDF路径

    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// 合同状态映射
export const CONTRACT_STATUS_MAP: Record<IContract['status'], { text: string; color: string }> = {
    draft: { text: '草稿', color: 'default' },
    signed: { text: '已签订', color: 'success' },
    executing: { text: '执行中', color: 'processing' },
    completed: { text: '已完成', color: 'success' },
    terminated: { text: '已终止', color: 'error' }
};

// 默认合同条款模板
export const DEFAULT_CONTRACT_TERMS = {
    paymentTerms: `1. 甲方应在合同签订后3个工作日内支付合同总金额的50%作为预付款；
2. 乙方完成检测并交付检测报告后，甲方应在5个工作日内支付剩余50%款项；
3. 付款方式：银行转账；
4. 逾期付款的，每日按未付款项的0.05%支付违约金。`,

    deliveryTerms: `1. 乙方应在收到样品和预付款后，按照约定的检测周期完成检测工作；
2. 检测报告以电子版和纸质版两种形式交付；
3. 电子版报告通过邮件发送，纸质版报告通过快递方式送达；
4. 样品检测完成后，甲方应在30日内领取样品，逾期视为放弃样品。`,

    qualityTerms: `1. 乙方应按照国家标准、行业标准或双方约定的标准进行检测；
2. 乙方对检测结果的准确性负责；
3. 检测报告应加盖乙方检验检测专用章和CMA章；
4. 如因乙方原因导致检测结果错误，乙方应免费重新检测并承担相应损失。`,

    confidentialityTerms: `1. 双方对在合同履行过程中知悉的对方商业秘密和技术秘密负有保密义务；
2. 未经对方书面同意，任何一方不得向第三方披露相关信息；
3. 保密期限自合同签订之日起至合同终止后三年；
4. 违反保密义务的一方应承担相应的法律责任。`,

    liabilityTerms: `1. 任何一方违反合同约定，应向守约方支付合同总金额20%的违约金；
2. 因不可抗力导致合同无法履行的，双方互不承担违约责任；
3. 一方违约给对方造成损失的，违约金不足以弥补损失的，还应赔偿损失；
4. 双方协商一致可以解除合同，但应提前15日书面通知对方。`,

    disputeResolution: `1. 因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；
2. 协商不成的，任何一方均可向乙方所在地人民法院提起诉讼；
3. 在争议解决期间，双方应继续履行合同中不存在争议的部分；
4. 本合同适用中华人民共和国法律。`
};

// Mock数据
export const contractData: IContract[] = [
    {
        id: '1',
        contractNo: 'HT20231201001',
        contractName: '材料检测委托合同',
        quotationId: '1',
        quotationNo: 'BJ20231201001',
        partyA: {
            company: '奇瑞汽车股份有限公司',
            contact: '李工',
            tel: '13800138000',
            email: 'ligong@chery.com',
            address: '安徽省芜湖市经济技术开发区长春路8号',
            taxId: '91340200713920435C',
            bankName: '中国工商银行芜湖分行',
            bankAccount: '1307023009022100123'
        },
        partyB: {
            company: '江苏国轻检测技术有限公司',
            contact: '张馨',
            tel: '15952575002',
            email: 'zhangxin@sae-china.org',
            address: '扬州市邗江区金山路99号',
            taxId: '91321000MA1MABCD1X',
            bankName: '中国建设银行扬州分行',
            bankAccount: '32001234567890123456'
        },
        contractAmount: 3000,
        sampleName: '莱尼 K01',
        testItems: [
            { id: 1, serviceItem: '拉伸强度测试', methodStandard: 'GB/T 228.1-2021', quantity: 3, unitPrice: 500, totalPrice: 1500 },
            { id: 2, serviceItem: '金相分析', methodStandard: 'GB/T 13298-2015', quantity: 2, unitPrice: 800, totalPrice: 1600 }
        ],
        terms: DEFAULT_CONTRACT_TERMS,
        signDate: '2023-12-01',
        effectiveDate: '2023-12-01',
        expiryDate: '2024-12-01',
        status: 'executing',
        attachments: [
            {
                name: '盖章合同扫描件.pdf',
                url: '/uploads/contracts/HT20231201001_signed.pdf',
                uploadAt: '2023-12-01 16:30:00',
                uploadBy: '张馨'
            }
        ],
        pdfUrl: '/pdfs/contracts/HT20231201001.pdf',
        createdBy: '张馨',
        createdAt: '2023-12-01 16:00:00',
        updatedAt: '2023-12-01 16:30:00'
    }
];
