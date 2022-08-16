import { Duration, NestedStack, NestedStackProps, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export interface AwsCdkNestedStacksTestNestedStackProps extends NestedStackProps {
  queueName: string,
};

export class AwsCdkNestedStacksTestNestedStack extends NestedStack {
  public readonly queue: IQueue;

  constructor(scope: Construct, props: AwsCdkNestedStacksTestNestedStackProps) {
    super(scope, "SQS Stack", props);

    const { queueName } = props;

    this.queue = new Queue(scope, 'AwsCdkNestedStacksTestQueue', {
      queueName,
      visibilityTimeout: Duration.seconds(300)
    });
  }
}

export class AwsCdkNestedStacksTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sqsStack = new AwsCdkNestedStacksTestNestedStack(this, {
      queueName: "MyQueue",
    })

    const myTopic = new Topic(this, 'MyTopic');

    myTopic.addSubscription(new SqsSubscription(sqsStack.queue));

  }
}
