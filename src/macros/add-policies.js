/**
 * Add Managed Policies
 *
 * @param {object} arc - Parsed `app.arc` value
 * @param {object} sam - Generated CloudFormation template
 * @param {string} stage - Deployment target runtime environment 'staging' or 'production'
 * @returns {object} Modified CloudFormation template
 */

module.exports = async function macro(arc, cfn) {
  if (cfn.Resources.Role) {
    const newPolicies = [
      {
        PolicyName: 'ArcSESPolicy',
        PolicyDocument: {
          Statement: [
            {
              Effect: 'Allow',
              Action: ['ses:*'],
              Resource: '*',
            },
          ],
        },
      },
    ]
    cfn.Resources.Role.Properties.Policies = [...cfn.Resources.Role.Properties.Policies, ...newPolicies]
  }
  return cfn
}