file_dict = [
    {
        "tablename": "Master Beneficiary Summary File (MBSF) Base",
        "desc": "The MBSF base segment includes beneficiary enrollment information, (A/B/C/D). Medicare Advantage (Part C) and the Prescription Drug Program (Part D) plan enrollment information is included. What does this file include? (variable highlights). State, county annual SSA codes. State, county monthly FIPS codes. Zip code, State and County. Date of birth, date of death. Race. Reason for entitlement. Monthly enrollment for each part of the Medicare program, A/B/C/D. Dual eligible status. Part C plan and enrollment information. Part D plan and enrollment information. Part D low income cost sharing. Special considerations: Four additional segments are available for order with this file:. Chronic Conditions. Other Chronic Conditions. Cost and Use. National Death Index (NDI). Part C and Part D enrollment information are available beginning with the 2006 file year. Years prior to 2006 include an indicator variable for managed care enrollment.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MBSF%20ABCD_Version%20022023.xlsx",
        "sub-sections": None,
        "file-root": "MBSF_Master"
    },
    {
        "tablename": "Master Beneficiary Summary File (MBSF): 30 CCW Chronic Conditions Segment",
        "desc": "The 30 CCW Chronic Conditions segment of the Master Beneficiary Summary File (MBSF) flags each Medicare beneficiary for the presence of one of 30 specific chronic conditions. What does this file include? (variable highlights): Two flags for each chronic condition: First occurrence date. End of year indicator. Special considerations: The algorithms used to assign the flags are available from the CCW website. Algorithms requiring a multiple-year look back period are completed without requiring the researcher to order multiple years of data. Algorithms search data from Medicare Fee-For-Service (FFS) claims. This file is a segment that can be requested in addition to the Master Beneficiary Summary File (MBSF) base file. The algorithms for the 30 CCW Chronic Conditions data file use only ICD-10-CM diagnosis codes. The first full calendar year that is used to identify conditions is 2016. Three new conditions are added compared with the 27 CCW version. The changes to the algorithms compared with the 27 CCW version are noted on the individual variable pages and detailed descriptions of changes can be found in the Chronic Conditions File Enhancements white paper.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MBSF%2030%20Chronic%20Conditions_Version%20022023.xlsx",
        "sub-sections": None,
        "file-root": "MBSF_30_Cond"
    },
    {
        "tablename": "Master Beneficiary Summary File (MBSF): 27 CCW Chronic Conditions Segment",
        "desc": "The Chronic Conditions segment of the Master Beneficiary Summary File (MBSF) flags each Medicare beneficiary for the presence of one of 27 specific chronic conditions. What does this file include? (variable highlights): Three flags for each chronic condition: First occurrence date. Mid year indicator. End of year indicator. Special considerations: The algorithms used to assign the flags are available from the CCW website. Algorithms requiring a multiple-year look back period are completed without requiring the researcher to order multiple years of data. Algorithms search data from Medicare Fee-For-Service (FFS) claims. The 27 CCW algorithms are being replaced with 30 CCW algorithms starting with CY 2017 data files. See individual variable pages for a description of how the algorithms impact specific variables and the Chronic Conditions File Enhancements white paper for more detailed information. This file is a segment that can be requested in addition to the Master Beneficiary Summary File (MBSF) base file. CCW will no longer produce the 27 CCW Chronic Conditions file after the 2021 calendar year data file.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MBSF%2027%20Chronic%20Conditions_Version%20022023.xlsx",
        "sub-sections": None,
        "file-root": "MBSF_27_Cond"
    },
    {
        "tablename": "Master Beneficiary Summary File (MBSF): Other Chronic or Potentially Disabling Conditions Segment",
        "desc": "The Other Chronic or Potentially Disabling Conditions segment of the MBSF flags beneficiary records for the presence of 35 chronic or potentially disabling conditions not included in the original list of 27 conditions, including: Mental health. Tobacco use, alcohol and drug use. Developmental disorders. Disability-related conditions. Behavioral health. Other chronic physical conditions. What does this file include? (variable highlights) Two flags for each chronic condition: First ever occurrence date End of year indicator This file is a segment that can be requested in addition to the Master Beneficiary Summary File (MBSF) base file. Special considerations This file uses information from Fee-For-Service (FFS) Medicare claims.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout-%20MBSF%20Other_Version%20022023.xlsx",
        "sub-sections": None,
        "file-root": "MBSF_Other"
    },
    {
        "tablename": "Master Beneficiary Summary File (MBSF): Cost and Use Segment",
        "desc": "The Cost and Use file segment of the MBSF includes one record for each beneficiary enrolled in Medicare in the calendar year of the file. What does this file include? (variable highlights) Summary of utilization and total annual payments for services such as: physician visits, dialysis, DME, IP recorded emergency room visits, Ambulatory Surgical Centers, anesthesia, imaging, Part B drugs from Fee-for-service (FFS) Medicare Number of hospital stays, Medicare covered days and total annual inpatient payments for services covered by FFS Medicare Summary of Part D payments, events and prescription fills This file is a segment that can be requested in addition to the Master Beneficiary Summary File (MBSF) base file.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MBSF%20Cost%20and%20Utilization_Version%20022023.xlsx",
        "sub-sections": None,
        "file-root": "MBSF_Cost_and_Utilization"
    },
    # columns split {"tablename" : "Master Beneficiary Summary File (MBSF): National Death Index (NDI) Segment", "desc" : "What does this file include? (variable highlights) NDI date of death ICD-10 code for cause of death Underlying conditions for cause of death CDC category code for cause of death This file is a segment that can be requested in addition to the Master Beneficiary Summary File (MBSF) base file.", "urlToXlsx" : "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MBSF%20NDI_Version%20022023.xlsx", "sub-sections" : None},
    {
        "tablename": "Inpatient (Fee-for-Service)",
        "desc": "The Medicare Fee-For-Service Inpatient (IP) Claim File contains fee-for-service (FFS) claims submitted by inpatient hospital providers for reimbursement of facility costs. These claim records represent covered stays (Medicare paid FFS bills). This file is based on information from the CMS form 1450 (UB04). What does this file include? (variable highlights)Admission, discharge datesDiagnosis (ICD diagnosis)Procedure (ICD procedure code)FFS reimbursement amountHospital provider number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023.xlsx",
        "sub-sections": [
            "Base claim file",
            "Revenue center file",
            "Condition code file",
            "Occurrence code file",
            "Span code file",
            "Value code file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_IP_"
    },
    # {
    #     "tablename": "Medicare Provider Analysis and Review (MedPAR)",
    #     "desc": "The MedPAR file contains information about inpatient (IP) hospital and skilled nursing facility (SNF) stays that were covered by Medicare.  MedPAR records are created by rolling up information for a single stay from individual IP and SNF claims. The data on these claims was originally submitted on the CMS 1450 or UB04. This file includes (variable highlights)Diagnosis (ICD diagnosis),Procedure (ICD procedure code)Admission, discharge dates or end date of covered benefitsCharge amounts, total and assigned to specific departmentsFFS reimbursement amountHospital provider identification number Some dummy records for Medicare managed care coverage of IP stays.",
    #     "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20MedPAR_Version%20022023_0.xlsx",
    #     "sub-sections": None,
    #     "file-root": "MedPAR"
    # },
    {
        "tablename": "Outpatient (Fee-for-Service)",
        "desc": "The Outpatient file contains fee-for-service (FFS) claims submitted by institutional outpatient providers. Examples of institutional outpatient providers include hospital outpatient departments, rural health clinics, renal dialysis facilities, outpatient rehabilitation facilities, comprehensive outpatient rehabilitation facilities, Federally Qualified Health Centers and community mental health centers. The file includes facility charge amounts. This file is based on information from the CMS form 1450 (UB04). What does this file include? (variable highlights): Diagnosis (ICD diagnosis). Procedure (ICD procedure code). Healthcare Common Procedure Coding System (HCPCS) codes, including CPT codesDates of service. Medicare FFS reimbursement amount. Outpatient facility provider number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023_0.xlsx",
        "sub-sections": [
            "Base claim file",
            "Revenue center file",
            "Condition code file",
            "Occurrence code file",
            "Span code file",
            "Value code file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_HOP_"
    },
    {
        "tablename": "Carrier (Fee-for-Service)",
        "desc": "The Carrier File includes fee-for-service claims submitted by professional providers, including physicians, physician assistants, clinical social workers, nurse practitioners. Claims for some organizational providers, such as free-standing facilities are also found in the Carrier Claims File.  Examples include independent clinical laboratories, ambulance providers, free-standing ambulatory surgical centers and free-standing radiology centers. Researchers rarely use this file alone. This file is based on information from the CMS claim form 1500. What does this file include? (variable highlights). Diagnosis (ICD diagnosis). Procedure (CPT code). Dates of service. Charges. Allowed amounts. Reimbursement amount. Provider NPI number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023_1.xlsx",
        "sub-sections": [
            "Base claim file",
            "Line file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_Carrier_"
    },
    {
        "tablename": "Skilled Nursing Facility (Fee-for-Service)",
        "desc": "The Medicare Fee-for-Service  Skilled Nursing Facility (SNF) claim file contains information from paid bills submitted by SNF institutional facility providers. Skilled nursing care is the only level of nursing home care that is covered by the Medicare program. The information on the file records is based on the CMS form 1450 (UB04). What does this file include? (variable highlights): Diagnosis codes (ICD diagnosis). Procedure codes (ICD procedure). Admission/discharge dates. FFS Reimbursement amount. SNF provider number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023_2.xlsx",
        "sub-sections": [
            "Base claim file",
            "Revenue center file",
            "Condition code file",
            "Occurrence code file",
            "Span code file",
            "Value code file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_SNF_"
    },
    {
        "tablename": "Durable Medical Equipment (Fee-for-Service)",
        "desc": "The Durable Medical Equipment (DME) file contains fee-for-service claims submitted by Durable Medical Equipment suppliers to the DME Medicare Administrative Contractor (MAC). What does this file include? (variable highlights) Diagnosis, (ICD diagnosis code) Services provided (CMS Common Procedure Coding System (HCPCS) codes). Dates of service. Charge Reimbursement amounts. Supplier provider number. Supplier NPI.",
        "urlToXlsx": "https://resdac.org/cms-data/files/dme-ffs/data-documentation",
        "sub-sections": [
            "Base claim file",
            "Line file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_DME_"
    },
    {
        "tablename": "Home Health Agency (Fee-for-Service)",
        "desc": "The Medicare Fee-For-Service (FFS) Home Health Agency (HHA) containd FFS claims submitted by Medicare home health agency providers for reimbursement of home health covered services. This file is based on information from the CMS form 1450 (UB04). What does this file include? (variable highlights) Type of visit (eg: skilled care, home health aide, physical therapy) Quantity of services Diagnosis (ICD diagnosis), Dates of service Reimbursement amount Home health agency provider number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023_4.xlsx",
        "sub-sections": [
            "Base claim file",
            "Revenue center file",
            "Condition code file",
            "Occurrence code file",
            "Span code file",
            "Value code file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_HHA_"
    },
    {
        "tablename": "Hospice (Fee-for-Service)",
        "desc": "The Hospice file contains claims submitted by Medicare hospice providers. Records are included in the file regardless of whether the beneficiary is enrolled in fee-for-service (FFS) Medicare or Medicare Advantage (Medicare managed care.) This file is based on information from the CMS form 1450 (UB04). What does this file include? (variable highlights): The level of hospice care received (e.g., home health aide, skilled nursing care). Diagnosis (ICD diagnosis codes). The dates of serviceSubmitted charges. Reimbursement amounts. Hospice provider number.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Fee-For-Service_Version%20022023_5.xlsx",
        "sub-sections": [
            "Base claim file",
            "Revenue center file",
            "Condition code file",
            "Occurrence code file",
            "Span code file",
            "Value code file",
            "Demonstrations/Innovations code file",
        ],
        "file-root": "FFS_Hospice_"
    },
    {
        "tablename": "Inpatient (Encounter)",
        "desc": "The Medicare Inpatient (Encounter) file contains Medicare Advantage plan records for inpatient hospital stays. This file includes (variable highlights): Part C Benefit Package and Contract number. Diagnosis (ICD diagnosis). HCPCS code. Date of service (line date). NPI for line rendering physician. No payment information. Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_1.xlsx",
        "sub-sections": [
            "Base Claim File",
            "Revenue Center File",
            "Condition Code File",
            "Occurrence Code File",
            "Span Code File",
            "Value Code File",
        ],
        "file-root": "Encounter_IP and SNF ENC _"
    },
    {
        "tablename": "Outpatient (Encounter)",
        "desc": "The Medicare Outpatient (Encounter) file contains Medicare Advantage plan records from a variety of outpatient providers. Examples of institutional outpatient providers include hospital outpatient departments, rural health clinics, renal dialysis facilities, outpatient rehabilitation facilities, comprehensive outpatient rehabilitation facilities, Federally Qualified Health Centers and community mental health centers. This file includes (variable highlights): Diagnosis (ICD diagnosis) codes. HCPCS code. Revenue center codes, dates, unit counts. Part C Benefit Package and Contract number. Organization NPI number. No payment information. Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_0.xlsx",
        "sub-sections": [
            "Base Claim File",
            "Revenue Center File",
            "Condition Code File",
            "Occurrence Code File",
            "Span Code File",
            "Value Code File",
        ],
        "file-root": "Encounter_OP ENC_"
    },
    {
        "tablename": "Carrier (Encounter)",
        "desc": "The Medicare Carrier (Encounter) file includes Medicare Advantage plan records for professional providers, including physicians, physician assistants, clinical social workers, nurse practitioners. Records for some organizational providers are also found in the Carrier (Encounter) file. Examples include independent clinical laboratories, ambulance providers, freestanding ambulatory surgical centers and freestanding radiology centers. Researchers rarely use this file alone. This file includes (variable highlights): Part C Benefit Package and Contract number. Diagnosis (ICD diagnosis). HCPCS code. Date of service (line date). NPI for line rendering physician. No payment information. Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_1.xlsx",
        "sub-sections": ["Base Claim File", "Line File"],
        "file-root": "Encounter_CARRIER ENC_"
    },
    {
        "tablename": "Skilled Nursing Facility (Encounter)",
        "desc": "The Medicare Skilled Nursing Facility (Encounter) file includes Medicare Advantage plan records for skilled nursing facility stays. Skilled nursing care is the only level of nursing home care that is covered by the Medicare program. This file includes: Diagnosis codes (ICD diagnosis). Procedure codes (ICD procedure). Resource Utilization Group codes (RUGs). Admission/discharge dates. Organization NPI number only. No payment variables. Part C/Medicare Advantage benefit package and contract number. Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_2.xlsx",
        "sub-sections": [
            "Base Claim File",
            "Revenue Center File",
            "Condition Code File",
            "Occurrence Code File",
            "Span Code File",
            "Value Code File",
        ],
        "file-root": "Encounter_IP and SNF ENC _"
    },
    {
        "tablename": "Durable Medical Equipment (Encounter)",
        "desc": "The Medicare Durable Medical Equipment (Encounter) file includes Medicare Advantage plans records for medical supplies. This file includes (variable highlights): Part C Benefit Package and Contract number. Diagnosis (ICD diagnosis). HCPCS code. Organization NPI. NPI for line supplier. Date of service (line date). Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_3.xlsx",
        "sub-sections": ["Base Claim File", "Line File"],
        "file-root": "Encounter_DME ENC_"
    },
    {
        "tablename": "Home Health Agency (Encounter)",
        "desc": "The Medicare Home Health Agency (Encounter) file includes Medicare Advantage (MA) plan records for home health agency services. This file includes (variable highlights): Part C Benefit Package and Contract number. Diagnosis (ICD diagnosis) codes. HCPCS code. Revenue center codes, dates, unit counts. Organization NPI. NPI for line rendering physician. Patient discharge status code. No payment variables. Special considerations: Many Medicare Advantage Plans offer extra coverage in addition to services covered under traditional fee-for-service Medicare (e.g., vision, hearing, dental, and/or health and wellness programs). Encounter data may include records for some of these additional items and services provided under the plan.",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Record%20Layout%20-%20Medicare%20Encounter%20_Version%2006202_4.xlsx",
        "sub-sections": [
            "Base Claim File",
            "Revenue Center File",
            "Condition Code File",
            "Occurrence Code File",
            "Span Code File",
            "Value Code File",
        ],
        "file-root": "Encounter_HHA ENC_"
    },
    {
        "tablename": "Risk Score Files",
        "desc": "The Risk Score Files are created from the final CMS risk adjustment model outputs for a payment year. These risk scores are used to adjust CMS payments to Medicare Advantage (Part C) plans to account for differences in relative costs among plan enrollees. At this time, only Payment Year (PY)14 risk score files are available for research use. Please see the Medicare Managed Care Manual, Chapter 7 for a discussion of risk adjustment in the Medicare Advantage program. What does this file include? (variable highlights): PY14 Base file: Part C monthly risk payment scores Part C monthly model segment codes. Part D model risk payment scores. Part D monthly model segment codes. Part C monthly institutional indicators. Part C community and institutional non-monthly model payment scores. Part D non-monthly model payment scores. Model Medicaid flag. PY14 Model Output Segments: Model output raw risk scores from 4 Part C model versions, one for ESRD. Model output raw risk score from 1 Part D model version. Model-specific Hierarchal Condition Codes (HCCs). Model-specific disability information. ESRD model-specific information. Part D model output including drug HCCs (RXHCCs)",
        "urlToXlsx": "https://resdac.org/sites/datadocumentation.resdac.org/files/CCW%20Codebook%20-%20Medicare%20Risk%20Score%20Files%20_Version%20062023.pdf",
        "sub-sections": None,
        "file-root": "Risk_Score"
    },
]

#
#
#
#
#
#
#
