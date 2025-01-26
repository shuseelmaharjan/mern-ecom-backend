const { CompanyPolicy, CompanyPolicyLog } = require("../models/shop");

class PolicyService {
  async createPolicy(data, userId) {
    const { policyName, policyDescription } = data;
    const existingData = await CompanyPolicy.findOne({
      policyName,
      isActive: true,
    });
    if (existingData) {
      throw new Error("Policy already exists");
    }

    try {
      const newPolicy = new CompanyPolicy({
        policyName,
        policyDescription,
      });
      await newPolicy.save();

      await CompanyPolicyLog.create({
        action: "INSERT",
        modelAffected: "CompanyPolicy",
        performedBy: userId,
        performedAt: newPolicy._id,
        details: `Created policy with name: ${policyName}`,
      });
      return newPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPolicies() {
    try {
      const policies = await CompanyPolicy.find({ isActive: true });
      return policies;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePolicy(policyId, userId, data) {
    const { policyName, policyDescription } = data;

    const policy = await CompanyPolicy.findByIdAndUpdate(
      policyId,
      {
        policyName,
        policyDescription,
        updatedDate: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!policy) {
      throw new Error("Policy not found");
    }

    await CompanyPolicyLog.create({
      action: "UPDATE",
      modelAffected: "CompanyPolicy",
      performedBy: userId,
      performedAt: policyId,
      details: `Updated policy with name: ${policyName} and description: ${policyDescription}`,
    });

    return policy;
  }
}

module.exports = new PolicyService();
