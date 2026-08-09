### AI Extraction Blueprint: Regulation 31 Shareholding Pattern

To build a seamless DRHP generator, your AI must process the **Quarterly Shareholding Pattern Filing** sequentially. This document acts as the single source of truth for the company's cap table.Below is the strict page-by-page extraction logic, the required AI actions, and the exact user questionnaire to deploy in your interface.

### Part 1: Where to Upload

*   **Pipeline Stage:** **Step 1: CORPORATE IDENTITY**
    
*   **Sub-Section UI:** _Capital Structure & Ownership_
    
*   **Document Required:** "Latest Shareholding Pattern under SEBI (LODR) Regulation 31"
    

### Part 2: Sequential AI Extraction & Action Plan

Your AI should scan the PDF in the exact order the tables appear in standard SEBI formats. Here is the logic flow:

#### 1\. First Scan: General Information (Cover/Header Details)

*   **Target Data:** Name of Listed Entity, Scrip Code, Quarter Ending Date, and Declaration checkboxes (e.g., "Whether the Listed Entity has issued any partly paid up shares?").
    
*   **AI Action:**
    
    *   Sets the "As Of" date for all capitalization tables in the DRHP.
        
    *   Flags any "Yes" answers in the declarations (like outstanding convertible securities or warrants) to auto-generate the **"Notes to Capital Structure"** warning the drafter of potential equity dilution.
        

#### 2\. Second Scan: Table I (Summary Statement)

*   **Target Data:** Total number of shareholders, Total Promoter & Promoter Group shares, Total Public shares, and Total Equity Shares.
    
*   **AI Action:**
    
    *   Auto-generates the **"Pre-Issue Shareholding Summary"** table in the _Capital Structure_ chapter.
        
    *   Calculates the exact pre-issue public float percentage.
        

#### 3\. Third Scan: Table II (Promoter & Promoter Group)

*   **Target Data:** Individual names, entity names, number of fully paid-up equity shares held, percentage of total voting rights, and **Number of Shares Pledged or otherwise encumbered**.
    
*   **AI Action:**
    
    *   Populates the **"Our Promoters and Promoter Group"** chapter with exact names and holdings.
        
    *   **Compliance Check:** Adds up unencumbered promoter shares to verify if they meet the mandatory 20% Minimum Promoter Contribution (MPC) required by SEBI ICDR.
        
    *   Drafts the **"Details of Promoter's Contribution and Lock-in"** section.
        

#### 4\. Fourth Scan: Table III (Public Shareholders)

*   **Target Data:** Holdings of Mutual Funds, Alternate Investment Funds (AIFs), Foreign Portfolio Investors (FPIs), and any individual/corporate holding more than 1% of the total shares.
    
*   **AI Action:**
    
    *   Identifies and extracts the names and holdings of the Top 10 public shareholders.
        
    *   Auto-populates the **"Top 10 Equity Shareholders"** table required in the _Capital Structure_ chapter.
        

#### 5\. Fifth Scan: Table V (Significant Beneficial Owners - SBO)

*   **Target Data:** Name of the SBO, Nationality, and the percentage of ultimate voting rights/shares held indirectly.
    
*   **AI Action:**
    
    *   Populates the **"Significant Beneficial Ownership"** table.
        
    *   Cross-references SBO names with the Promoter list to draft the narrative on ultimate corporate control.
        

### Part 3: The User Interface Questionnaire

While the PDF provides the numbers, SEBI requires historical context that the PDF does not contain. After the user uploads the document in **Step 1**, present this dynamic questionnaire to fill the remaining compliance gaps:**Upload Prompt (UI Text):**

> **Upload Shareholding Pattern**_Please upload your most recent SEBI (LODR) Reg 31 Shareholding Pattern Filing (PDF). Our AI will automatically generate your Pre-Issue Capital Structure, Promoter Profiles, and SBO declarations._

**Post-Upload Dynamic Questionnaire:**Once the AI extracts the data, it should prompt the user with the following targeted questions to complete the DRHP narrative:

1.  **Recent Allotments:**
    
    *   _Question:_ "The uploaded pattern is dated \[Insert Quarter Ending Date\]. Have there been any fresh allotments, ESOP exercises, or buybacks between this date and today?"
        
    *   _Input:_ \[Yes/No\] -> If Yes, request a CSV upload of the new cap table adjustments.
        
2.  **Promoter Lock-In Identification:**
    
    *   _Question:_ "SEBI requires 20% of the post-issue capital to be locked in for 18 months. Our AI identified \[Insert Promoter Name\] holding \[Insert %\]. Do you want to designate this specific holding for the Minimum Promoter Contribution (MPC)?"
        
    *   _Input:_ \[Checkbox list of extracted promoters\].
        
3.  **Historical Build-up:**
    
    *   _Question:_ "For the promoters identified (e.g., \[Promoter 1\], \[Promoter 2\]), SEBI requires the history of how they acquired these shares. Please upload the 'Return of Allotment (PAS-3)' or provide the acquisition dates and issue prices."
        
    *   _Input:_ \[File Upload / Text Area\].
        
4.  **Promoter Group Validation:**
    
    *   _Question:_ "Are there any immediate relatives or affiliated corporate bodies of the Promoters who hold shares but were NOT classified under 'Promoter Group' in this filing?"
        
    *   _Input:_ \[Yes/No\] -> If Yes, trigger an AI form to add them to the DRHP Promoter Group disclosures.
        

Would you like me to map out the exact AI calculation logic required to project the **Post-Issue** capitalization table based on this extracted pre-issue data?