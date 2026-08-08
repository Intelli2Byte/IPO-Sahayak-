"""
IPO Sahayak - AI/Data Processing Core

This module provides reusable Python utilities for:
- IPO data preprocessing
- Financial metric calculation
- Risk scoring
- Subscription analysis
- Investor categorization
- Recommendation generation
- Data validation
- IPO comparison
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict, List, Optional
import math
import statistics


# ============================================================
# DATA MODELS
# ============================================================

@dataclass
class IPORecord:
    """Represents the core information of an IPO."""

    company_name: str
    issue_price: float
    lot_size: int
    issue_size: float
    subscription: float
    gmp: float = 0.0
    revenue: float = 0.0
    profit: float = 0.0
    debt: float = 0.0
    roe: float = 0.0
    listing_gain: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert IPO record into dictionary format."""
        return asdict(self)


@dataclass
class RiskResult:
    """Stores IPO risk evaluation results."""

    score: float
    level: str
    factors: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class InvestorProfile:
    """Represents an investor's preferences."""

    name: str
    investment_amount: float
    risk_tolerance: str
    investment_horizon: str
    preferred_sector: Optional[str] = None


# ============================================================
# VALIDATION ENGINE
# ============================================================

class IPOValidator:
    """Validates IPO input data before analysis."""

    REQUIRED_FIELDS = [
        "company_name",
        "issue_price",
        "lot_size",
        "issue_size",
        "subscription",
    ]

    @staticmethod
    def validate_numeric(value: Any, field_name: str) -> None:
        """Ensure that a value is numeric and non-negative."""
        if not isinstance(value, (int, float)):
            raise TypeError(f"{field_name} must be numeric.")

        if value < 0:
            raise ValueError(f"{field_name} cannot be negative.")

    @classmethod
    def validate_ipo(cls, ipo: IPORecord) -> bool:
        """Validate an IPO record."""
        if not ipo.company_name.strip():
            raise ValueError("Company name cannot be empty.")

        numeric_fields = [
            ("issue_price", ipo.issue_price),
            ("lot_size", ipo.lot_size),
            ("issue_size", ipo.issue_size),
            ("subscription", ipo.subscription),
            ("gmp", ipo.gmp),
            ("revenue", ipo.revenue),
            ("profit", ipo.profit),
            ("debt", ipo.debt),
            ("roe", ipo.roe),
        ]

        for name, value in numeric_fields:
            cls.validate_numeric(value, name)

        if ipo.lot_size <= 0:
            raise ValueError("Lot size must be greater than zero.")

        return True


# ============================================================
# FINANCIAL CALCULATIONS
# ============================================================

class FinancialAnalyzer:
    """Performs financial analysis for IPO companies."""

    @staticmethod
    def calculate_market_cap(
        issue_price: float,
        outstanding_shares: float,
    ) -> float:
        """Calculate estimated market capitalization."""
        return issue_price * outstanding_shares

    @staticmethod
    def calculate_pe_ratio(
        market_price: float,
        earnings_per_share: float,
    ) -> Optional[float]:
        """Calculate price-to-earnings ratio."""
        if earnings_per_share <= 0:
            return None

        return round(market_price / earnings_per_share, 2)

    @staticmethod
    def calculate_debt_to_equity(
        debt: float,
        equity: float,
    ) -> Optional[float]:
        """Calculate debt-to-equity ratio."""
        if equity <= 0:
            return None

        return round(debt / equity, 2)

    @staticmethod
    def calculate_profit_margin(
        revenue: float,
        profit: float,
    ) -> Optional[float]:
        """Calculate net profit margin."""
        if revenue <= 0:
            return None

        return round((profit / revenue) * 100, 2)

    @staticmethod
    def calculate_revenue_growth(
        previous_revenue: float,
        current_revenue: float,
    ) -> Optional[float]:
        """Calculate year-over-year revenue growth."""
        if previous_revenue <= 0:
            return None

        growth = (
            (current_revenue - previous_revenue)
            / previous_revenue
        ) * 100

        return round(growth, 2)

    @staticmethod
    def calculate_expected_listing_price(
        issue_price: float,
        gmp: float,
    ) -> float:
        """Estimate listing price using GMP."""
        return round(issue_price + gmp, 2)


