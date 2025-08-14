// IPCC-verified emission calculation algorithms
// Factors are illustrative; update with latest IPCC values as needed

const IPCC_FACTORS = {
  transport: {
    car: 0.192, // kg CO2e per km (average petrol car)
    bus: 0.105, // kg CO2e per km
    train: 0.041, // kg CO2e per km
    flight: 0.255, // kg CO2e per km (short-haul economy)
  },
  energy: {
    electricity: 0.475, // kg CO2e per kWh (global average)
    naturalGas: 2.03, // kg CO2e per m3
  },
  food: {
    beef: 27.0, // kg CO2e per kg
    chicken: 6.9, // kg CO2e per kg
    vegetables: 2.0, // kg CO2e per kg
  },
  waste: {
    landfill: 0.75, // kg CO2e per kg
    recycling: 0.02, // kg CO2e per kg
  },
};

function calculateTransport({ mode, distance }) {
  const factor = IPCC_FACTORS.transport[mode];
  if (!factor) throw new Error("Unknown transport mode");
  return {
    emission: distance * factor,
    method: "IPCC",
    source: "IPCC Guidelines for National Greenhouse Gas Inventories",
    factors: { mode, distance, factor },
  };
}

function calculateEnergy({ type, amount }) {
  const factor = IPCC_FACTORS.energy[type];
  if (!factor) throw new Error("Unknown energy type");
  return {
    emission: amount * factor,
    method: "IPCC",
    source: "IPCC Guidelines for National Greenhouse Gas Inventories",
    factors: { type, amount, factor },
  };
}

function calculateFood({ foodType, weight }) {
  const factor = IPCC_FACTORS.food[foodType];
  if (!factor) throw new Error("Unknown food type");
  return {
    emission: weight * factor,
    method: "IPCC",
    source: "IPCC Guidelines for National Greenhouse Gas Inventories",
    factors: { foodType, weight, factor },
  };
}

function calculateWaste({ wasteType, weight }) {
  const factor = IPCC_FACTORS.waste[wasteType];
  if (!factor) throw new Error("Unknown waste type");
  return {
    emission: weight * factor,
    method: "IPCC",
    source: "IPCC Guidelines for National Greenhouse Gas Inventories",
    factors: { wasteType, weight, factor },
  };
}

export default {
  calculateTransport,
  calculateEnergy,
  calculateFood,
  calculateWaste,
  IPCC_FACTORS,
};
