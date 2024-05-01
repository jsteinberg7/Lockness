import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from services.linting_service import LintingService

def test_lint_sql_valid():
    sql = """
SELECT *
FROM mytable
WHERE id = 1;
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) == 0

def test_lint_sql_valid2():
    sql = """
SELECT *
FROM mytable
WHERE
    id = 1
    AND name = 'John';
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) == 0

def test_lint_sql_valid3():
    sql = """
SELECT STATE_CD, DEATH_DT, RFRNC_YR, BENE_ID
FROM Master_Beneficiary_Summary_File_Base
JOIN Inpatient_FeeForService USING (BENE_ID)
JOIN Outpatient_FeeForService USING (BENE_ID)
JOIN Carrier_FeeForService USING (BENE_ID)
WHERE STATE_CD = 'KS'
AND EXTRACT(YEAR FROM DEATH_DT) = 2018
AND -- Add additional conditions here to identify car accident-related deaths, e.g., diagnosis codes.
;
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) == 0

def test_lint_sql_invalid():
    sql = """
SELECT *
regewrg mytable;
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) == 1

    print(violations)
    assert "Found unparsable section:" in violations[0].description

    # Check that the expected violation is reported
    # expected_violation = "syntax error"
    # assert any(expected_violation in str(violation) for violation in violations)