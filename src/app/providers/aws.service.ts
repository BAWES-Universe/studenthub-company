import { Injectable } from '@angular/core';
import { File as NativeFile, Entry, FileEntry } from '@ionic-native/file/ngx';
import { Observable } from 'rxjs';
import { Platform, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Filesystem } from '@capacitor/filesystem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TEMP_UPLOAD_HOST, uploadTemporaryFile } from './temp-upload-session';

export interface ActivationUploadAuth {
    contact_auth_key: string;
    contact_email: string;
    company_id: string;
}

@Injectable({
    providedIn: 'root'
})
export class AwsService {
    // https://studenthub-public-anyone-can-upload-24hr-expiry.s3.amazonaws.com/

    // https://studenthub-uploads-dev-server.s3.amazonaws.com/

    // https://studenthub-uploads.s3.amazonaws.com/

    public permanentBucketUrl = environment.permanentBucketUrl;
    public bucketUrl = 'https://studenthub-public-anyone-can-upload-24hr-expiry.s3.amazonaws.com/';
    // eu-west-2.
    public cloudinaryUrl = environment.cloudinaryUrl;

    public maxUploadSize = 18874368; // 18 MB

    public txtMaxUploadSize = '18MB';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        public platform: Platform,
        public alertController: AlertController,
        private _file: NativeFile
    ) {
    }

    /**
     * Files available in native filesystem need additional processing
     * before they are ready to be uploaded to S3. This function will create
     * a JS File blob that is ready to be accepted via AWS S3 SDK.
     * @param  { any } nativeFilePath
     * @returns Promise
     */
    uploadNativePath(nativeFilePath, allowedExtensions: string[] = null, activation: ActivationUploadAuth = null): Promise<Observable<any>>{
        return new Promise((resolve, reject) => {

            // Resolve File Path on System

            this._file.resolveLocalFilesystemUrl(nativeFilePath).then((entry: Entry) => {

                // Convert entry into File Entry which can output a JS File object
                const fileEntry =  entry as FileEntry;

                // Return a File object that represents the current state of the file that this FileEntry represents
                fileEntry.file(async (file: any) => {

                    // Store File Details for later use
                    const fileName = file.name;
                    const fileType = file.type;
                    const fileLastModified = file.lastModifiedDate;

                    let fileReadResult;

                    try
                    {
                        fileReadResult = await Filesystem.readFile({
                            path: nativeFilePath,
                            // encoding: FilesystemEncoding.UTF8
                        });
                    }
                    catch (err)
                    {
                        const message = err && err.message ? err.message : 'Error reading file';

                        const alert = await this.alertController.create({
                            header: 'Error',
                            message,
                            buttons: ['Okay']
                        });

                        await alert.present();

                        return reject('Error reading file: ' + JSON.stringify(err));
                    }

                    // var blob = new Blob([fileReadResult.data], { type: fileType });
                    const blobFile: any = this.b64toBlob(fileReadResult.data, fileType); // blob;//, fileType);//blob;
                    blobFile.name = fileName;
                    blobFile.lastModifiedDate = fileLastModified;

                    // Resolve an Observable for File Uploading

                    resolve(this.uploadFile(blobFile, allowedExtensions, activation));

                }, (error) => {
                    reject('Unable to retrieve file properties: ' + JSON.stringify(error));
                });
            }).catch(err => {
                reject('Error resolving file: ' + JSON.stringify(err));
            });
        });
    }

    /**
     * convert base64 data to Blob object
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * Upload file to Amazon S3, return an observable to monitor progress
     * @param { File } file
     * @returns { Observable<any> }
     */
    uploadFile(file: File = null, allowedExtensions: string[] = null, activation: ActivationUploadAuth = null): Observable<any> {
        const activationFields = this.activationFields(activation);

        return uploadTemporaryFile({
            file,
            maxBytes: this.maxUploadSize,
            oversizedMessage: 'File size should not exceed ' + this.txtMaxUploadSize + '!',
            presignUrl: environment.apiEndpoint + (activationFields ? '/temp-upload/activate' : '/temp-upload/url'),
            token: activationFields ? '' : (this.authService.getAccessToken() || ''),
            extraBody: activationFields || undefined,
            uploadHost: TEMP_UPLOAD_HOST,
            allowedExtensions,
            post: (url, body, headers) => this.http.post(url, body, {
                headers: new HttpHeaders(headers)
            })
        });
    }

    private activationFields(activation: ActivationUploadAuth): Record<string, string> | null {
        if (!activation) {
            return null;
        }

        return {
            contact_auth_key: activation.contact_auth_key || '',
            contact_email: activation.contact_email || '',
            company_id: String(activation.company_id || '')
        };
    }

}
