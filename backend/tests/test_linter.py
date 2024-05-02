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
    violations, errors = LintingService.lint_sql(sql)
    assert len(violations) == 0
    assert len(errors) == 0

def test_lint_sql_valid2():
    sql = """
SELECT *
FROM mytable
WHERE
    id = 1
    AND name = 'John';
    """
    violations, errors = LintingService.lint_sql(sql)
    assert len(violations) == 0
    assert len(errors) == 0

def test_lint_sql_valid3():
    sql = """
SELECT STATE_CD, DEATH_DT, RFRNC_YR, BENE_ID
FROM Master_Beneficiary_Summary_File_Base
JOIN Inpatient_FeeForService USING (BENE_ID)
JOIN Outpatient_FeeForService USING (BENE_ID)
JOIN Carrier_FeeForService USING (BENE_ID)
WHERE STATE_CD = 'KS'
AND EXTRACT(YEAR FROM DEATH_DT) = 2018;
    """
    violations, errors = LintingService.lint_sql(sql)
    assert len(violations) == 0
    assert len(errors) == 0

def test_lint_sql_invalid_select():
    sql = """
SELECT *
regewrg mytable;
"""
    violations, errors = LintingService.lint_sql(sql)
    assert len(errors) >= 1
    assert "Found unparsable section:" in errors[0]


def test_lint_sql_invalid_where():
    sql = """
SELECT *
FROM mytable
WHERE
AND column = value;
"""
    violations, errors = LintingService.lint_sql(sql)
    assert len(errors) >= 1
    assert "Found unparsable section:" in errors[0]


def test_lint_sql_invalid_order_by():
    sql = """
SELECT *
FROM mytable
ORDER BY;
"""
    violations, errors = LintingService.lint_sql(sql)
    assert len(errors) >= 1
    assert "Found unparsable section:" in errors[0]







    # Check that the expected violation is reported
    # expected_violation = "syntax error"
    # assert any(expected_violation in str(violation) for violation in violations)