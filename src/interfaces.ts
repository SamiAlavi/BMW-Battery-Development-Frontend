interface IColAxisMap {
    [key: string]: string | undefined;
};

interface IVisualizationData {
    file_id: number;
    type: string;
    cols: string[];
    colsAxisMapping: IColAxisMap;
    data: object[];
}

export type {
    IColAxisMap,
    IVisualizationData,
}