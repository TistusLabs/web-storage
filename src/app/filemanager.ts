export interface FileTemplate {
    folderId: string,
    folderName: string,
    uniqueName: string,
    uniqueFileName:string,
    parentFolder: string,
    userId: string,
    fileInfo: {
        addedDate: string,
        lastModifiedDate: string,
        name: string,
        size: string
    }
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

export interface userObject {
    userId:number,
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

export interface loginResponse {
    status: boolean,
    data: string,
    error: string
}