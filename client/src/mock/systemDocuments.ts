export interface ISystemDocument {
    id: number;
    name: string;
    version: string;              // 版本号，如 V1.0
    attachmentName: string;
    uploadTime: string;
    uploader: string;
    description?: string;
}

export const systemDocumentsData: ISystemDocument[] = [
    {
        id: 1,
        name: '质量手册',
        version: 'V1.0',
        attachmentName: '质量手册_V1.0.docx',
        uploadTime: '2023-01-10',
        uploader: '张三',
        description: '实验室质量管理体系纲领性文件'
    },
    {
        id: 2,
        name: '程序文件',
        version: 'V2.0',
        attachmentName: '程序文件汇编.pdf',
        uploadTime: '2023-01-15',
        uploader: '李四',
        description: '各过程控制程序'
    },
    {
        id: 3,
        name: '作业指导书-混凝土检测',
        version: 'V1.0',
        attachmentName: 'SOP-混凝土.xlsx',
        uploadTime: '2023-02-01',
        uploader: '王五',
        description: '混凝土相关试验操作规程'
    },
    {
        id: 4,
        name: '设备管理制度',
        version: 'V1.5',
        attachmentName: '设备管理制度.docx',
        uploadTime: '2023-03-12',
        uploader: '赵六',
        description: '仪器设备采购、验收、使用、维护管理规定'
    },
    {
        id: 5,
        name: '人员培训计划2023',
        version: 'V1.0',
        attachmentName: '2023年度培训计划.xlsx',
        uploadTime: '2023-01-05',
        uploader: '张三',
        description: '年度人员培训安排'
    }
];
