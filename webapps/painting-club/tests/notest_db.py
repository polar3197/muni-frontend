import pytest

from db.client import PostgreSQLClient
from config import PostgreSQLConfig
import asyncio

pgconf = PostgreSQLConfig()
pgcli = PostgreSQLClient(pgconf)


# =========== TEST CONNECTION ==============
class TestConnection():

    def test_connection():
        response = asyncio.run(pgcli.ping())
        return response

    def fetch_tables():
        response = asyncio.run(pgcli.get_table_contents("users"))
        return response
    

# =========== TEST SPEED ==============
class TestSpeed():
    
    def test_connection():
        response = asyncio.run(pgcli.ping())
        return response

    def fetch_tables():
        response = asyncio.run(pgcli.get_table_contents("users"))
        return response