export class FileTemplate {
    folderId: string;
    folderName: string;
    filename: string;
    uniqueName: string;
    uniqueFileName: string;
    contentType: string;
    name: string;
    parentFolder: string;
    category: string;
    userId: string;
    starred: Boolean;
    fileInfo: {
        addedDate: string,
        lastModifiedDate: string,
        name: string,
        size: string
    }
}

export class IFilemanager {
    files: Array<FileTemplate>;
    folders: Array<FileTemplate>;
    sharedFiles: Array<FileTemplate>;
    sharedFolders: Array<FileTemplate>;
}

export interface UploadTemplate {
    filename: string,
    folderName: string,
    upfile: any,
    userId: string
}

export class NewUserTemplate {
    user: userObject;
    permissions: userPermissionObject;
    data: any;
}

export class userObject {
    userId: number;
    username: string;
    password: string;
    userType: number;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    active: boolean;
}

export class profileObject {
    profileId: number;
    firstName: string;
    lastName: string;
    email: string;
    imageurl: string;
    userId: number;
}

export class userPermissionObject {
    Id: string;
    canEdit: number;
    canView: number;
    canDownload: number;
    canAdd: number;
    canDelete: number;
    createFolder: number;
    canShare: number;
    canUnShare: number;
    userId: string;
}

export interface loginResponse {
    status: boolean,
    data: string,
    error: string
}

export class AuditLog {
    id: number;
    userId: number;
    userRole: number;
    logs: string;
    createdDate: string;
}