import { redactPresignedUploadBreadcrumb } from '../src/app/providers/sentry-presign-redaction';
import { TEMP_UPLOAD_HOST, uploadTemporaryFile } from '../src/app/providers/temp-upload-session';
import { readFileSync } from 'fs';
import { join } from 'path';

let failures = 0;

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

function check(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
        .then(fn)
        .then(() => console.log('PASS ' + name))
        .catch((err) => {
            failures += 1;
            console.error('FAIL ' + name);
            console.error(err instanceof Error ? err.stack : err);
        });
}

function xhrOk() {
    return function () {
        const request: any = {
            upload: {},
            status: 200,
            open() {},
            setRequestHeader() {},
            send() {
                if (this.upload.onprogress) {
                    this.upload.onprogress({ lengthComputable: true, loaded: 1, total: 2 });
                }
                this.onload();
            },
            abort() {}
        };
        return request;
    };
}

function presignBody(key: string) {
    const uploadUrl = 'https://' + TEMP_UPLOAD_HOST + '/' + key + '?X-Amz-Signature=abc';
    return {
        method: 'PUT',
        key,
        bucket: 'studenthub-public-anyone-can-upload-24hr-expiry',
        public_url: 'https://' + TEMP_UPLOAD_HOST + '/' + key,
        upload_url: uploadUrl,
        headers: {
            'Content-Type': 'image/png',
            'x-amz-acl': 'public-read'
        }
    };
}

