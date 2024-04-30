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
WHERE id = 1
AND name = 'John';
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) == 0

def test_lint_sql_invalid():
    sql = """
SELECT *
regewrg mytable;
    """
    violations = LintingService.lint_sql(sql)
    assert len(violations) > 0

    print(violations)

    # Check that the expected violation is reported
    # expected_violation = "syntax error"
    # assert any(expected_violation in str(violation) for violation in violations)