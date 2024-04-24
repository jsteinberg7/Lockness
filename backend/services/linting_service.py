from sqlfluff.core import Linter
from sqlfluff.core.errors import SQLParseError
from sqlfluff.core.linter import LintingResult


class LintingService:

    @staticmethod
    def lint_sql(sql_string):
        # Create a new linter instance
        linter = Linter(dialect="ansi")

        # Lint the SQL string
        try:
            linting_result = linter.lint_string(sql_string)
        except SQLParseError as e:
            # add the error to the linting result
            linting_result = LintingResult(
                violations=[
                    {
                        "description": "str(e.message)",
                        "line_no": e.line_no,
                        "rule_code": "SQLPARSEERROR",
                    },
                ]
            )


        filtered_violations = []
        
        # Filter out the linting errors and warnings to only include ones we care about
        for violation in linting_result.get_violations():
            # print(f"Line {violation.line_no}: {violation.description}, {violation.rule_code}")
            if not violation.description in [
                "Query produces an unknown number of result columns.",
                "Unnecessary trailing whitespace at end of file.",
                "Files must end with a trailing newline.",
                "Files must not begin with newlines or whitespace."
            ]:
                filtered_violations.append(violation)

        # Return the number of linting errors and warnings
        return filtered_violations