async function main() {
    const root = process.env.EMPLOYER_ROOT || process.cwd();

    await check('activation credentials permit logo and licence uploads', async () => {
        const posts = [];
        const activation = {
            contact_auth_key: '1234',
            contact_email: 'owner@example.test',
            company_id: '42'
        };

        for (const name of ['logo.png', 'licence.png']) {
            const events = [];
            await new Promise<void>((resolve, reject) => {
                uploadTemporaryFile({
                    file: { name, type: 'image/png', size: 6000000 },
                    maxBytes: 18874368,
                    oversizedMessage: 'File size should not exceed 18MB!',
                    presignUrl: 'https://company.api.example.test/v1/temp-upload/activate',
                    token: '',
                    extraBody: activation,
                    uploadHost: TEMP_UPLOAD_HOST,
                    allowedExtensions: ['png', 'jpg', 'jpeg'],
                    createRequest: xhrOk(),
                    post: (url, body, headers) => {
                        posts.push({ url, body, headers });
                        return {
                            subscribe: (next) => {
                                next(presignBody(name));
                                return { unsubscribe() {} };
                            }
                        };
                    }
                }).subscribe({
                    next: (event) => events.push(event),
                    error: reject,
                    complete: () => resolve()
                });
            });
            assert(events.some((event) => event.Key === name), name + ' did not finish');
        }

        assert(posts.length === 2, 'activation did not request both uploads');
        posts.forEach((post) => {
            assert(post.url.indexOf('/temp-upload/activate') !== -1, 'activation used the logged-in route');
            assert(post.body.contact_auth_key === '1234', 'activation key was not sent');
            assert(post.body.contact_email === 'owner@example.test', 'activation email was not sent');
            assert(post.body.company_id === '42', 'activation company was not sent');
            assert(post.body.file_size === 6000000, 'file size above the Staff ceiling was not sent');
            assert(!post.headers.Authorization, 'activation key was sent as a bearer token');
        });
    });

    await check('logged-in upload uses the bearer route and stays below 18 MB', async () => {
        const posts = [];
        await new Promise<void>((resolve, reject) => {
            uploadTemporaryFile({
                file: { name: 'rates.xlsx', type: 'application/vnd.ms-excel', size: 6000000 },
                maxBytes: 18874368,
                oversizedMessage: 'File size should not exceed 18MB!',
                presignUrl: 'https://company.api.example.test/v1/temp-upload/url',
                token: 'synthetic-employer-bearer',
                uploadHost: TEMP_UPLOAD_HOST,
                allowedExtensions: ['xlsx', 'xls'],
                createRequest: xhrOk(),
                post: (url, body, headers) => {
                    posts.push({ url, body, headers });
                    return {
                        subscribe: (next) => {
                            next(presignBody('rates.xlsx'));
                            return { unsubscribe() {} };
                        }
                    };
                }
            }).subscribe({
                next: () => {},
                error: reject,
                complete: () => resolve()
            });
        });
        assert(posts.length === 1, 'logged-in upload did not request a URL');
        assert(posts[0].url.indexOf('/temp-upload/url') !== -1, 'logged-in upload used the activation route');
        assert(posts[0].headers.Authorization === 'Bearer synthetic-employer-bearer', 'bearer token was not sent');
        assert(posts[0].body.contact_auth_key === undefined, 'activation key was sent on a logged-in upload');
        assert(posts[0].body.file_size === 6000000, 'file above the Staff ceiling was rejected');


        let posted = false;
        await new Promise<void>((resolve, reject) => {
            uploadTemporaryFile({
                file: { name: 'rates.xlsx', type: 'application/vnd.ms-excel', size: 18874369 },
                maxBytes: 18874368,
                oversizedMessage: 'File size should not exceed 18MB!',
                presignUrl: 'https://company.api.example.test/v1/temp-upload/url',
                token: 'synthetic-employer-bearer',
                uploadHost: TEMP_UPLOAD_HOST,
                allowedExtensions: ['xlsx', 'xls'],
                post: () => {
                    posted = true;
                    return { subscribe: () => ({ unsubscribe() {} }) };
                }
            }).subscribe({
                next: () => {},
                error: (err) => {
                    try {
                        assert(posted === false, 'oversized file requested an upload');
                        assert(err.message.indexOf('18MB') !== -1, 'Employer size message was hidden');
                        resolve();
                    } catch (assertionError) {
                        reject(assertionError);
                    }
                },
                complete: () => reject(new Error('oversized upload completed'))
            });
        });
    });

    await check('unsupported activation file sends no request and keeps the message', async () => {
        let posted = false;
        await new Promise<void>((resolve, reject) => {
            uploadTemporaryFile({
                file: { name: 'logo.svg', type: 'image/svg+xml', size: 20 },
                maxBytes: 18874368,
                oversizedMessage: 'File size should not exceed 18MB!',
                presignUrl: 'https://company.api.example.test/v1/temp-upload/activate',
                token: '',
                extraBody: {
                    contact_auth_key: '1234',
                    contact_email: 'owner@example.test',
                    company_id: '42'
                },
                uploadHost: TEMP_UPLOAD_HOST,
                allowedExtensions: ['png', 'jpg', 'jpeg'],
                post: () => {
                    posted = true;
                    return { subscribe: () => ({ unsubscribe() {} }) };
                }
            }).subscribe({
                next: () => {},
                error: (err) => {
                    try {
                        assert(posted === false, 'unsupported file requested an upload');
                        assert(err.message.indexOf('Accepted formats:') !== -1, 'accepted formats were hidden');
                        resolve();
                    } catch (assertionError) {
                        reject(assertionError);
                    }
                },
                complete: () => reject(new Error('unsupported upload completed'))
            });
        });
    });

    await check('a later raw signature in the same breadcrumb does not survive', () => {
        const signed = 'https://' + TEMP_UPLOAD_HOST
            + '/logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=600&X-Amz-Signature=first-signature';
        const second = 'second-raw-signature-value';
        const combined = redactPresignedUploadBreadcrumb({
            category: 'console',
            message: 'upload ' + signed + ' x-amz-signature=' + second
        });
        const serialized = JSON.stringify(combined);
        assert(serialized.indexOf(second) === -1, 'second signature survived');
        assert(serialized.indexOf('first-signature') === -1, 'url signature survived');

        const ordinary = redactPresignedUploadBreadcrumb({
            category: 'xhr',
            type: 'http',
            data: {
                method: 'PUT',
                url: signed,
                status_code: 200
            }
        });
        assert(ordinary !== null, 'ordinary upload breadcrumb was dropped');
        assert(ordinary.data.method === 'PUT', 'ordinary method was dropped');
        assert(ordinary.data.status_code === 200, 'ordinary status was dropped');
        assert(ordinary.data.url.indexOf('first-signature') === -1, 'ordinary signature survived');
        assert(ordinary.data.url.indexOf('X-Amz-Expires=600') !== -1, 'ordinary expiry was dropped');

        const unrelated = { category: 'ui', message: 'opened activate' };
        assert(redactPresignedUploadBreadcrumb(unrelated) === unrelated, 'unrelated breadcrumb was changed');
    });

    await check('employer sources no longer load browser credentials', () => {
        const aws = readFileSync(join(root, 'src/app/providers/aws.service.ts'), 'utf8');
        const moduleSource = readFileSync(join(root, 'src/app/app.module.ts'), 'utf8');
        const sentry = readFileSync(join(root, 'src/app/providers/sentry.errorhandler.service.ts'), 'utf8');
        assert(aws.indexOf('18874368') !== -1, 'Employer 18 MB ceiling is missing');
        assert(aws.indexOf('aws-sdk') === -1, 'browser AWS SDK remains');
        assert(aws.indexOf('/aws/config') === -1, 'startup config URL remains');
        assert(aws.indexOf('/temp-upload/activate') !== -1, 'activation route is missing');
        assert(aws.indexOf('/temp-upload/url') !== -1, 'logged-in route is missing');
        assert(moduleSource.indexOf('awsStartupServiceFactory') === -1, 'AWS startup initializer remains');
        assert(sentry.indexOf('redactPresignedUploadBreadcrumb') !== -1, 'Sentry redaction is missing');
    });

    if (failures > 0) {
        console.error('EMPLOYER_PRESIGN_TESTS_FAILED ' + failures);
        process.exit(1);
    }
    console.log('EMPLOYER_PRESIGN_TESTS_OK');
}

main();
