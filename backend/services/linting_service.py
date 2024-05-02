from sqlfluff.core import Linter
from sqlfluff.core.errors import SQLParseError
from sqlfluff.core.linter import LintingResult


class LintingService:

    @staticmethod
    def lint_sql(sql_string):
        # Create a new linter instance
        linter = Linter(dialect="ansi")
        filtered_violations = []
        errors = []

        # Lint the SQL string
        try:
            linting_result = linter.lint_string(sql_string)
            violations =  linting_result.get_violations()
            
        except SQLParseError as e:
            # add the error to the linting result
            errors.append(str(e))
        
        # FOR NOW, ONLY RETURN THE ERRORS (ignore the violations)
        # Filter out the linting errors and warnings to only include ones we care about
        for violation in linting_result.get_violations():
            # Filter out errors/warnings we don't care about
            # if not violation.description in [
            #     "Query produces an unknown number of result columns.",
            #     "Unnecessary trailing whitespace at end of file.",
            #     "Files must end with a trailing newline.",
            #     "Files must not begin with newlines or whitespace.",
            #     "Unnecessary trailing whitespace.",
            # ]:
            #     filtered_violations.append(violation)
            if type(violation).__name__ == "SQLParseError":
                errors.append(str(violation.description))
                

        # Return the number of linting errors and warnings
        return filtered_violations, errors
