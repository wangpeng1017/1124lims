export interface Device {
    id: number;
    name: string;
    code: string;
    status: 'Running' | 'Maintenance' | 'Idle';
    utilization: number;
}

export const deviceData: Device[] = [
    { id: 1, name: '火花源原子发射光谱仪 SPECTRO MAXx', code: 'ALTCCS-2022001', status: 'Running', utilization: 30 },
    { id: 2, name: '全自动显微维氏硬度计THVS-1MDX-AXYZF', code: 'ALTCCS-2022005', status: 'Running', utilization: 20 },
    { id: 3, name: '布氏硬度计 THB-3000S', code: 'ALTCCS-2022006', status: 'Running', utilization: 20 },
    { id: 4, name: '洛氏硬度计 THR-150DT', code: 'ALTCCS-2022008', status: 'Running', utilization: 20 },
    { id: 5, name: '金相显微镜 AE2000MET', code: 'ALTCCS-2022013', status: 'Running', utilization: 30 },
    { id: 6, name: '水平燃烧测试仪 TTech-GB8410-T', code: 'ALTCCS-2022026', status: 'Running', utilization: 20 },
    { id: 7, name: '垂直燃烧测试仪 TTech-GB32086-T', code: 'ALTCCS-2022027', status: 'Running', utilization: 20 },
    { id: 8, name: '盐雾试验箱（中性） QS-ST-720optA', code: 'ALTCCS-2022035', status: 'Running', utilization: 60 },
    { id: 9, name: '2T电子万能试验机 CMT4204', code: 'ALTCCS-2022052', status: 'Running', utilization: 50 },
    { id: 10, name: '5T电子万能试验机 E45.504', code: 'ALTCCS-2022053', status: 'Running', utilization: 50 },
    { id: 11, name: '熔体流动速率试验机 ZRE1452', code: 'ALTCCS-2022055', status: 'Running', utilization: 30 },
    { id: 12, name: '热变形维卡试验机 ZWK1302-B', code: 'ALTCCS-2022056', status: 'Running', utilization: 30 },
    { id: 13, name: '电子天平 MSA2203S-1CE-DE', code: 'ALTCCS-2022061', status: 'Running', utilization: 40 },
    { id: 14, name: '摆锤冲击试验机 ZBC7550-B', code: 'ALTCCS-2022063', status: 'Running', utilization: 30 },
    { id: 15, name: '数显游标卡尺', code: 'ALTCCS-2022066', status: 'Running', utilization: 50 },
    { id: 16, name: '电导率仪 S230', code: 'ALTCCS-2022067', status: 'Running', utilization: 30 },
    { id: 17, name: 'PH计 S2', code: 'ALTCCS-2022068', status: 'Running', utilization: 30 },
    { id: 18, name: '密度计 DMA35', code: 'ALTCCS-2022069', status: 'Running', utilization: 30 },
    { id: 19, name: '轴向电子引伸计 Y50/25', code: 'ALTCCS-2022070', status: 'Running', utilization: 30 },
    { id: 20, name: '大变形测量装置 （10-800）mm', code: 'ALTCCS-2022071', status: 'Running', utilization: 20 },
    { id: 21, name: '钢直尺 500mm', code: 'ALTCCS-2022072', status: 'Running', utilization: 50 },
];
