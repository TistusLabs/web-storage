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

export interface UploadTemplate {
    filename: string,
    folderName: string,
    upfile: any,
    userId: string
}

export interface NewUserTemplate {
    user: userObject,
    permission: userPermissionObject
}

interface userObject {
    username: string,
    password: string,
    userType: number
}

interface userPermissionObject {
    canEdit: number,
    canView: number,
    canDownload: number,
    canAdd: number,
    canDelete: number
}