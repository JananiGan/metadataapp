#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MetadataappStack } from '../lib/metadataapp-stack';

const app = new cdk.App();
new MetadataappStack(app, 'MetadataappStack', {
   env: { account: '272863640326', region: 'eu-north-1' },
});