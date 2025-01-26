const {
  CompanyPolicy,
  CompanyPolicyLog,
  CompanyShippingPolicy,
  CompanyShippingPolicyLog,
} = require("../models/shop");

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

  async createShippingPolicy(data, userId) {
    const {
      shippingPolicyName,
      shippingMethod,
      shippingDays,
      shippingPolicyDescription,
      cod,
    } = data;
    const existingData = await CompanyShippingPolicy.findOne({
      shippingMethod,
      isActive: true,
    });
    if (existingData) {
      throw new Error("Shipping policy already exists");
    }

    try {
      const newShippingPolicy = new CompanyShippingPolicy({
        shippingPolicyName,
        shippingMethod,
        shippingDays,
        shippingPolicyDescription,
        cod,
      });
      await newShippingPolicy.save();

      await CompanyShippingPolicyLog.create({
        action: "INSERT",
        modelAffected: "CompanyShippingPolicy",
        performedBy: userId,
        performedAt: newShippingPolicy._id,
        details: `Created shipping policy with name: ${shippingPolicyName}`,
      });
      return newShippingPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getShippingPolicy() {
    try {
      const policies = await CompanyShippingPolicy.find({ isActive: true });
      return policies;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PolicyService();
