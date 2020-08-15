import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions'
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core'
import { CdkPipeline, SimpleSynthAction, ShellScriptAction } from '@aws-cdk/pipelines'
import { CdkpipelinesDemoStage } from './cdkpipeline-demo-stage'

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const sourceArtifact = new codepipeline.Artifact()
    const cloudAssemblyArtifact = new codepipeline.Artifact()

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'badfun',
        repo: 'cdkpipelines-demo',
        trigger: codepipeline_actions.GitHubTrigger.POLL,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        
        // Install lambda dependency modules
        installCommand: 'cd lib/lambda && npm install && cd ../../',
        
        // Build step to compile the TypeScript Lambda
        buildCommand: 'npm run build',
      }),
    })

    // This is where we add the application stages
   const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
      env: { account: '271657195655', region: 'us-west-2' }
    })

    const preprodStage = pipeline.addApplicationStage(preprod)
    preprodStage.addActions(new ShellScriptAction({
      actionName: 'TestService',
      useOutputs: {
        ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput)
      },
      commands: [
        'curl -Ssf $ENDPOINT_URL'
      ]
    }))

    // pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'Prod', {
    //   env: { account: '073129232396', region: 'us-west-2'}
    // }))
  }
}
