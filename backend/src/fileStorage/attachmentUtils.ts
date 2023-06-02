import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'}),
        private readonly bucketName = s3Bucket
    ) {}

    getAttachmentUrl(bookId: string) {
        return `http://${this.bucketName}.s3.amazonaws.com/${bookId}`
    }

    getUploadUrl(bookId: string): string {
        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: bookId,
            Expires: +urlExpiration
        })
        return signedUrl as string
    }
}