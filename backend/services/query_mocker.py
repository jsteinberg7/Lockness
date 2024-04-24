class QueryMocker:
    def __init__(self, query: str, columns: list):
        self.query = query
        self.columns = columns

    def run_mock_query(self):
        # first, populate a "fake" db using the specified columns and query
        # then, run the query on the fake db
        return True