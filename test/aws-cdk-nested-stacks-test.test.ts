import { App, Stack, StackProps } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { Construct } from "constructs";
import { AwsCdkNestedStacksTestNestedStack, AwsCdkNestedStacksTestNestedStackProps, AwsCdkNestedStacksTestStack } from "../lib/aws-cdk-nested-stacks-test-stack";

test('Test whole application with both stacks.', () => {
  const app = new App();

  // WHEN
  const stack = new AwsCdkNestedStacksTestStack(app, 'MyTestStack');

  // THEN
  const template = Template.fromStack(stack);

  // Count
  template.resourceCountIs('AWS::SQS::Queue', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);

  // Props
  template.hasResourceProperties('AWS::SQS::Queue', {
    QueueName: Match.stringLikeRegexp("MyQueue"),
  });
});

test('Test only the nested stack.', () => {
  const app = new App();

  // WHEN
  const stack = new StackWrapper(app, 'MyTestNestedStack', {
    queueName: "NestedQueue"
  });

  // THEN
  const template = Template.fromStack(stack);

  // Count 
  template.resourceCountIs('AWS::SQS::Queue', 1);
  template.resourceCountIs('AWS::SNS::Topic', 0);
  template.resourceCountIs('AWS::SNS::Subscription', 0);

  // Props
  template.hasResourceProperties('AWS::SQS::Queue', {
    QueueName: Match.stringLikeRegexp("NestedQueue"),
  });
});

interface StackWrapperProps extends StackProps, AwsCdkNestedStacksTestNestedStackProps { };

class StackWrapper extends Stack {
  constructor(scope: Construct, id: string, props: StackWrapperProps) {
    super(scope, id, props);
    new AwsCdkNestedStacksTestNestedStack(this, props);
  }
}
