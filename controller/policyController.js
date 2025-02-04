const policyService = require("../services/companyPolicyService");
const GetUserId = require("../helper/getUserId");

class PolicyController {
  async createPolicy(req, res) {
    try {
      const userId = new GetUserId(req);
      const id = await userId.getUserId();
      await policyService.createPolicy(req.body, id);
      res.status(201).json({ message: "Policy created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPolicies(req, res) {
    try {
      const policies = await policyService.getPolicies();
      res.status(200).json(policies);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching policies", error: error.message });
    }
  }

  async updatePolicy(req, res) {
    const userId = new GetUserId(req);
    const id = await userId.getUserId();
    const { policyId } = req.params;
    try {
      const result = await policyService.updatePolicy(policyId, id, req.body);
      res.status(200).json({ message: "Policy updated successfully", result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createShipping(req, res) {
    try {
      const userId = new GetUserId(req);
      const id = await userId.getUserId();
      await policyService.createShippingPolicy(req.body, id);
      res.status(201).json({ message: "Shipping created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  }

  async getShipping(req, res) {
    try {
      const policies = await policyService.getShippingPolicy();
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching shipping policies",
        error: error.message,
      });
    }
  }

  async deactivateShippingPolicy(req, res) {
    try {
      const policyID = req.params.policyId;
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      await policyService.deactivateShippingPolicy(policyID, id);
      res.status(200).json({ message: "Policy deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateShippingPolicy(req, res) {
    try {
      const policyId = req.params.policyId;
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      await policyService.updateShippingPolicy(policyId, id, req.body);
      res.status(200).json({ message: "Policy updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createReturnPolicy(req, res) {
    try {
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      await policyService.createReturnPolicy(req.body, id);
      res.status(200).json({ message: "Return policy updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getReturnPolicies(req, res) {
    try {
      const policies = await policyService.getReturnPolicies();
      res.status(200).json(policies);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching policies", error: error.message });
    }
  }

  async updateReturnPolicy(req, res) {
    const userId = new GetUserId(req);
    const id = await userId.getUserId();
    const { policyId } = req.params;
    try {
      const result = await policyService.updateReturnPolicy(
        policyId,
        id,
        req.body
      );
      res
        .status(200)
        .json({ message: "Return policy updated successfully", result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new PolicyController();
