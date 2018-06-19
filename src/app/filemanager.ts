interface FileTemplate {
    folderId: string,
    folderName: string,
    uniqueName: string,
    parentFolder: string,
    userId: string
}

export interface IFilemanager {
    folders: Array<FileTemplate>,
}

