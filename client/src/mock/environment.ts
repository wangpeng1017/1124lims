export interface EnvironmentRecord {
    id: number;
    location: string;
    room: string;
    temperature: number;
    humidity: number;
}

export const environmentData: EnvironmentRecord[] = [
    { id: 1, location: '一层', room: '扫描电镜试验室', temperature: 25, humidity: 50 },
    { id: 2, location: '一层', room: '工业CT试验室', temperature: 24, humidity: 50 },
    { id: 3, location: '一层', room: '机械性能分析室1', temperature: 23, humidity: 50 },
    { id: 4, location: '一层', room: '配电房', temperature: 25, humidity: 50 },
    { id: 5, location: '一层', room: '消防阀室', temperature: 23, humidity: 50 },
    { id: 6, location: '一层', room: '特殊试剂室', temperature: 25, humidity: 50 },
    { id: 7, location: '一层', room: '机房1', temperature: 23, humidity: 50 },
    { id: 8, location: '二层', room: '样品拍照室', temperature: 25, humidity: 50 },
    { id: 9, location: '二层', room: '化学分析室', temperature: 23, humidity: 50 },
    { id: 10, location: '二层', room: '物理分析室', temperature: 25, humidity: 50 },
    { id: 11, location: '二层', room: '机械性能分析室2', temperature: 25, humidity: 50 },
    { id: 12, location: '二层', room: '老化性能分析室1', temperature: 23, humidity: 50 },
    { id: 13, location: '二层', room: '老化性能分析室2', temperature: 22, humidity: 50 },
    { id: 14, location: '二层', room: '腐蚀性能试验室2', temperature: 25, humidity: 50 },
    { id: 15, location: '二层', room: '腐蚀性能试验室3', temperature: 24, humidity: 50 },
    { id: 16, location: '二层', room: '金相制样室', temperature: 25, humidity: 50 },
    { id: 17, location: '二层', room: '形貌观察室', temperature: 25, humidity: 50 },
    { id: 18, location: '二层', room: '无损检测室', temperature: 25, humidity: 50 },
    { id: 19, location: '二层', room: '机房2', temperature: 21, humidity: 50 },
    { id: 20, location: '二层', room: '纯水站房', temperature: 25, humidity: 50 },
    { id: 21, location: '二层', room: '留样存储室', temperature: 23, humidity: 50 },
    { id: 22, location: '二层', room: '备件耗材室', temperature: 25, humidity: 50 },
    { id: 23, location: '二层', room: '档案室', temperature: 25, humidity: 50 },
    { id: 24, location: '二层', room: '中央控制室', temperature: 24, humidity: 50 },
    { id: 25, location: '二层', room: '会议室1', temperature: 25, humidity: 50 },
    { id: 26, location: '三层', room: '热性能分析室', temperature: 25, humidity: 50 },
    { id: 27, location: '三层', room: '环境友好分析室', temperature: 22, humidity: 50 },
    { id: 28, location: '三层', room: '燃烧性能分析室', temperature: 25, humidity: 50 },
    { id: 29, location: '三层', room: '电性能分析室', temperature: 23, humidity: 50 },
    { id: 30, location: '三层', room: 'VOC采样室2', temperature: 25, humidity: 50 },
    { id: 31, location: '三层', room: '试剂存储室', temperature: 22, humidity: 50 },
    { id: 32, location: '三层', room: '留样存储室2', temperature: 25, humidity: 50 },
    { id: 33, location: '三层', room: '样品加工室', temperature: 24, humidity: 50 },
    { id: 34, location: '三层', room: '会议室2', temperature: 25, humidity: 50 },
    { id: 35, location: '三层', room: '会议室3', temperature: 25, humidity: 50 },
    { id: 36, location: '三层', room: '培训室1', temperature: 22, humidity: 50 },
    { id: 37, location: '三层', room: '培训室2', temperature: 23, humidity: 50 },
    { id: 38, location: '三层', room: '新风机房', temperature: 25, humidity: 50 },
    { id: 39, location: '三层', room: '气瓶间', temperature: 24, humidity: 50 },
];
