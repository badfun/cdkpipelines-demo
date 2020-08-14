#!/usr/bin/env node
import { App } from '@aws-cdk/core'
import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack'
import { CdkpipelinesDemoStage } from '../lib/cdkpipeline-demo-stage'

const app = new App()

new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
  env: {
    account: '271657195655',
    region: 'us-west-2',
  },
})

new CdkpipelinesDemoStage(app, 'Dev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})

app.synth()
