from pydantic import BaseModel, Field


class ShareholdingPattern(BaseModel):
    shareholder_category: str
    shareholder_name: str = ""
    number_of_shares: str = ""
    percentage: str = ""
    voting_rights: str = ""
    other_details: str = ""


class PrePostIssueSplit(BaseModel):
    shareholder_category: str
    pre_issue_shares: str = ""
    pre_issue_percentage: str = ""
    post_issue_shares: str = ""
    post_issue_percentage: str = ""
    change: str = ""
    other_details: str = ""


class CapitalStructureSectionData(BaseModel):
    page_geometry: dict
    shareholding_pattern: list[ShareholdingPattern] = Field(
        default_factory=list
    )
    pre_post_issue_split: list[PrePostIssueSplit] = Field(
        default_factory=list
    )