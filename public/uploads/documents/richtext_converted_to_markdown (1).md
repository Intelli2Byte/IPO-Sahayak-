To project the **Post-Issue Capital Structure** from the Pre-Issue data, your AI needs to bridge the gap between the uploaded Shareholding Pattern and the proposed IPO metrics.Here is the exact AI calculation logic, followed by the detailed UI questionnaire and input fields you need to build into your generator.

### Part 1: AI Calculation Logic (The Math Engine)

In a DRHP, the exact issue price is usually unknown (it is discovered later). Therefore, the Fresh Issue is stated in Rupee value (₹), while the Offer for Sale (OFS) is stated in the number of shares. Your AI must use an estimated "Floor Price" and "Cap Price" to calculate the required equity dilution and post-issue capital.**Variables Extracted from PDF (Pre-Issue):**

*   $N\_{pre}$: Total Pre-Issue Equity Shares
    
*   $P\_{shares}$: Total Pre-Issue Promoter Shares
    

**Variables Required from User:**

*   $V\_{fresh}$: Total Rupee Value of the Fresh Issue
    
*   $O\_{shares}$: Total Number of Shares offered in the OFS
    
*   $Price\_{cap}$: The upper band of the estimated issue price
    

**AI Processing Formulas:**

1.  **Calculate New Shares to be Issued:**$N\_{fresh} = \\frac{V\_{fresh}}{Price\_{cap}}$
    
2.  **Calculate Post-Issue Total Capital:**$N\_{post} = N\_{pre} + N\_{fresh}$
    
3.  **Calculate Post-Issue Promoter Percentage:**$P\_{post\\\_percent} = \\left( \\frac{P\_{shares} - O\_{promoter\\\_shares}}{N\_{post}} \\right) \\times 100$
    
4.  **SEBI Compliance Validation:**If $P\_{post\\\_percent} < 20\\%$, the AI must trigger a hard stop warning that the Minimum Promoter Contribution (MPC) threshold is violated.
    

### Part 2: Detailed UI Questionnaire & Input Mapping

This questionnaire should appear in **Step 1: CORPORATE IDENTITY** immediately after the AI has successfully parsed the _Regulation 31 Shareholding Pattern PDF_.

#### UI Screen Title: "IPO Structure & Post-Issue Projections"

**Helper Text:** _"Your pre-issue capital structure has been successfully extracted. To generate the 'Capital Structure' chapter and calculate your post-issue dilution, please define the parameters of your proposed Initial Public Offering."_

#### Section A: The Issue Size

_This defines the fundamental architecture of the IPO._**1\. Does this IPO include a Fresh Issue of shares?**

*   **Input Type:** Radio Buttons \[ Yes \] \[ No \]
    
*   _Conditional Logic:_ If \[ Yes \], display:
    
    *   **Total Value of Fresh Issue (in ₹ Millions):**
        
    *   **Input Type:** Numeric Text Box \[ e.g., 5000 \]
        

**2\. Does this IPO include an Offer for Sale (OFS) by existing shareholders?**

*   **Input Type:** Radio Buttons \[ Yes \] \[ No \]
    
*   _Conditional Logic:_ If \[ Yes \], the AI dynamically lists the Promoters and Top 10 Public Shareholders extracted from the PDF, creating a matrix:
    
    *   **Select Selling Shareholders & Quantities:**
        
    *   **Input Type:** Dynamic Data Grid**Extracted Shareholder NamePre-Issue HoldingMax Shares Eligible for OFSShares Offered in OFS (Input)**\[AI: Auto-filled Promoter A\]\[AI: Auto-filled\]\[AI: Auto-filled\]\[ Numeric Input Box \]\[AI: Auto-filled Investor B\]\[AI: Auto-filled\]\[AI: Auto-filled\]\[ Numeric Input Box \]_Add Unlisted Shareholder_\[ + Add Row Button \]
        

#### Section B: Valuation Estimates (For DRHP Calculations)

_Because the DRHP does not have a fixed price, the AI needs a baseline to draft the Post-Issue Capital tables._**3\. What is the estimated Issue Price for calculation purposes?**

*   **Helper Text:** _"This will not be printed in the DRHP, but is required by the AI to calculate the estimated number of fresh shares issued and post-issue promoter percentages."_
    
*   **Face Value per share:**
    
    *   **Input Type:** Dropdown \[ ₹1, ₹2, ₹5, ₹10 \] (Default to ₹10)
        
*   **Estimated Issue Price (₹ per share):**
    
    *   **Input Type:** Numeric Text Box \[ e.g., 250 \]
        

#### Section C: Pre-IPO Placements & Dilution

_SEBI requires disclosures if the company plans to raise private capital before the final RHP is filed._**4\. Does the company propose to undertake a Pre-IPO Placement prior to filing the Red Herring Prospectus?**

*   **Input Type:** Radio Buttons \[ Yes \] \[ No \]
    
*   _Conditional Logic:_ If \[ Yes \], display:
    
    *   **Maximum Size of Pre-IPO Placement (in ₹ Millions):**
        
    *   **Input Type:** Numeric Text Box \[ e.g., 1000 \]
        
    *   **Helper Text:** _"Note: If completed, the size of the Fresh Issue will be reduced by this exact amount in the final RHP."_
        

#### Section D: Document Uploads for Historical Tracking

_SEBI requires the statutory proof of how the existing capital was built._**5\. Upload Corporate Action Forms (Form PAS-3 / SH-7)**

*   **Helper Text:** _"To auto-generate the 'History of Equity Share Capital' table, upload the MCA filings that prove how the current shareholding pattern was achieved."_
    
*   **Input Type:** File Drag-and-Drop Zone \[ Upload PDF/XML \]
    
*   **AI Action:** Parses the MCA forms to extract dates of allotment, number of shares allotted, face value, issue price, and consideration (cash/other than cash) to build the historical cap table.