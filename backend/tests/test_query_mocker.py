import sys
sys.path.append('..')

from services.query_mocker import QueryMocker


def test_query_mocker_simple():
    query = "SELECT * FROM mytable;"
    columns = ["id", "name", "age"]
    mocker = QueryMocker(query, columns)
    result = mocker.run_mock_query()
    assert result == True

def test_query_mocker_realistic():
    # load string from txt file to use columns
    test_cols_str = open("test_columns.txt", "r")
    test_cols = test_cols_str.read().splitlines()
    test_cols_str.close()

    query = """
SELECT COUNT(*) AS beneficiaries_with_lung_cancer
FROM Master_Beneficiary_Summary_File_MBSF_Base AS mbsf_base
JOIN Master_Beneficiary_Summary_File_MBSF_30_CCW_Chronic_Conditions_Segment AS mbsf_chronic
ON mbsf_base.BENE_ID = mbsf_chronic.BENE_ID
WHERE mbsf_base.STATE_CD = 'KY'
AND mbsf_chronic.CANCER_LUNG_EVER IS NOT NULL
AND mbsf_chronic.BENE_ENROLLMT_REF_YR = 2021;
"""
    mocker = QueryMocker(query, test_cols)
    result = mocker.run_mock_query()
    assert result == True