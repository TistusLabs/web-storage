export interface FileTemplate {
    folderId: string,
    folderName: string,
    uniqueName: string,
    parentFolder: string,
    userId: string
}

export interface IFilemanager {
    files: Array<FileTemplate>,
    folders: Array<FileTemplate>,
    sharedFiles: Array<FileTemplate>
}

