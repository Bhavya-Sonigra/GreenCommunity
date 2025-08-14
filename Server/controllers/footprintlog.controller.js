import FootprintLog from "../models/FootprintLog.model.js";
import ipcc from "../lib/ipccEmissionCalculator.js";

// Create a new footprint log with IPCC-verified calculation
export async function createLog(req, res) {
  try {
    let calculation, emission;
    const { activityType, activity, details } = req.body;
    if (activityType === "transport") {
      calculation = ipcc.calculateTransport(details);
      emission = calculation.emission;
    } else if (activityType === "energy") {
      calculation = ipcc.calculateEnergy(details);
      emission = calculation.emission;
    } else if (activityType === "food") {
      calculation = ipcc.calculateFood(details);
      emission = calculation.emission;
    } else if (activityType === "waste") {
      calculation = ipcc.calculateWaste(details);
      emission = calculation.emission;
    } else {
      emission = req.body.emission;
      calculation = {
        method: "manual",
        source: req.body.calculationSource || "user",
        factors: req.body.calculationFactors || {},
      };
    }
    const log = await FootprintLog.create({
      ...req.body,
      user: req.user._id,
      emission,
      calculation,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all logs for the authenticated user with advanced filtering
export async function getUserLogs(req, res) {
  try {
    const {
      activityType,
      category,
      tags,
      startDate,
      endDate,
      location,
      project,
      community,
    } = req.query;

    let query = { user: req.user._id };
    if (activityType) query.activityType = activityType;
    if (category) query.category = category;
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (project) query.project = project;
    if (community) query.community = community;
    if (location) {
      if (location.country) query["location.country"] = location.country;
      if (location.city) query["location.city"] = location.city;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await FootprintLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single log by ID
export async function getLogById(req, res) {
  try {
    const log = await FootprintLog.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a log
export async function updateLog(req, res) {
  try {
    const log = await FootprintLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a log
export async function deleteLog(req, res) {
  try {
    const log = await FootprintLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get total emissions for the user with optional filters
export async function getTotalEmissions(req, res) {
  try {
    const {
      activityType,
      category,
      tags,
      startDate,
      endDate,
      project,
      community,
    } = req.query;

    let match = { user: req.user._id };
    if (activityType) match.activityType = activityType;
    if (category) match.category = category;
    if (tags) match.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (project) match.project = project;
    if (community) match.community = community;
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const result = await FootprintLog.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$emission" } } },
    ]);
    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get emissions breakdown by activityType
export async function getEmissionsByActivityType(req, res) {
  try {
    const match = { user: req.user._id };
    const result = await FootprintLog.aggregate([
      { $match: match },
      { $group: { _id: "$activityType", total: { $sum: "$emission" } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get emissions breakdown by category
export async function getEmissionsByCategory(req, res) {
  try {
    const match = { user: req.user._id };
    const result = await FootprintLog.aggregate([
      { $match: match },
      { $group: { _id: "$category", total: { $sum: "$emission" } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
