---
title: Deploy react app as static page in the AWS s3
description: Introduce how to deploy react-app as static page in the AWS s3.
tags: Nodejs, English, Deploy
image: https://cdn.stocksnap.io/img-thumbs/960w/YQ5HTMOKU3.jpg
---
# Deploy this react app as static page in the AWS s3.

## AWS configuration
Create an [AWS](https://aws.amazon.com/) account to deploy in S3. 

### IAM Profile
Do not use root account to deploy this react app. First log into your account and Go IAM manager: Then click on the `User menu` on the left, and `Add User` button. 
Fill the fields `Username` and tick `Programmatic access`. 

Click on `Next: Permissions`, Choice the `AmazonS3FullAccess` policy name. Then click the `Create user`. Copy the `Access key` and `Access ID` to the memo.

### S3 Bucket creation

Use the `domain` if you have like `example.com` or `www.example.com` for you Bucket name.
And choice a Region for deploy this app. (Recommand you set region option to the target user region for better site performance.)
![image-url](https://cdn-images-1.medium.com/max/1000/1*aKGNlogYGdCWIvFQBEtZIQ.png)

Then Next, Next, Next until you bucket is created. Select the bucket once it is done. Next you have to set the permissions and set up you bucket as static hosting.

Go to `Permissions` option and click the `Bucket Policy` Use `Policy Generator`.

Fill Step 1: S3 Bucket Policy

Fill Step 2: Effect: Allow, Principal: *, AWS Service: Amazon S3, Actions: “GetObject”. For the ARN, you have to take the name of your bucket, and add /* at the end (meaning everyone can access all your files).

In my case, it is: `arn:aws:s3:::example.com/*` or `arn:aws:s3:::www.wonderful-app/*`. Click on `Add statement` and `Generate Policy` copy the yml like setting to the `bucket policy` and save it.

Then go to the `Properties` choice `Static Website hosting`, In this project, you need set `index.html` to the Index Document and Error Document.

> Notice to memo the `Endpoint` which will use to link you domain.

Finally add a deploy scripts into your `package.json` like:
```javascript
"scripts": {
  "deploy": "aws s3 sync build/ s3://YOUR_S3_DEPLOY_BUCKET_NAME",
```

## Install AWS CLI and deploy to S3

Require you have install a python2.6.5+ or python 3.3+ environment.
```bash
$ pip install awscli --upgrade --user
```
Verify you AWS CLI installed correctly use the following command,
```bash
$ aws --version
aws-cli/1.16.27 Python/2.7.5 Linux/3.10.0-693.21.1.el7.x86_64 botocore/1.12.17
```
configure aws cli use the above noted Access ID and Access Token.
```
$ aws configure
```
Build you react static source and upload to you S3.
```bash
$ npm run build
$ npm run deploy
```