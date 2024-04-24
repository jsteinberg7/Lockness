import pandas as pd
import sqlite3
from mimesis import Field, Schema

class QueryMocker:
    def __init__(self, data: str, columns_to_use: list):
        self.data = data
        self.columns_to_use = columns_to_use
        self.connection = None
        self.mock_db_name = "mock_db.db"

    def create_mock_sql_db(self):
        # Create a connection to the mock SQLite database
        self.connection = sqlite3.connect(self.mock_db_name)

    def populate_mock_sql_db(self):
        # Parse the data string and extract the required columns
        data_rows = self.data.split("\n")
        column_names = [row.split(":")[0].strip() for row in data_rows if ":" in row]
        column_types = [row.split(":")[1].split(",")[1].strip() for row in data_rows if ":" in row]

        # Create a dictionary to map column types to Mimesis field types
        type_field_map = {
            "CHAR": Field("person.letter"),
            "NUM": Field("numbers.float_number"),
            "FLOAT": Field("numbers.float_number"),
            "DATE": Field("datetime.date"),
            "BOOL": Field("development.boolean"),
            "INT": Field("numbers.integer_number"),
            "TEXT": Field("text.text"),
            "VARCHAR": Field("text.text"),
            "TIME": Field("datetime.time"),
            "TIMESTAMP": Field("datetime.datetime"),
        }

        # Create a schema for the mock data
        schema = Schema()
        for col, col_type in zip(self.columns_to_use, column_types):
            field_type = type_field_map.get(col_type, Field("text.text"))
            schema.add_field(col, field_type)

        # Generate the mock DataFrame using Mimesis
        data = schema.create(iterations=100)
        df = pd.DataFrame(data)

        # Write the DataFrame to the mock SQLite database
        df.to_sql("mock_table", self.connection, index=False, if_exists="replace")

    def run_mock_query(self, query: str):
        try:
            # Execute the query on the mock SQLite database
            result = pd.read_sql_query(query, self.connection)
            return result
        except Exception as e:
            print(f"Error executing query: {str(e)}")
            return None

    def close_connection(self):
        # Close the connection to the mock SQLite database
        if self.connection:
            self.connection.close()