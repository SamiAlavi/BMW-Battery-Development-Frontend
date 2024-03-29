interface IColAxisMap {
    [key: string]: string | undefined;
};

interface IResponseVisualization {
    [key: string]: any[];
};

interface IVisualizationData {
    file_id: number;
    type: string;
    cols: string[];
    colsAxisMapping: IColAxisMap;
    data: IResponseVisualization;
}

export type {
    IColAxisMap,
    IVisualizationData,
}