# ============================================================
# SUBSCRIPTION ANALYSIS
# ============================================================

class SubscriptionAnalyzer:
    """Analyzes IPO subscription levels."""

    @staticmethod
    def classify_subscription(subscription: float) -> str:
        """Classify subscription demand."""

        if subscription < 1:
            return "Under-subscribed"

        if subscription < 3:
            return "Low Demand"

        if subscription < 10:
            return "Moderate Demand"

        if subscription < 25:
            return "High Demand"

        return "Very High Demand"

    @staticmethod
    def demand_score(subscription: float) -> float:
        """Convert subscription into a normalized score."""

        if subscription <= 0:
            return 0.0

        score = min(math.log1p(subscription) * 20, 100)

        return round(score, 2)

    @staticmethod
    def compare_subscription(
        current: float,
        previous: float,
    ) -> Dict[str, Any]:
        """Compare subscription with another IPO."""

        if previous <= 0:
            return {
                "change_percent": None,
                "trend": "Insufficient Data",
            }

        change = ((current - previous) / previous) * 100

        if change > 5:
            trend = "Increasing"
        elif change < -5:
            trend = "Decreasing"
        else:
            trend = "Stable"

        return {
            "change_percent": round(change, 2),
            "trend": trend,
        }


# ============================================================
# GMP ANALYSIS
# ============================================================

class GMPAnalyzer:
    """Analyzes Grey Market Premium information."""

    @staticmethod
    def calculate_gmp_percentage(
        issue_price: float,
        gmp: float,
    ) -> float:
        """Calculate GMP as a percentage of issue price."""

        if issue_price <= 0:
            return 0.0

        return round((gmp / issue_price) * 100, 2)

    @staticmethod
    def classify_gmp(
        issue_price: float,
        gmp: float,
    ) -> str:
        """Classify GMP strength."""

        percentage = GMPAnalyzer.calculate_gmp_percentage(
            issue_price,
            gmp,
        )

        if percentage <= 0:
            return "Weak"

        if percentage < 5:
            return "Low"

        if percentage < 15:
            return "Moderate"

        if percentage < 30:
            return "Strong"

        return "Very Strong"


# ============================================================
# RISK SCORING ENGINE
# ============================================================

class RiskEngine:
    """Calculates a simplified IPO risk score."""

    def evaluate(self, ipo: IPORecord) -> RiskResult:
        """Generate an IPO risk score."""

        score = 50.0
        factors: List[str] = []

        # Debt analysis
        if ipo.revenue > 0:
            debt_ratio = ipo.debt / ipo.revenue
        else:
            debt_ratio = 1.0

        if debt_ratio > 0.75:
            score += 15
            factors.append("High debt relative to revenue")
        elif debt_ratio < 0.25:
            score -= 10
            factors.append("Healthy debt position")

        # Profitability
        if ipo.revenue > 0:
            margin = (ipo.profit / ipo.revenue) * 100
        else:
            margin = 0

        if margin < 0:
            score += 20
            factors.append("Company reports negative profitability")
        elif margin < 10:
            score += 5
            factors.append("Low profit margin")
        else:
            score -= 10
            factors.append("Healthy profit margin")

        # ROE
        if ipo.roe >= 15:
            score -= 10
            factors.append("Strong return on equity")
        elif ipo.roe < 8:
            score += 5
            factors.append("Weak return on equity")

        # Subscription
        if ipo.subscription >= 20:
            score -= 10
            factors.append("Strong investor demand")
        elif ipo.subscription < 2:
            score += 10
            factors.append("Weak subscription demand")

        # GMP
        if ipo.gmp > 0:
            score -= 5
            factors.append("Positive grey market premium")
        elif ipo.gmp < 0:
            score += 10
            factors.append("Negative grey market premium")

        score = max(0, min(score, 100))

        if score < 30:
            level = "Low Risk"
        elif score < 60:
            level = "Moderate Risk"
        elif score < 80:
            level = "High Risk"
        else:
            level = "Very High Risk"

        return RiskResult(
            score=round(score, 2),
            level=level,
            factors=factors,
        )


