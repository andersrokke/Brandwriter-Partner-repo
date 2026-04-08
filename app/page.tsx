"use client";

import React, { useMemo, useState } from "react";

const TIER_PRICES = {
  XS: 1300,
  S: 3700,
  M: 13300,
  L: 47000,
  XL: 180000,
  XXL: 600000,
};

const BLP_STANDARD = 350000;
const BLP_HIGH = 550000;
const BLP_KICKBACK = 0.3;
const RECURRING_YEAR_1 = 0.3;
const RECURRING_YEAR_2 = 0.1;
const RECURRING_YEAR_3 = 0.1;

const defaultTierCustomers = {
  XS: { y1: 3, y2: 4, y3: 5 },
  S: { y1: 2, y2: 3, y3: 4 },
  M: { y1: 1, y2: 2, y3: 3 },
  L: { y1: 1, y2: 1, y3: 2 },
  XL: { y1: 0, y2: 1, y3: 1 },
  XXL: { y1: 0, y2: 0, y3: 0 },
};

function formatNok(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function Page() {
  const [tierCustomers, setTierCustomers] = useState(defaultTierCustomers);
  const [blpStandard, setBlpStandard] = useState(4);
  const [blpHigh, setBlpHigh] = useState(3);

  const updateTier = (
    tier: keyof typeof defaultTierCustomers,
    year: "y1" | "y2" | "y3",
    value: number
  ) => {
    setTierCustomers((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [year]: Math.max(0, value || 0),
      },
    }));
  };

  const metrics = useMemo(() => {
    let recurringY1 = 0;
    let recurringY2 = 0;
    let recurringY3 = 0;

    (Object.keys(TIER_PRICES) as Array<keyof typeof TIER_PRICES>).forEach((tier) => {
      const price = TIER_PRICES[tier];
      recurringY1 += tierCustomers[tier].y1 * price * 12 * RECURRING_YEAR_1;
      recurringY2 += tierCustomers[tier].y2 * price * 12 * RECURRING_YEAR_2;
      recurringY3 += tierCustomers[tier].y3 * price * 12 * RECURRING_YEAR_3;
    });

    const blpY1 =
      blpStandard * BLP_STANDARD * BLP_KICKBACK +
      blpHigh * BLP_HIGH * BLP_KICKBACK;

    return {
      blpY1,
      recurringY1,
      recurringY2,
      recurringY3,
      total: blpY1 + recurringY1 + recurringY2 + recurringY3,
    };
  }, [tierCustomers, blpStandard, blpHigh]);

  return (
    <main
      style={{
        background: "#f7f3ee",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>
          BrandWriter Partner Earnings Calculator
        </h1>
        <p style={{ fontSize: 18, color: "#4b5563", marginBottom: 32 }}>
          Estimate partner earnings from BLP kickback in year 1 and recurring revenue
          share over years 1–3.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Tier inputs</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Tier</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Monthly price</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Year 1</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Year 2</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Year 3</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(TIER_PRICES) as Array<keyof typeof TIER_PRICES>).map((tier) => (
                  <tr key={tier}>
                    <td style={{ padding: "12px 8px" }}>{tier}</td>
                    <td style={{ padding: "12px 8px" }}>{formatNok(TIER_PRICES[tier])}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <input
                        type="number"
                        min={0}
                        value={tierCustomers[tier].y1}
                        onChange={(e) => updateTier(tier, "y1", Number(e.target.value))}
                        style={{ width: 80, padding: 8 }}
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <input
                        type="number"
                        min={0}
                        value={tierCustomers[tier].y2}
                        onChange={(e) => updateTier(tier, "y2", Number(e.target.value))}
                        style={{ width: 80, padding: 8 }}
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <input
                        type="number"
                        min={0}
                        value={tierCustomers[tier].y3}
                        onChange={(e) => updateTier(tier, "y3", Number(e.target.value))}
                        style={{ width: 80, padding: 8 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 32 }}>
              <h2>BLP bonus year 1 only</h2>
              <p style={{ color: "#4b5563" }}>
                BLP is a one-time customer investment, so partner kickback is only paid in year 1.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <h3>Standard BLP</h3>
                  <p>Price: {formatNok(BLP_STANDARD)}</p>
                  <p>Partner earnings per deal: {formatNok(BLP_STANDARD * BLP_KICKBACK)}</p>
                  <label>Customers year 1</label>
                  <br />
                  <input
                    type="number"
                    min={0}
                    value={blpStandard}
                    onChange={(e) =>
                      setBlpStandard(Math.max(0, Number(e.target.value) || 0))
                    }
                    style={{ width: 120, padding: 8, marginTop: 8 }}
                  />
                </div>

                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <h3>High BLP</h3>
                  <p>Price: {formatNok(BLP_HIGH)}</p>
                  <p>Partner earnings per deal: {formatNok(BLP_HIGH * BLP_KICKBACK)}</p>
                  <label>Customers year 1</label>
                  <br />
                  <input
                    type="number"
                    min={0}
                    value={blpHigh}
                    onChange={(e) =>
                      setBlpHigh(Math.max(0, Number(e.target.value) || 0))
                    }
                    style={{ width: 120, padding: 8, marginTop: 8 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>
                Total partner earnings over 3 years
              </p>
              <h2 style={{ fontSize: 36, margin: 0 }}>{formatNok(metrics.total)}</h2>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>BLP earnings year 1</p>
              <h3>{formatNok(metrics.blpY1)}</h3>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Recurring earnings year 1</p>
              <h3>{formatNok(metrics.recurringY1)}</h3>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Recurring earnings year 2</p>
              <h3>{formatNok(metrics.recurringY2)}</h3>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 24,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Recurring earnings year 3</p>
              <h3>{formatNok(metrics.recurringY3)}</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