# ============================================================
# INVESTOR RECOMMENDATION ENGINE
# ============================================================

class RecommendationEngine:
    """Generates recommendations based on investor profile."""

    RISK_LIMITS = {
        "low": 40,
        "moderate": 65,
        "high": 100,
    }

    def recommend(
        self,
        ipo: IPORecord,
        investor: InvestorProfile,
    ) -> Dict[str, Any]:

        risk_result = RiskEngine().evaluate(ipo)

        tolerance = investor.risk_tolerance.lower()
        allowed_risk = self.RISK_LIMITS.get(tolerance, 65)

        if risk_result.score > allowed_risk:
            decision = "Avoid"
            explanation = (
                "The estimated risk is above the investor's "
                "selected risk tolerance."
            )

        elif ipo.subscription >= 10 and ipo.gmp > 0:
            decision = "Consider"
            explanation = (
                "The IPO shows strong subscription and "
                "positive market sentiment."
            )

        elif ipo.subscription >= 3:
            decision = "Watch"
            explanation = (
                "Demand is reasonable, but additional "
                "financial analysis is recommended."
            )

        else:
            decision = "Avoid"
            explanation = (
                "Current subscription indicators do not "
                "provide strong demand confirmation."
            )

        return {
            "company": ipo.company_name,
            "decision": decision,
            "risk_level": risk_result.level,
            "risk_score": risk_result.score,
            "explanation": explanation,
        }


# ============================================================
# IPO COMPARISON ENGINE
# ============================================================

class IPOComparisonEngine:
    """Compares multiple IPO records."""

    @staticmethod
    def rank_by_subscription(
        ipos: List[IPORecord],
    ) -> List[IPORecord]:
        """Rank IPOs by subscription demand."""

        return sorted(
            ipos,
            key=lambda ipo: ipo.subscription,
            reverse=True,
        )

    @staticmethod
    def rank_by_gmp(
        ipos: List[IPORecord],
    ) -> List[IPORecord]:
        """Rank IPOs by GMP."""

        return sorted(
            ipos,
            key=lambda ipo: ipo.gmp,
            reverse=True,
        )

    @staticmethod
    def rank_by_profitability(
        ipos: List[IPORecord],
    ) -> List[IPORecord]:
        """Rank IPOs by profit margin."""

        def margin(ipo: IPORecord) -> float:
            if ipo.revenue <= 0:
                return 0

            return ipo.profit / ipo.revenue

        return sorted(
            ipos,
            key=margin,
            reverse=True,
        )


# ============================================================
# DATA NORMALIZATION
# ============================================================

class IPODataProcessor:
    """Cleans and normalizes IPO datasets."""

    @staticmethod
    def normalize_company_name(name: str) -> str:
        """Normalize company names."""
        return " ".join(name.strip().split()).title()

    @staticmethod
    def normalize_percentage(value: Any) -> float:
        """Convert percentage values into float format."""

        if value is None:
            return 0.0

        if isinstance(value, str):
            cleaned = value.strip().replace("%", "")

            try:
                return float(cleaned)
            except ValueError:
                return 0.0

        return float(value)

    @staticmethod
    def clean_numeric(value: Any) -> float:
        """Clean currency and numeric values."""

        if value is None:
            return 0.0

        if isinstance(value, str):
            value = (
                value.replace(",", "")
                .replace("₹", "")
                .replace("$", "")
                .strip()
            )

            try:
                return float(value)
            except ValueError:
                return 0.0

        return float(value)

    @classmethod
    def clean_record(
        cls,
        record: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Clean a raw IPO dictionary."""

        cleaned = dict(record)

        if "company_name" in cleaned:
            cleaned["company_name"] = (
                cls.normalize_company_name(
                    str(cleaned["company_name"])
                )
            )

        numeric_fields = [
            "issue_price",
            "lot_size",
            "issue_size",
            "subscription",
            "gmp",
            "revenue",
            "profit",
            "debt",
            "roe",
            "listing_gain",
        ]

        for field in numeric_fields:
            if field in cleaned:
                cleaned[field] = cls.clean_numeric(
                    cleaned[field]
                )

        return cleaned


# ============================================================
# STATISTICAL ANALYSIS
# ============================================================

class IPOStatistics:
    """Provides statistical analysis over IPO collections."""

    @staticmethod
    def average_subscription(
        ipos: List[IPORecord],
    ) -> float:
        """Calculate average subscription."""
        values = [ipo.subscription for ipo in ipos]

        if not values:
            return 0.0

        return round(statistics.mean(values), 2)

    @staticmethod
    def median_subscription(
        ipos: List[IPORecord],
    ) -> float:
        """Calculate median subscription."""
        values = [ipo.subscription for ipo in ipos]

        if not values:
            return 0.0

        return round(statistics.median(values), 2)

    @staticmethod
    def highest_gmp(
        ipos: List[IPORecord],
    ) -> Optional[IPORecord]:
        """Return IPO with highest GMP."""

        if not ipos:
            return None

        return max(ipos, key=lambda ipo: ipo.gmp)

    @staticmethod
    def highest_subscription(
        ipos: List[IPORecord],
    ) -> Optional[IPORecord]:
        """Return IPO with highest subscription."""

        if not ipos:
            return None

        return max(
            ipos,
            key=lambda ipo: ipo.subscription,
        )


# ============================================================
# REPORT GENERATOR
# ============================================================

class IPOReportGenerator:
    """Creates structured reports for IPO analysis."""

    def generate(
        self,
        ipo: IPORecord,
    ) -> Dict[str, Any]:

        validator = IPOValidator()
        validator.validate_ipo(ipo)

        risk = RiskEngine().evaluate(ipo)

        gmp_percentage = GMPAnalyzer.calculate_gmp_percentage(
            ipo.issue_price,
            ipo.gmp,
        )

        gmp_category = GMPAnalyzer.classify_gmp(
            ipo.issue_price,
            ipo.gmp,
        )

        subscription_category = (
            SubscriptionAnalyzer.classify_subscription(
                ipo.subscription
            )
        )

        profit_margin = FinancialAnalyzer.calculate_profit_margin(
            ipo.revenue,
            ipo.profit,
        )

        expected_listing_price = (
            FinancialAnalyzer.calculate_expected_listing_price(
                ipo.issue_price,
                ipo.gmp,
            )
        )

        return {
            "generated_at": datetime.now().isoformat(),
            "company": ipo.company_name,
            "financials": {
                "revenue": ipo.revenue,
                "profit": ipo.profit,
                "debt": ipo.debt,
                "roe": ipo.roe,
                "profit_margin": profit_margin,
            },
            "market": {
                "issue_price": ipo.issue_price,
                "gmp": ipo.gmp,
                "gmp_percentage": gmp_percentage,
                "gmp_category": gmp_category,
                "expected_listing_price": expected_listing_price,
            },
            "subscription": {
                "value": ipo.subscription,
                "category": subscription_category,
            },
            "risk": risk.to_dict(),
        }


# ============================================================
# DEMO PIPELINE
# ============================================================

def initialize_ai_pipeline() -> bool:
    """Initialize and test the IPO Sahayak analysis pipeline."""

    sample_ipo = IPORecord(
        company_name="IPO Sahayak Technologies",
        issue_price=150.0,
        lot_size=100,
        issue_size=750.0,
        subscription=12.5,
        gmp=25.0,
        revenue=1200.0,
        profit=180.0,
        debt=250.0,
        roe=16.5,
        listing_gain=12.0,
    )

    report = IPOReportGenerator().generate(sample_ipo)

    print("=" * 60)
    print("IPO SAHAYAK - AI ANALYSIS ENGINE")
    print("=" * 60)
    print(f"Company       : {report['company']}")
    print(f"Subscription  : {report['subscription']['value']}x")
    print(f"Demand        : {report['subscription']['category']}")
    print(f"GMP            : ₹{sample_ipo.gmp}")
    print(f"GMP Category   : {report['market']['gmp_category']}")
    print(
        f"Expected Price: "
        f"₹{report['market']['expected_listing_price']}"
    )
    print(f"Risk Score     : {report['risk']['score']}")
    print(f"Risk Level     : {report['risk']['level']}")
    print("=" * 60)

    return True


if __name__ == "__main__":
    initialize_ai_pipeline()